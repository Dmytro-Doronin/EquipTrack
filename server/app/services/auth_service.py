from sqlalchemy.orm import Session

from app.repositories.query_repositories.user_query_repository import UserQueryRepository
from app.repositories.command_repositories.user_commond_repository import UserCommandRepository
from app.schemas.auth import SignUpFormData
from app.errors.validation_error import raise_validation_error

class AuthService:
    def __init__(self, db: Session):
        self.user_query_repository = UserQueryRepository(db)
        self.user_command_repository = UserCommandRepository(db)

    def create_user(self, form_data: SignUpFormData) -> dict:
        existing_user = self.user_query_repository.find_by_email(str(form_data.email))

        if existing_user is not None:
            raise_validation_error({
                "email": ["Email already exists"],
            })

        password_hash = f"hashed_{form_data.password}"

        user = self.user_command_repository.create_user(
            login=form_data.login,
            email=str(form_data.email),
            password_hash=password_hash,
            avatar_url=None,
        )

        return {
            "id": user.id,
            "login": user.login,
            "email": user.email,
            "avatarUrl": user.avatar_url,
            "createdAt": user.created_at.isoformat(),
        }