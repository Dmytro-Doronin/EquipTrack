import secrets
from datetime import UTC, datetime, timedelta

from app.core.config import settings
from app.errors.validation_error import raise_validation_error
from app.repositories.command_repositories.password_reset_token_command_repository import (
    PasswordResetTokenCommandRepository,
)
from app.repositories.command_repositories.session_command_repository import (
    SessionCommandRepository,
)
from app.repositories.command_repositories.user_commond_repository import (
    UserCommandRepository,
)
from app.repositories.query_repositories.password_reset_token_query_repository import (
    PasswordResetTokenQueryRepository,
)
from app.repositories.query_repositories.user_query_repository import UserQueryRepository
from app.services.email_service import EmailService
from app.services.password_service import PasswordService


class PasswordRecoveryService:
    def __init__(
        self,
        user_query_repository: UserQueryRepository,
        user_command_repository: UserCommandRepository,
        password_reset_token_query_repository: PasswordResetTokenQueryRepository,
        password_reset_token_command_repository: PasswordResetTokenCommandRepository,
        session_command_repository: SessionCommandRepository,
        password_service: PasswordService,
        email_service: EmailService,
    ):
        self.user_query_repository = user_query_repository
        self.user_command_repository = user_command_repository
        self.password_reset_token_query_repository = password_reset_token_query_repository
        self.password_reset_token_command_repository = (
            password_reset_token_command_repository
        )
        self.session_command_repository = session_command_repository
        self.password_service = password_service
        self.email_service = email_service

    async def start_password_recovery(self, email: str) -> None:
        user = self.user_query_repository.find_by_email(email=email)

        if user is None:
            return

        raw_token = secrets.token_urlsafe(32)
        token_hash = self.password_service.hash_reset_token(raw_token)
        expires_at = datetime.now(UTC) + timedelta(
            minutes=settings.password_reset_token_expires_minutes,
        )

        self.password_reset_token_command_repository.revoke_active_tokens_for_user(
            user_id=user.id,
        )
        self.password_reset_token_command_repository.create(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        reset_link = f"{settings.client_url}/reset-password?token={raw_token}"

        await self.email_service.send_password_recovery_email(
            email=user.email,
            reset_link=reset_link,
        )

    def confirm_password_recovery(self, token: str, password: str) -> None:
        token_hash = self.password_service.hash_reset_token(token)
        reset_token = (
            self.password_reset_token_query_repository.find_valid_by_token_hash(
                token_hash=token_hash,
            )
        )

        if reset_token is None:
            raise_validation_error({
                "token": ["Invalid or expired password recovery link"],
            })

        user = self.user_query_repository.find_by_id(reset_token.user_id)

        if user is None:
            self.password_reset_token_command_repository.mark_as_used(reset_token)
            raise_validation_error({
                "token": ["Invalid or expired password recovery link"],
            })

        password_hash = self.password_service.hash_password(password)

        self.user_command_repository.update_password_hash(
            user=user,
            password_hash=password_hash,
        )
        self.password_reset_token_command_repository.mark_as_used(reset_token)
        self.session_command_repository.revoke_active_sessions_for_user(
            user_id=user.id,
        )
