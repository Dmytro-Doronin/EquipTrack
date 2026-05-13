from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class AccessTokenCreatePayload(BaseModel):
    sub: str
    role: str


class RefreshTokenCreatePayload(BaseModel):
    sub: str
    sid: str
    type: Literal["refresh"] = "refresh"


class AccessTokenPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")

    sub: str
    role: str
    iat: int
    exp: int


class RefreshTokenPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")

    sub: str
    sid: str
    type: Literal["refresh"]
    jti: str = Field(min_length=1)
    iat: int
    exp: int
