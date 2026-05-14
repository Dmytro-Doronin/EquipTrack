from collections.abc import Callable
from typing import Annotated, NoReturn

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.repositories.query_repositories.user_query_repository import UserQueryRepository
from app.services.token_service import TokenService


def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
    db: Session = Depends(get_db),
) -> User:
    access_token = _get_bearer_token(authorization)

    try:
        access_token_payload = TokenService().decode_access_token(access_token)
        user_id = int(access_token_payload.sub)
    except Exception:
        _raise_invalid_access_token()

    user = UserQueryRepository(db).find_by_id(user_id)

    if user is None:
        _raise_invalid_access_token()

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_roles(*roles: str) -> Callable[[User], User]:
    def role_dependency(current_user: CurrentUser) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "message": "Forbidden",
                },
            )

        return current_user

    return role_dependency


def _get_bearer_token(authorization: str | None) -> str:
    if authorization is None:
        _raise_unauthorized("Access token is required")

    token_type, _, token = authorization.partition(" ")

    if token_type.lower() != "bearer" or not token:
        _raise_invalid_access_token()

    return token


def _raise_invalid_access_token() -> NoReturn:
    _raise_unauthorized("Invalid or expired access token")


def _raise_unauthorized(message: str) -> NoReturn:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={
            "message": "Unauthorized",
            "errors": {
                "accessToken": [message],
            },
        },
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )