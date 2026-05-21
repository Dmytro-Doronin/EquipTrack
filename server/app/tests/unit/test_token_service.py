import pytest
from fastapi import HTTPException

from app.schemas.token import AccessTokenCreatePayload, RefreshTokenCreatePayload
from app.services.token_service import TokenService


def test_create_and_decode_access_token():
    token_service = TokenService()

    token = token_service.create_access_token(
        payload=AccessTokenCreatePayload(
            sub="1",
            role="user",
        ),
    )

    payload = token_service.decode_access_token(token)

    assert payload.sub == "1"
    assert payload.role == "user"
    assert payload.iat is not None
    assert payload.exp is not None


def test_create_and_decode_refresh_token():
    token_service = TokenService()

    token = token_service.create_refresh_token(
        payload=RefreshTokenCreatePayload(
            sub="1",
            sid="10",
        ),
    )

    payload = token_service.decode_refresh_token(token)

    assert payload.sub == "1"
    assert payload.sid == "10"
    assert payload.type == "refresh"
    assert payload.jti
    assert payload.iat is not None
    assert payload.exp is not None


def test_decode_access_token_rejects_refresh_token():
    token_service = TokenService()

    refresh_token = token_service.create_refresh_token(
        payload=RefreshTokenCreatePayload(
            sub="1",
            sid="10",
        ),
    )

    with pytest.raises(HTTPException) as exc:
        token_service.decode_access_token(refresh_token)

    assert exc.value.status_code == 401
    assert exc.value.detail["message"] == "Invalid or expired access token"


def test_decode_refresh_token_rejects_access_token():
    token_service = TokenService()

    access_token = token_service.create_access_token(
        payload=AccessTokenCreatePayload(
            sub="1",
            role="user",
        ),
    )

    with pytest.raises(HTTPException) as exc:
        token_service.decode_refresh_token(access_token)

    assert exc.value.status_code == 401
    assert exc.value.detail["message"] == "Invalid or expired refresh token"