from datetime import UTC, datetime, timedelta
from secrets import token_urlsafe
from typing import NoReturn

from jose import jwt
from jose.exceptions import JWTError
from pydantic import ValidationError

from app.core.config import settings
from app.errors.validation_error import raise_validation_error
from app.schemas.token import (
    AccessTokenCreatePayload,
    AccessTokenPayload,
    RefreshTokenCreatePayload,
    RefreshTokenPayload,
)
from errors.app_error import raise_app_error


class TokenService:
    def create_access_token(self, payload: AccessTokenCreatePayload) -> str:
        now = datetime.now(UTC)

        token_payload: dict[str, object] = {
            **payload.model_dump(),
            "type": "access",
            "iat": now,
            "exp": now + timedelta(minutes=settings.access_token_expires_minutes),
        }

        return jwt.encode(
            token_payload,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )

    def decode_access_token(self, token: str) -> AccessTokenPayload:
        try:
            raw_payload: object = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
            )
        except JWTError:
            self._raise_invalid_access_token()

        if not isinstance(raw_payload, dict):
            self._raise_invalid_access_token()

        if raw_payload.get("type") == "refresh":
            self._raise_invalid_access_token()

        try:
            return AccessTokenPayload.model_validate(raw_payload)
        except ValidationError:
            self._raise_invalid_access_token()

    def create_refresh_token(self, payload: RefreshTokenCreatePayload) -> str:
        now = datetime.now(UTC)

        token_payload: dict[str, object] = {
            **payload.model_dump(),
            "jti": token_urlsafe(32),
            "iat": now,
            "exp": now + timedelta(days=settings.refresh_token_expires_days),
        }

        return jwt.encode(
            token_payload,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )

    def decode_refresh_token(self, token: str) -> RefreshTokenPayload:
        try:
            raw_payload: object = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
            )
        except JWTError:
            self._raise_invalid_refresh_token()

        if not isinstance(raw_payload, dict):
            self._raise_invalid_refresh_token()

        if raw_payload.get("type") != "refresh":
            self._raise_invalid_refresh_token()

        try:
            return RefreshTokenPayload.model_validate(raw_payload)
        except ValidationError:
            self._raise_invalid_refresh_token()

    def _raise_invalid_refresh_token(self) -> NoReturn:
        raise_app_error(
            message="Invalid or expired refresh token",
            status_code=401,
        )

    def _raise_invalid_access_token(self) -> NoReturn:
        raise_app_error(
            message="Invalid or expired access token",
            status_code=401,
        )
