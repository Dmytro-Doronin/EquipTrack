from typing import Literal

from pydantic import BaseModel, EmailStr, Field


OAuthProvider = Literal["google"]


class GoogleAuthSchema(BaseModel):
    id_token: str = Field(min_length=1)


class GoogleUserInfo(BaseModel):
    provider_user_id: str = Field(min_length=1)
    email: EmailStr
    email_verified: bool
    login: str = Field(min_length=1, max_length=30)
    avatar_url: str | None = Field(default=None, max_length=500)
