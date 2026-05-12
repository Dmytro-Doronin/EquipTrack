from datetime import UTC, datetime, timedelta
from secrets import token_urlsafe

from jose import jwt
from jose.exceptions import JWTError

from app.core.config import settings
from app.errors.validation_error import raise_validation_error


class TokenService:
    def create_access_token(self, payload: dict) -> str:
        now = datetime.now(UTC)

        token_payload = {
            **payload,
            "type": "access",
            "iat": now,
            "exp": now + timedelta(minutes=settings.access_token_expires_minutes),
        }

        return jwt.encode(
            token_payload,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )

    def decode_access_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
            )
        except JWTError:
            self._raise_invalid_access_token()

        if payload.get("type") == "refresh":
            self._raise_invalid_access_token()

        return payload

    def create_refresh_token(self, payload: dict) -> str:
        now = datetime.now(UTC)

        token_payload = {
            **payload,
            "jti": token_urlsafe(32),
            "iat": now,
            "exp": now + timedelta(days=settings.refresh_token_expires_days),
        }

        return jwt.encode(
            token_payload,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )

    def decode_refresh_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
            )
        except JWTError:
            self._raise_invalid_refresh_token()

        if payload.get("type") != "refresh":
            self._raise_invalid_refresh_token()

        return payload

    def _raise_invalid_refresh_token(self) -> None:
        raise_validation_error({
            "refreshToken": ["Invalid or expired refresh token"],
        })

    def _raise_invalid_access_token(self) -> None:
        raise_validation_error({
            "accessToken": ["Invalid or expired access token"],
        })
