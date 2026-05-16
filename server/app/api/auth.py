from fastapi import APIRouter, Cookie, Depends, Request, Response, HTTPException, status

from app.api.dependencies.auth import CurrentUser
from app.core.config import settings
from app.validators.sign_up_validator import validate_sign_up_form
from app.dependencies.auth_dependencies import get_auth_service
from app.services.auth_service import AuthService
from app.schemas.auth import (
    AuthUserResponse,
    ConfirmSignupCodeSchema,
    SignUpFormData,
    EmailSchema,
    SigninSchema,
)
from app.models.user import User
from app.validators.confirm_signup_code_validator import (
    validate_confirm_signup_code_form,
)
from app.validators.resend_code_validator import validate_email_address
from app.validators.signin_validator import validate_signin

router = APIRouter(prefix="/auth", tags=["auth"])


def format_auth_user(user: User) -> AuthUserResponse:
    return {
        "id": user.id,
        "login": user.login,
        "email": user.email,
        "avatarUrl": user.avatar_url,
        "role": user.role,
    }


def set_refresh_token_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * settings.refresh_token_expires_days,
        path="/api/auth",
    )


def clear_refresh_token_cookie(response: Response) -> None:
    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        httponly=True,
        secure=False,
        samesite="lax",
    )


@router.post("/signup/start")
async def start_signup(
    form_data: SignUpFormData = Depends(validate_sign_up_form),
    auth_service: AuthService = Depends(get_auth_service),
):
    data = await auth_service.start_signup(form_data)

    return {
        "success": True,
        "data": data,
    }

@router.post("/signup/confirm")
async def confirm_signup(
    data: ConfirmSignupCodeSchema = Depends(validate_confirm_signup_code_form),
    auth_service: AuthService = Depends(get_auth_service),
):
    user = auth_service.confirm_signup(data)

    return {
        "success": True,
        "message": "Account created successfully",
        "data": user,
    }

@router.post("/signup/resend-code")
async def resend_code(
        data: EmailSchema = Depends(validate_email_address),
        auth_service: AuthService = Depends(get_auth_service),
):

    user = await auth_service.resend_signup_code(data)

    return {
        "success": True,
        "message": "Account created successfully",
        "data": user,
    }

@router.post("/signin")
async def login(
    request: Request,
    response: Response,
    data: SigninSchema = Depends(validate_signin),
    auth_service: AuthService = Depends(get_auth_service),
):
    client = request.client
    result = await auth_service.signin(
        data=data,
        user_agent=request.headers.get("user-agent"),
        ip_address=client.host if client is not None else None,
    )

    set_refresh_token_cookie(response, result["refreshToken"])

    return {
        "success": True,
        "message": "Signed in successfully",
        "data": {
            "user": result["user"],
            "accessToken": result["accessToken"],
        },
    }


@router.post("/refresh-token")
async def refresh_token(
    request: Request,
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    auth_service: AuthService = Depends(get_auth_service),
):

    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "message": "Refresh token is missing",
            },
        )

    client = request.client
    result = await auth_service.refresh_token(
        refresh_token=refresh_token,
        user_agent=request.headers.get("user-agent"),
        ip_address=client.host if client is not None else None,
    )

    set_refresh_token_cookie(response, result["refreshToken"])

    return {
        "success": True,
        "message": "Token refreshed successfully",
        "data": {
            "user": result["user"],
            "accessToken": result["accessToken"],
        },
    }


@router.post("/logout")
async def logout(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    auth_service: AuthService = Depends(get_auth_service),
):
    await auth_service.logout(refresh_token)
    clear_refresh_token_cookie(response)

    return {
        "success": True,
        "message": "Logged out successfully",
    }


@router.get("/me")
async def me(
    current_user: CurrentUser,
):
    return {
        "success": True,
        "data": format_auth_user(current_user),
    }

@router.post("/request-reset-password")
async def request_password_reset(
    data: EmailSchema = Depends(validate_email_address),
    auth_service: AuthService = Depends(get_auth_service),
):

    await auth_service.request_reset_password(data)
    return {
        "success": True,
        "message": "Password reset requested",
    }
