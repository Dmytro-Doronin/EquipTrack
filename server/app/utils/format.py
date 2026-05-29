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