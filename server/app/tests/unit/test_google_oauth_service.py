from unittest.mock import Mock

import pytest
from fastapi import HTTPException
from google.auth.exceptions import GoogleAuthError

from app.services import google_oauth_service as google_oauth_module
from app.services.google_oauth_service import GoogleOAuthService


GOOGLE_CLIENT_ID = "google-client-id.apps.googleusercontent.com"


def make_google_payload(**overrides):
    payload = {
        "aud": GOOGLE_CLIENT_ID,
        "sub": "google-user-id",
        "email": "user@example.com",
        "email_verified": True,
        "name": "Google User",
        "picture": "https://lh3.googleusercontent.com/avatar.png",
    }
    payload.update(overrides)

    return payload


def mock_google_verifier(monkeypatch, return_value):
    request = Mock()
    request_factory = Mock(return_value=request)
    verifier = Mock(return_value=return_value)

    monkeypatch.setattr(
        google_oauth_module.settings,
        "google_client_id",
        GOOGLE_CLIENT_ID,
    )
    monkeypatch.setattr(
        google_oauth_module.google_requests,
        "Request",
        request_factory,
    )
    monkeypatch.setattr(
        google_oauth_module.id_token,
        "verify_oauth2_token",
        verifier,
    )

    return verifier, request


def assert_app_error(
    exc: pytest.ExceptionInfo[HTTPException],
    status_code: int,
    message: str,
) -> None:
    assert exc.value.status_code == status_code
    assert exc.value.detail == {
        "message": message,
    }


def test_verify_id_token_returns_google_user_info(monkeypatch):
    payload = make_google_payload()
    verifier, request = mock_google_verifier(monkeypatch, payload)
    service = GoogleOAuthService()

    result = service.verify_id_token("id-token")

    assert result.provider_user_id == "google-user-id"
    assert str(result.email) == "user@example.com"
    assert result.email_verified is True
    assert result.login == "Google User"
    assert result.avatar_url == "https://lh3.googleusercontent.com/avatar.png"
    verifier.assert_called_once_with(
        "id-token",
        request,
        GOOGLE_CLIENT_ID,
    )


def test_verify_id_token_uses_email_prefix_when_name_is_missing(monkeypatch):
    payload = make_google_payload(
        email="fallback@example.com",
        name="   ",
        picture="   ",
    )
    mock_google_verifier(monkeypatch, payload)
    service = GoogleOAuthService()

    result = service.verify_id_token("id-token")

    assert result.login == "fallback"
    assert result.avatar_url is None


def test_verify_id_token_truncates_long_login(monkeypatch):
    payload = make_google_payload(
        name="A very long Google profile display name",
    )
    mock_google_verifier(monkeypatch, payload)
    service = GoogleOAuthService()

    result = service.verify_id_token("id-token")

    assert result.login == "A very long Google profile dis"
    assert len(result.login) == 30


def test_verify_id_token_rejects_missing_google_client_id(monkeypatch):
    verifier = Mock()
    monkeypatch.setattr(google_oauth_module.settings, "google_client_id", "   ")
    monkeypatch.setattr(
        google_oauth_module.id_token,
        "verify_oauth2_token",
        verifier,
    )
    service = GoogleOAuthService()

    with pytest.raises(HTTPException) as exc:
        service.verify_id_token("id-token")

    assert_app_error(exc, 401, "Invalid Google token")
    verifier.assert_not_called()


@pytest.mark.parametrize(
    "error",
    [
        ValueError("invalid token"),
        GoogleAuthError("google auth error"),
    ],
)
def test_verify_id_token_rejects_google_verifier_errors(monkeypatch, error):
    verifier, _ = mock_google_verifier(monkeypatch, make_google_payload())
    verifier.side_effect = error
    service = GoogleOAuthService()

    with pytest.raises(HTTPException) as exc:
        service.verify_id_token("id-token")

    assert_app_error(exc, 401, "Invalid Google token")


@pytest.mark.parametrize(
    "payload",
    [
        None,
        ["not", "a", "dict"],
        make_google_payload(aud="another-client-id"),
        make_google_payload(sub="   "),
        make_google_payload(email="   "),
        make_google_payload(email="not-an-email"),
        make_google_payload(email_verified=None),
    ],
)
def test_verify_id_token_rejects_invalid_payload(monkeypatch, payload):
    mock_google_verifier(monkeypatch, payload)
    service = GoogleOAuthService()

    with pytest.raises(HTTPException) as exc:
        service.verify_id_token("id-token")

    assert_app_error(exc, 401, "Invalid Google token")


def test_verify_id_token_rejects_unverified_email(monkeypatch):
    payload = make_google_payload(email_verified=False)
    mock_google_verifier(monkeypatch, payload)
    service = GoogleOAuthService()

    with pytest.raises(HTTPException) as exc:
        service.verify_id_token("id-token")

    assert_app_error(exc, 400, "Google email is not verified")
