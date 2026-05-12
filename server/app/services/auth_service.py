from sqlalchemy.orm import Session
from fastapi import HTTPException

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
from app.repositories.query_repositories.session_query_repository import (
    SessionQueryRepository,
)
from app.repositories.query_repositories.user_query_repository import UserQueryRepository
from app.schemas.auth import ConfirmSignupCodeSchema, SignUpFormData, ResendCodeSchema, SigninSchema
from app.services.email_service import EmailService
from app.services.password_service import PasswordService
from app.services.verification_code_service import VerificationCodeService
from app.services.s3_storage_service import S3StorageService
from datetime import UTC, datetime, timedelta

from app.repositories.command_repositories.session_command_repository import SessionCommandRepository
from app.core.config import settings
from app.services.token_service import TokenService


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
        self.session_query_repository = SessionQueryRepository(db)

        self.token_service = TokenService()

    def _format_auth_user(self, user) -> dict:
        return {
            "id": user.id,
            "login": user.login,
            "email": user.email,
            "avatarUrl": user.avatar_url,
            "role": user.role,
        }

    def _get_refresh_token_session_id(self, refresh_token_payload: dict) -> int:
        raw_session_id = refresh_token_payload.get("sid")

        if not isinstance(raw_session_id, str):
            raise_validation_error({
                "refreshToken": ["Invalid or expired refresh token"],
            })

        try:
            return int(raw_session_id)
        except ValueError:
            raise_validation_error({
                "refreshToken": ["Invalid or expired refresh token"],
            })

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

    async def signin(
        self,
        data: SigninSchema,
        user_agent: str | None,
        ip_address: str | None,
    ) -> dict:
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
            payload={
                "sub": str(user.id),
                "role": user.role,
            },
        )

        refresh_token_expires_at = datetime.now(UTC) + timedelta(
            days=settings.refresh_token_expires_days,
        )

        pending_refresh_token_hash = self.password_service.hash_password(
            password=self.token_service.create_refresh_token(
                payload={
                    "sub": str(user.id),
                    "sid": "pending",
                    "type": "refresh",
                },
            ),
        )

        user_session = self.session_command_repository.create_pending_session(
            user_id=user.id,
            refresh_token_hash=pending_refresh_token_hash,
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=refresh_token_expires_at,
        )

        refresh_token = self.token_service.create_refresh_token(
            payload={
                "sub": str(user.id),
                "sid": str(user_session.id),
                "type": "refresh",
            },
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
    ) -> dict:
        if refresh_token is None:
            raise_validation_error({
                "refreshToken": ["Refresh token is required"],
            })

        refresh_token_payload = self.token_service.decode_refresh_token(refresh_token)
        session_id = self._get_refresh_token_session_id(refresh_token_payload)

        user_session = self.session_query_repository.find_active_by_id(session_id)

        if user_session is None:
            raise_validation_error({
                "refreshToken": ["Invalid or expired refresh token"],
            })

        if refresh_token_payload.get("sub") != str(user_session.user_id):
            raise_validation_error({
                "refreshToken": ["Invalid or expired refresh token"],
            })

        is_refresh_token_valid = self.password_service.verify_password(
            plain_password=refresh_token,
            hashed_password=user_session.refresh_token_hash,
        )

        if not is_refresh_token_valid:
            raise_validation_error({
                "refreshToken": ["Invalid or expired refresh token"],
            })

        user = self.user_query_repository.find_by_id(user_session.user_id)

        if user is None:
            self.session_command_repository.revoke_session(user_session)

            raise_validation_error({
                "refreshToken": ["Invalid or expired refresh token"],
            })

        access_token = self.token_service.create_access_token(
            payload={
                "sub": str(user.id),
                "role": user.role,
            },
        )

        new_refresh_token = self.token_service.create_refresh_token(
            payload={
                "sub": str(user.id),
                "sid": str(user_session.id),
                "type": "refresh",
            },
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
        if refresh_token is None:
            return

        try:
            refresh_token_payload = self.token_service.decode_refresh_token(refresh_token)
            session_id = self._get_refresh_token_session_id(refresh_token_payload)
        except HTTPException:
            return

        user_session = self.session_query_repository.find_active_by_id(session_id)

        if user_session is None:
            return

        token_user_id = refresh_token_payload.get("sub")

        if not isinstance(token_user_id, str):
            return

        if token_user_id != str(user_session.user_id):
            return

        is_refresh_token_valid = self.password_service.verify_password(
            plain_password=refresh_token,
            hashed_password=user_session.refresh_token_hash,
        )

        if not is_refresh_token_valid:
            return

        self.session_command_repository.revoke_session(user_session)
