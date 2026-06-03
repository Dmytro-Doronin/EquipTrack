from datetime import UTC, datetime

from app.schemas.auth import AuthUserResponse
from app.models.user import User


def format_auth_user(user: User) -> AuthUserResponse:
    return {
        "id": user.id,
        "login": user.login,
        "email": user.email,
        "avatarUrl": user.avatar_url,
        "role": user.role,
    }


def format_datetime_z(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)

    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")
