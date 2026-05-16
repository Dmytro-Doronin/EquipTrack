from dataclasses import dataclass
from typing import NoReturn

from fastapi import HTTPException
from app.errors.validation_error import raise_validation_error
from app.models.user_session import UserSession
from app.repositories.query_repositories.session_query_repository import (
    SessionQueryRepository,
)
from app.schemas.token import RefreshTokenPayload
from app.services.password_service import PasswordService
from app.services.token_service import TokenService


@dataclass(frozen=True)
class ValidatedRefreshSession:
    token: str
    payload: RefreshTokenPayload
    session: UserSession


class AuthTokenService:
    def __init__(
        self,
        session_query_repository: SessionQueryRepository,
        password_service: PasswordService,
        token_service: TokenService,
    ):
        self.session_query_repository = session_query_repository
        self.password_service = password_service
        self.token_service = token_service

    def validate_refresh_session(
        self,
        refresh_token: str | None,
    ) -> ValidatedRefreshSession:
        if refresh_token is None:
            raise_validation_error({
                "refreshToken": ["Refresh token is required"],
            })

        refresh_token_payload = self.token_service.decode_refresh_token(refresh_token)
        session_id = self._get_refresh_token_session_id(refresh_token_payload)
        user_session = self.session_query_repository.find_active_by_id(session_id)

        if user_session is None:
            self._raise_invalid_refresh_token()

        if refresh_token_payload.sub != str(user_session.user_id):
            self._raise_invalid_refresh_token()

        is_refresh_token_valid = self.password_service.verify_password(
            plain_password=refresh_token,
            hashed_password=user_session.refresh_token_hash,
        )

        if not is_refresh_token_valid:
            self._raise_invalid_refresh_token()

        return ValidatedRefreshSession(
            token=refresh_token,
            payload=refresh_token_payload,
            session=user_session,
        )

    def try_validate_refresh_session(
        self,
        refresh_token: str | None,
    ) -> ValidatedRefreshSession | None:
        try:
            return self.validate_refresh_session(refresh_token)
        except HTTPException:
            return None

    def _get_refresh_token_session_id(
        self,
        refresh_token_payload: RefreshTokenPayload,
    ) -> int:
        try:
            return int(refresh_token_payload.sid)
        except ValueError:
            self._raise_invalid_refresh_token()

    def _raise_invalid_refresh_token(self) -> NoReturn:
        raise_validation_error({
            "refreshToken": ["Invalid or expired refresh token"],
        })
