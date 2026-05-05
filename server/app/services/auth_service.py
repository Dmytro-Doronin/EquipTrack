from sqlalchemy.orm import Session

from app.errors.validation_error import raise_validation_error
from app.repositories.command_repositories.pending_registration_command_repository import (
    PendingRegistrationCommandRepository,
)
from app.repositories.query_repositories.pending_registration_query_repository import (
    PendingRegistrationQueryRepository,
)
from app.repositories.query_repositories.user_query_repository import UserQueryRepository
from app.schemas.auth import SignUpFormData
from app.services.email_service import EmailService
from app.services.password_service import PasswordService
from app.services.verification_code_service import VerificationCodeService


class AuthService:
    def __init__(self, db: Session):
        self.user_query_repository = UserQueryRepository(db)

        self.pending_registration_query_repository = (
            PendingRegistrationQueryRepository(db)
        )
        self.pending_registration_command_repository = (
            PendingRegistrationCommandRepository(db)
        )

        self.password_service = PasswordService()
        self.verification_code_service = VerificationCodeService()
        self.email_service = EmailService()

    async def start_signup(self, form_data: SignUpFormData) -> dict:
        existing_user = self.user_query_repository.find_by_email(
            str(form_data.email),
        )

        if existing_user is not None:
            raise_validation_error({
                "email": ["Email already exists"],
            })

        verification_code = self.verification_code_service.generate_code()

        password_hash = self.password_service.hash_password(
            form_data.password,
        )

        verification_code_hash = self.password_service.hash_password(
            verification_code,
        )

        existing_pending_registration = (
            self.pending_registration_query_repository.find_by_email(
                str(form_data.email),
            )
        )

        if existing_pending_registration is not None:
            pending_registration = (
                self.pending_registration_command_repository.update_pending_registration(
                    pending_registration=existing_pending_registration,
                    login=form_data.login,
                    password_hash=password_hash,
                    verification_code_hash=verification_code_hash,
                    avatar_url=None,
                )
            )
        else:
            pending_registration = (
                self.pending_registration_command_repository.create_pending_registration(
                    login=form_data.login,
                    email=str(form_data.email),
                    password_hash=password_hash,
                    verification_code_hash=verification_code_hash,
                    avatar_url=None,
                )
            )

        await self.email_service.send_verification_code(
            email=pending_registration.email,
            code=verification_code,
        )

        return {
            "email": pending_registration.email,
            "nextStep": "verify-email",
        }