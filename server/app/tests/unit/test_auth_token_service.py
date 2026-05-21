from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from fastapi import HTTPException

from app.schemas.token import RefreshTokenPayload
from app.services.auth_token_service import AuthTokenService


def make_auth_token_service():
    session_query_repository = Mock()
    password_service = Mock()
    token_service = Mock()

    return AuthTokenService(
        session_query_repository=session_query_repository,
        password_service=password_service,
        token_service=token_service,
    )


def make_refresh_token_payload(
    sub: str = "7",
    sid: str = "42",
) -> RefreshTokenPayload:
    return RefreshTokenPayload(
        sub=sub,
        sid=sid,
        type="refresh",
        jti="refresh-token-id",
        iat=1,
        exp=2,
    )


def assert_validation_error(
    exc: pytest.ExceptionInfo[HTTPException],
    field: str,
    message: str,
) -> None:
    assert exc.value.status_code == 422
    assert exc.value.detail == {
        "message": "Validation failed",
        "errors": {
            field: [message],
        },
    }


def test_validate_refresh_session_returns_validated_session():
    auth_token_service = make_auth_token_service()
    refresh_token = "refresh-token"
    payload = make_refresh_token_payload()
    user_session = SimpleNamespace(
        id=42,
        user_id=7,
        refresh_token_hash="hashed-refresh-token",
    )

    auth_token_service.token_service.decode_refresh_token.return_value = payload
    auth_token_service.session_query_repository.find_active_by_id.return_value = (
        user_session
    )
    auth_token_service.password_service.verify_password.return_value = True

    result = auth_token_service.validate_refresh_session(refresh_token)

    assert result.token == refresh_token
    assert result.payload is payload
    assert result.session is user_session
    auth_token_service.token_service.decode_refresh_token.assert_called_once_with(
        refresh_token,
    )
    auth_token_service.session_query_repository.find_active_by_id.assert_called_once_with(
        42,
    )
    auth_token_service.password_service.verify_password.assert_called_once_with(
        plain_password=refresh_token,
        hashed_password=user_session.refresh_token_hash,
    )


def test_validate_refresh_session_requires_refresh_token():
    auth_token_service = make_auth_token_service()

    with pytest.raises(HTTPException) as exc:
        auth_token_service.validate_refresh_session(None)

    assert_validation_error(exc, "refreshToken", "Refresh token is required")
    auth_token_service.token_service.decode_refresh_token.assert_not_called()
    auth_token_service.session_query_repository.find_active_by_id.assert_not_called()
    auth_token_service.password_service.verify_password.assert_not_called()


def test_validate_refresh_session_rejects_invalid_session_id():
    auth_token_service = make_auth_token_service()
    auth_token_service.token_service.decode_refresh_token.return_value = (
        make_refresh_token_payload(sid="not-a-number")
    )

    with pytest.raises(HTTPException) as exc:
        auth_token_service.validate_refresh_session("refresh-token")

    assert_validation_error(
        exc,
        "refreshToken",
        "Invalid or expired refresh token",
    )
    auth_token_service.session_query_repository.find_active_by_id.assert_not_called()
    auth_token_service.password_service.verify_password.assert_not_called()


def test_validate_refresh_session_rejects_missing_active_session():
    auth_token_service = make_auth_token_service()
    auth_token_service.token_service.decode_refresh_token.return_value = (
        make_refresh_token_payload()
    )
    auth_token_service.session_query_repository.find_active_by_id.return_value = None

    with pytest.raises(HTTPException) as exc:
        auth_token_service.validate_refresh_session("refresh-token")

    assert_validation_error(
        exc,
        "refreshToken",
        "Invalid or expired refresh token",
    )
    auth_token_service.session_query_repository.find_active_by_id.assert_called_once_with(
        42,
    )
    auth_token_service.password_service.verify_password.assert_not_called()


def test_validate_refresh_session_rejects_subject_mismatch():
    auth_token_service = make_auth_token_service()
    auth_token_service.token_service.decode_refresh_token.return_value = (
        make_refresh_token_payload(sub="7")
    )
    auth_token_service.session_query_repository.find_active_by_id.return_value = (
        SimpleNamespace(
            id=42,
            user_id=99,
            refresh_token_hash="hashed-refresh-token",
        )
    )

    with pytest.raises(HTTPException) as exc:
        auth_token_service.validate_refresh_session("refresh-token")

    assert_validation_error(
        exc,
        "refreshToken",
        "Invalid or expired refresh token",
    )
    auth_token_service.password_service.verify_password.assert_not_called()


def test_validate_refresh_session_rejects_invalid_refresh_token_hash():
    auth_token_service = make_auth_token_service()
    auth_token_service.token_service.decode_refresh_token.return_value = (
        make_refresh_token_payload()
    )
    auth_token_service.session_query_repository.find_active_by_id.return_value = (
        SimpleNamespace(
            id=42,
            user_id=7,
            refresh_token_hash="hashed-refresh-token",
        )
    )
    auth_token_service.password_service.verify_password.return_value = False

    with pytest.raises(HTTPException) as exc:
        auth_token_service.validate_refresh_session("refresh-token")

    assert_validation_error(
        exc,
        "refreshToken",
        "Invalid or expired refresh token",
    )
    auth_token_service.password_service.verify_password.assert_called_once_with(
        plain_password="refresh-token",
        hashed_password="hashed-refresh-token",
    )


def test_try_validate_refresh_session_returns_none_for_invalid_token():
    auth_token_service = make_auth_token_service()

    assert auth_token_service.try_validate_refresh_session(None) is None
