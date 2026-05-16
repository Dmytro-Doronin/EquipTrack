from sqlalchemy.orm import Session
from fastapi import HTTPException
import secrets
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
from app.schemas.auth import (
    AuthTokenResult,
    AuthUserResponse,
    ConfirmSignupCodeSchema,
    SignUpFormData,
    EmailSchema,
    SigninSchema,
)
from app.schemas.token import AccessTokenCreatePayload, RefreshTokenCreatePayload
from app.services.email_service import EmailService
from app.services.password_service import PasswordService
from app.services.verification_code_service import VerificationCodeService
from app.services.s3_storage_service import S3StorageService
from datetime import UTC, datetime, timedelta

from app.repositories.command_repositories.session_command_repository import SessionCommandRepository
from app.core.config import settings
from app.services.auth_token_service import AuthTokenService
from app.services.token_service import TokenService
from app.models.user import User
from app.repositories.query_repositories.password_reset_token_query_repository import PasswordResetTokenQueryRepository
from app.repositories.command_repositories.password_reset_token_command_repository import PasswordResetTokenCommandRepository


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

        self.session_command_repository = SessionCommandRepository(db)

        self.auth_token_service = AuthTokenService(db)
        self.token_service = TokenService()

        self.password_reset_token_query_repository = PasswordResetTokenQueryRepository(db)
        self.password_reset_token_command_repository = PasswordResetTokenCommandRepository(db)

    def _format_auth_user(self, user: User) -> AuthUserResponse:
        return {
            "id": user.id,
            "login": user.login,
            "email": user.email,
            "avatarUrl": user.avatar_url,
            "role": user.role,
        }

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

    async def resend_signup_code(self, data: EmailSchema) -> dict:
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

    async def signin(
        self,
        data: SigninSchema,
        user_agent: str | None,
        ip_address: str | None,
    ) -> AuthTokenResult:
        user = self.user_query_repository.find_by_email(
            email=data.email,
        )

        if user is None:
            raise_validation_error({
                "email": ["Invalid email or password"],
            })

        is_password_valid = self.password_service.verify_password(
            plain_password=data.password,
            hashed_password=user.password_hash,
        )

        if not is_password_valid:
            raise_validation_error({
                "password": ["Invalid email or password"],
            })

        access_token = self.token_service.create_access_token(
            payload=AccessTokenCreatePayload(
                sub=str(user.id),
                role=user.role,
            ),
        )

        refresh_token_expires_at = datetime.now(UTC) + timedelta(
            days=settings.refresh_token_expires_days,
        )

        user_session = self.session_command_repository.create_pending_session(
            user_id=user.id,
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=refresh_token_expires_at,
        )

        refresh_token = self.token_service.create_refresh_token(
            payload=RefreshTokenCreatePayload(
                sub=str(user.id),
                sid=str(user_session.id),
            ),
        )

        refresh_token_hash = self.password_service.hash_password(
            password=refresh_token,
        )

        self.session_command_repository.rotate_refresh_token(
            user_session=user_session,
            refresh_token_hash=refresh_token_hash,
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=refresh_token_expires_at,
        )

        return {
            "user": self._format_auth_user(user),
            "accessToken": access_token,
            "refreshToken": refresh_token,
        }

    async def refresh_token(
        self,
        refresh_token: str | None,
        user_agent: str | None,
        ip_address: str | None,
    ) -> AuthTokenResult:
        validated_session = self.auth_token_service.validate_refresh_session(
            refresh_token,
        )
        user_session = validated_session.session

        user = self.user_query_repository.find_by_id(user_session.user_id)

        if user is None:
            self.session_command_repository.revoke_session(user_session)

            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Invalid or expired refresh token",
                },
            )

        access_token = self.token_service.create_access_token(
            payload=AccessTokenCreatePayload(
                sub=str(user.id),
                role=user.role,
            ),
        )

        new_refresh_token = self.token_service.create_refresh_token(
            payload=RefreshTokenCreatePayload(
                sub=str(user.id),
                sid=str(user_session.id),
            ),
        )
        new_refresh_token_hash = self.password_service.hash_password(
            password=new_refresh_token,
        )
        new_refresh_token_expires_at = datetime.now(UTC) + timedelta(
            days=settings.refresh_token_expires_days,
        )

        self.session_command_repository.rotate_refresh_token(
            user_session=user_session,
            refresh_token_hash=new_refresh_token_hash,
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=new_refresh_token_expires_at,
        )

        return {
            "user": self._format_auth_user(user),
            "accessToken": access_token,
            "refreshToken": new_refresh_token,
        }

    async def logout(self, refresh_token: str | None) -> None:
        validated_session = self.auth_token_service.try_validate_refresh_session(
            refresh_token,
        )

        if validated_session is None:
            return

        self.session_command_repository.revoke_session(validated_session.session)

    async def request_reset_password(self, data: EmailSchema) -> None:
        existed_user = self.user_query_repository.find_by_email(email=data.email)

        if existed_user is None:
            return

        raw_token = secrets.token_urlsafe(32)
        token_hash = self.password_service.hash_password(raw_token)

        expires_at = datetime.now(UTC) + timedelta(minutes=15)

        self.password_reset_token_command_repository.revoke_active_tokens_for_user(
            user_id=existed_user.id,
        )