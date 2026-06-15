from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

AssetStatus = Literal["available", "assigned", "maintenance", "lost"]


class AssetAssignedUserSchema(BaseModel):
    id: int
    login: str


class AssetCreateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    category: str
    serialNumber: str
    status: AssetStatus = "available"
    assignedToUserId: int | None = Field(default=None, ge=1)
    assignedAt: datetime | None = None
    dueDate: datetime | None = None
    imageUrl: str | None = None


class AssetUpdateSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    category: str | None = None
    serialNumber: str | None = None
    status: AssetStatus | None = None
    assignedToUserId: int | None = Field(default=None, ge=1)
    assignedAt: datetime | None = None
    dueDate: datetime | None = None
    imageUrl: str | None = None


class AssetSchema(BaseModel):
    id: int
    organizationId: int
    name: str
    category: str
    serialNumber: str
    status: AssetStatus
    assignedTo: AssetAssignedUserSchema | None = None
    assignedToUserId: int | None = None
    assignedAt: str | None = None
    dueDate: str | None = None
    imageUrl: str | None = None
    createdAt: str


class AssetResponseSchema(BaseModel):
    success: bool
    message: str
    data: AssetSchema


class AssetListResponseSchema(BaseModel):
    success: bool
    data: list[AssetSchema]
