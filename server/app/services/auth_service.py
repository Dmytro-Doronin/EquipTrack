from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.errors.validation_error import raise_validation_error
from app.repositories.command_repositories.pending_registration_command_repository import (
    PendingRegistrationCommandRepository,
)
from app.repositories.command_repositories.user_commond_repository import (
    UserCommandRepository,
)
from app.repositories.query_repositories.pending_registration_query_repository import (
    PendingRegistrationQueryRepository,
)
from app.repositories.query_repositories.user_query_repository import UserQueryRepository
from app.schemas.auth import ConfirmSignupCodeSchema, SignUpFormData, ResendCodeSchema
from app.services.email_service import EmailService
from app.services.password_service import PasswordService
from app.services.verification_code_service import VerificationCodeService
from app.services.s3_storage_service import S3StorageService
from datetime import UTC, datetime, timedelta
class AuthService:
    def __init__(self, db: Session):
        self.user_query_repository = UserQueryRepository(db)
        self.user_command_repository = UserCommandRepository(db)

        self.pending_registration_query_repository = (
            PendingRegistrationQueryRepository(db)
        )
        self.pending_registration_command_repository = (
            PendingRegistrationCommandRepository(db)
        )
        self.storage_service = S3StorageService()
        self.password_service = PasswordService()
        self.verification_code_service = VerificationCodeService()
        self.email_service = EmailService()

    async def start_signup(self, form_data: SignUpFormData) -> dict:
        existing_user = self.user_query_repository.find_by_email(
            email=form_data.email,
        )

        if existing_user is not None:
            raise_validation_error({
                "email": ["Email already exists"],
            })

        verification_code = self.verification_code_service.generate_code()
        resend_available_at = datetime.now(UTC) + timedelta(seconds=30)
        password_hash = self.password_service.hash_password(
            password=form_data.password,
        )

        verification_code_hash = self.password_service.hash_password(
            password=verification_code,
        )

        avatar_url = await self.storage_service.upload_avatar(avatar=form_data.avatar)

        existing_pending_registration = (
            self.pending_registration_query_repository.find_by_email(
                email=form_data.email,
            )
        )

        if existing_pending_registration is not None:
            pending_registration = (
                self.pending_registration_command_repository.update_pending_registration(
                    pending_registration=existing_pending_registration,
                    login=form_data.login,
                    password_hash=password_hash,
                    verification_code_hash=verification_code_hash,
                    avatar_url=avatar_url,
                    resend_available_at=resend_available_at
                )
            )
        else:
            pending_registration = (
                self.pending_registration_command_repository.create_pending_registration(
                    login=form_data.login,
                    email=form_data.email,
                    password_hash=password_hash,
                    verification_code_hash=verification_code_hash,
                    avatar_url=avatar_url,
                    resend_available_at=resend_available_at
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

    def confirm_signup(self, data: ConfirmSignupCodeSchema) -> dict:
        pending_registration = (
            self.pending_registration_query_repository.find_by_email(
                data.email,
            )
        )

        if pending_registration is None:
            raise_validation_error({
                "code": ["Invalid or expired verification code"],
            })

        if pending_registration.expires_at < datetime.now(UTC):
            self.pending_registration_command_repository.delete_pending_registration(
                pending_registration,
            )

            raise_validation_error({
                "code": ["Verification code has expired"],
            })

        if pending_registration.attempts >= 5:
            self.pending_registration_command_repository.delete_pending_registration(
                pending_registration,
            )

            raise_validation_error({
                "code": ["Too many attempts. Please start signup again"],
            })

        is_code_valid = self.password_service.verify_password(
            plain_password=data.code,
            hashed_password=pending_registration.verification_code_hash,
        )

        if not is_code_valid:
            self.pending_registration_command_repository.increment_attempts(
                pending_registration,
            )

            raise_validation_error({
                "code": ["Invalid verification code"],
            })

        existing_user = self.user_query_repository.find_by_email(
            pending_registration.email,
        )

        if existing_user is not None:
            self.pending_registration_command_repository.delete_pending_registration(
                pending_registration,
            )

            raise_validation_error({
                "email": ["Email already exists"],
            })

        user = self.user_command_repository.create_user(
            login=pending_registration.login,
            email=pending_registration.email,
            password_hash=pending_registration.password_hash,
            avatar_url=pending_registration.avatar_url,
            role="user",
        )

        self.pending_registration_command_repository.delete_pending_registration(
            pending_registration,
        )

        return {
            "id": user.id,
            "login": user.login,
            "email": user.email,
            "avatarUrl": user.avatar_url,
            "createdAt": user.created_at.isoformat(),
        }

    async def resend_signup_code(self, data: ResendCodeSchema) -> dict:
        pending_registration = (
            self.pending_registration_query_repository.find_by_email(
                email=data.email,
            )
        )

        if pending_registration is None:
            raise_validation_error({
                "email": ["Signup session not found"],
            })

        now = datetime.now(UTC)

        if (
                pending_registration.resend_available_at is not None
                and now < pending_registration.resend_available_at
        ):
            seconds_left = int(
                (pending_registration.resend_available_at - now).total_seconds()
            )

            raise_validation_error({
                "resend": [f"Please wait {seconds_left} seconds before requesting a new code"],
            })

        verification_code = self.verification_code_service.generate_code()

        verification_code_hash = self.password_service.hash_password(
            password=verification_code,
        )

        pending_registration = (
            self.pending_registration_command_repository.update_verification_code(
                pending_registration=pending_registration,
                verification_code_hash=verification_code_hash,
                expires_at=now + timedelta(minutes=10),
                resend_available_at=now + timedelta(seconds=30),
            )
        )

        await self.email_service.send_verification_code(
            email=pending_registration.email,
            code=verification_code,
        )

        return {
            "email": pending_registration.email,
            "resendAvailableIn": 30,
        }

