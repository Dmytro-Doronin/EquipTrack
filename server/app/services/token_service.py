from datetime import UTC, datetime, timedelta
from secrets import token_urlsafe

from jose import jwt

from app.core.config import settings


class TokenService:
    def create_access_token(self, payload: dict) -> str:
        now = datetime.now(UTC)

        token_payload = {
            **payload,
            "iat": now,
            "exp": now + timedelta(minutes=settings.access_token_expires_minutes),
        }

        return jwt.encode(
            token_payload,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )

    def create_refresh_token(self) -> str:
        return token_urlsafe(64)