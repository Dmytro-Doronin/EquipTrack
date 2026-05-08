from fastapi import APIRouter, Depends

from app.validators.sign_up_validator import validate_sign_up_form
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.dependencies.auth_dependencies import get_auth_service
from app.services.auth_service import AuthService
from app.schemas.auth import ConfirmSignupCodeSchema, SignUpFormData, ResendCodeSchema
from app.validators.confirm_signup_code_validator import (
    validate_confirm_signup_code_form,
)
from app.validators.resend_code_validator import validate_resend_code_form

router = APIRouter(prefix="/auth", tags=["auth"])


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
        data: ResendCodeSchema = Depends(validate_resend_code_form),
        auth_service: AuthService = Depends(get_auth_service),
):

    user = auth_service.resend_signup_code(data)

    return {
        "success": True,
        "message": "Account created successfully",
        "data": user,
    }