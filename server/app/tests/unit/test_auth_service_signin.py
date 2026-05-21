import asyncio
from datetime import datetime
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from fastapi import HTTPException

from app.schemas.auth import SigninSchema
from app.services.auth_service import AuthService


def make_auth_service():
    dependencies = {
        "user_query_repository": Mock(),
        "user_command_repository": Mock(),
        "pending_registration_query_repository": Mock(),
        "pending_registration_command_repository": Mock(),
        "storage_service": Mock(),
        "password_service": Mock(),
        "verification_code_service": Mock(),
        "email_service": Mock(),
        "session_command_repository": Mock(),
        "auth_token_service": Mock(),
        "token_service": Mock(),
        "oauth_account_query_repository": Mock(),
        "oauth_account_command_repository": Mock(),
        "google_oauth_service": Mock(),
    }

    return AuthService(**dependencies), dependencies


def make_signin_data() -> SigninSchema:
    return SigninSchema(
        email="user@example.com",
        password="Password1",
    )


def make_user(password_hash: str | None = "hashed-password"):
    return SimpleNamespace(
        id=7,
        login="testuser",
        email="user@example.com",
        password_hash=password_hash,
        avatar_url="https://cdn.example.com/avatar.png",
        role="user",
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


def test_signin_returns_tokens_and_persists_refresh_token_session():
    auth_service, dependencies = make_auth_service()
    user = make_user()
    pending_session = SimpleNamespace(id=42)
    data = make_signin_data()

    dependencies["user_query_repository"].find_by_email.return_value = user
    dependencies["password_service"].verify_password.return_value = True
    dependencies["password_service"].hash_password.return_value = "hashed-refresh-token"
    dependencies["session_command_repository"].create_pending_session.return_value = (
        pending_session
    )
    dependencies["token_service"].create_access_token.return_value = "access-token"
    dependencies["token_service"].create_refresh_token.return_value = "refresh-token"

    result = asyncio.run(
        auth_service.signin(
            data=data,
            user_agent="pytest-agent",
            ip_address="127.0.0.1",
        )
    )

    assert result == {
        "user": {
            "id": user.id,
            "login": user.login,
            "email": user.email,
            "avatarUrl": user.avatar_url,
            "role": user.role,
        },
        "accessToken": "access-token",
        "refreshToken": "refresh-token",
    }

    dependencies["user_query_repository"].find_by_email.assert_called_once_with(
        email=data.email,
    )
    dependencies["password_service"].verify_password.assert_called_once_with(
        plain_password=data.password,
        hashed_password=user.password_hash,
    )

    access_payload = dependencies["token_service"].create_access_token.call_args.kwargs[
        "payload"
    ]
    assert access_payload.sub == str(user.id)
    assert access_payload.role == user.role

    dependencies["session_command_repository"].create_pending_session.assert_called_once()
    pending_session_kwargs = dependencies[
        "session_command_repository"
    ].create_pending_session.call_args.kwargs
    assert pending_session_kwargs["user_id"] == user.id
    assert pending_session_kwargs["user_agent"] == "pytest-agent"
    assert pending_session_kwargs["ip_address"] == "127.0.0.1"
    assert isinstance(pending_session_kwargs["expires_at"], datetime)

    refresh_payload = dependencies["token_service"].create_refresh_token.call_args.kwargs[
        "payload"
    ]
    assert refresh_payload.sub == str(user.id)
    assert refresh_payload.sid == str(pending_session.id)

    dependencies["password_service"].hash_password.assert_called_once_with(
        password="refresh-token",
    )
    dependencies["session_command_repository"].rotate_refresh_token.assert_called_once()
    rotate_kwargs = dependencies[
        "session_command_repository"
    ].rotate_refresh_token.call_args.kwargs
    assert rotate_kwargs["user_session"] is pending_session
    assert rotate_kwargs["refresh_token_hash"] == "hashed-refresh-token"
    assert rotate_kwargs["user_agent"] == "pytest-agent"
    assert rotate_kwargs["ip_address"] == "127.0.0.1"
    assert isinstance(rotate_kwargs["expires_at"], datetime)


def test_signin_rejects_unknown_email():
    auth_service, dependencies = make_auth_service()
    dependencies["user_query_repository"].find_by_email.return_value = None

    with pytest.raises(HTTPException) as exc:
        asyncio.run(
            auth_service.signin(
                data=make_signin_data(),
                user_agent=None,
                ip_address=None,
            )
        )

    assert_validation_error(exc, "email", "Invalid email or password")
    dependencies["password_service"].verify_password.assert_not_called()
    dependencies["token_service"].create_access_token.assert_not_called()
    dependencies["session_command_repository"].create_pending_session.assert_not_called()


def test_signin_rejects_google_only_account():
    auth_service, dependencies = make_auth_service()
    dependencies["user_query_repository"].find_by_email.return_value = make_user(
        password_hash=None,
    )

    with pytest.raises(HTTPException) as exc:
        asyncio.run(
            auth_service.signin(
                data=make_signin_data(),
                user_agent=None,
                ip_address=None,
            )
        )

    assert_validation_error(
        exc,
        "email",
        "This account uses Google sign-in. Please continue with Google.",
    )
    dependencies["password_service"].verify_password.assert_not_called()
    dependencies["token_service"].create_access_token.assert_not_called()
    dependencies["session_command_repository"].create_pending_session.assert_not_called()


def test_signin_rejects_invalid_password():
    auth_service, dependencies = make_auth_service()
    user = make_user()
    data = make_signin_data()

    dependencies["user_query_repository"].find_by_email.return_value = user
    dependencies["password_service"].verify_password.return_value = False

    with pytest.raises(HTTPException) as exc:
        asyncio.run(
            auth_service.signin(
                data=data,
                user_agent=None,
                ip_address=None,
            )
        )

    assert_validation_error(exc, "password", "Invalid email or password")
    dependencies["password_service"].verify_password.assert_called_once_with(
        plain_password=data.password,
        hashed_password=user.password_hash,
    )
    dependencies["token_service"].create_access_token.assert_not_called()
    dependencies["session_command_repository"].create_pending_session.assert_not_called()
