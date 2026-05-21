from typing import NoReturn

from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from pydantic import ValidationError

from app.core.config import settings
from app.errors.app_error import raise_app_error
from app.schemas.oauth import GoogleUserInfo


class GoogleOAuthService:
    def verify_id_token(self, token: str) -> GoogleUserInfo:
        if not settings.google_client_id.strip():
            self._raise_invalid_google_token()

        try:
            raw_id_info: object = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.google_client_id,
            )
        except (ValueError, GoogleAuthError):
            self._raise_invalid_google_token()

        if not isinstance(raw_id_info, dict):
            self._raise_invalid_google_token()

        if raw_id_info.get("aud") != settings.google_client_id:
            self._raise_invalid_google_token()

        provider_user_id = raw_id_info.get("sub")
        email = raw_id_info.get("email")
        email_verified = raw_id_info.get("email_verified")

        if not isinstance(provider_user_id, str) or not provider_user_id.strip():
            self._raise_invalid_google_token()

        if not isinstance(email, str) or not email.strip():
            self._raise_invalid_google_token()

        if email_verified is False:
            self._raise_email_not_verified()

        if email_verified is not True:
            self._raise_invalid_google_token()

        name = raw_id_info.get("name")
        picture = raw_id_info.get("picture")
        login_source = name if isinstance(name, str) and name.strip() else email
        avatar_url = picture if isinstance(picture, str) and picture.strip() else None

        try:
            return GoogleUserInfo(
                provider_user_id=provider_user_id,
                email=email,
                email_verified=True,
                login=self._normalize_login(login_source),
                avatar_url=avatar_url,
            )
        except ValidationError:
            self._raise_invalid_google_token()

    def _normalize_login(self, value: str) -> str:
        login = value.strip()

        if "@" in login:
            login = login.split("@", maxsplit=1)[0].strip()

        login = login[:30].strip()

        return login or "Google user"

    def _raise_invalid_google_token(self) -> NoReturn:
        raise_app_error(
            message="Invalid Google token",
            status_code=401,
        )

    def _raise_email_not_verified(self) -> NoReturn:
        raise_app_error(
            message="Google email is not verified",
            status_code=400,
        )
