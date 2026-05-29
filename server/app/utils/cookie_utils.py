from fastapi import APIRouter, Cookie, Depends, Request, Response, HTTPException, status
from app.core.config import settings


def set_refresh_token_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * settings.refresh_token_expires_days,
        path="/",
    )


def clear_refresh_token_cookie(response: Response) -> None:
    response.delete_cookie(
        key="refresh_token",
        path="/",
        httponly=True,
        secure=True,
        samesite="lax",
    )