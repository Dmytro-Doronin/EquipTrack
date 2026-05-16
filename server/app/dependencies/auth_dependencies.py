from fastapi import Depends
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.repositories.command_repositories.password_reset_token_command_repository import (
    PasswordResetTokenCommandRepository,
)
from app.repositories.command_repositories.pending_registration_command_repository import (
    PendingRegistrationCommandRepository,
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
from app.repositories.query_repositories.pending_registration_query_repository import (
    PendingRegistrationQueryRepository,
)
from app.repositories.query_repositories.session_query_repository import (
    SessionQueryRepository,
)
from app.repositories.query_repositories.user_query_repository import UserQueryRepository
from app.services.auth_service import AuthService
from app.services.auth_token_service import AuthTokenService
from app.services.email_service import EmailService
from app.services.password_recovery_service import PasswordRecoveryService
from app.services.password_service import PasswordService
from app.services.s3_storage_service import S3StorageService
from app.services.token_service import TokenService
from app.services.verification_code_service import VerificationCodeService


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    password_service = PasswordService()
    token_service = TokenService()

    return AuthService(
        user_query_repository=UserQueryRepository(db),
        user_command_repository=UserCommandRepository(db),
        pending_registration_query_repository=PendingRegistrationQueryRepository(db),
        pending_registration_command_repository=PendingRegistrationCommandRepository(db),
        storage_service=S3StorageService(),
        password_service=password_service,
        verification_code_service=VerificationCodeService(),
        email_service=EmailService(),
        session_command_repository=SessionCommandRepository(db),
        auth_token_service=AuthTokenService(
            session_query_repository=SessionQueryRepository(db),
            password_service=password_service,
            token_service=token_service,
        ),
        token_service=token_service,
    )


def get_password_recovery_service(
    db: Session = Depends(get_db),
) -> PasswordRecoveryService:
    return PasswordRecoveryService(
        user_query_repository=UserQueryRepository(db),
        user_command_repository=UserCommandRepository(db),
        password_reset_token_query_repository=PasswordResetTokenQueryRepository(db),
        password_reset_token_command_repository=PasswordResetTokenCommandRepository(db),
        session_command_repository=SessionCommandRepository(db),
        password_service=PasswordService(),
        email_service=EmailService(),
    )
