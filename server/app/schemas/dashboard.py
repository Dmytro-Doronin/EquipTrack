from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class DashboardUserSchema(BaseModel):
    id: int
    login: str
    email: EmailStr
    avatarUrl: str | None = None
    role: str | None = None


class DashboardOrganizationSchema(BaseModel):
    id: int
    name: str


class DashboardMembershipSchema(BaseModel):
    role: Literal["owner", "admin", "member"]
    status: Literal["active", "pending"]


class DashboardPendingRequestSchema(BaseModel):
    id: int
    organizationId: int
    organizationName: str
    status: Literal["pending"]
    createdAt: str


class DashboardStatsSchema(BaseModel):
    assignedAssets: int = 0
    pendingTransfers: int = 0
    overdueReturns: int = 0


class DashboardAssetItemSchema(BaseModel):
    id: int
    name: str
    category: str
    serialNumber: str
    status: str
    assignedAt: str
    dueDate: str | None = None


class DashboardTransferUserSchema(BaseModel):
    id: int
    login: str


class DashboardTransferItemSchema(BaseModel):
    id: int
    assetId: int
    assetName: str
    fromUser: DashboardTransferUserSchema | None = None
    toUser: DashboardTransferUserSchema | None = None
    status: str
    createdAt: str


class DashboardActivityItemSchema(BaseModel):
    id: int
    type: str
    message: str
    createdAt: str


class DashboardContextSchema(BaseModel):
    user: DashboardUserSchema
    activeOrganization: DashboardOrganizationSchema | None = None
    membership: DashboardMembershipSchema | None = None
    pendingRequests: list[DashboardPendingRequestSchema] = Field(default_factory=list)
    stats: DashboardStatsSchema = Field(default_factory=DashboardStatsSchema)
    myAssets: list[DashboardAssetItemSchema] = Field(default_factory=list)
    myTransfers: list[DashboardTransferItemSchema] = Field(default_factory=list)
    recentActivity: list[DashboardActivityItemSchema] = Field(default_factory=list)


class DashboardResponseSchema(BaseModel):
    success: bool
    data: DashboardContextSchema
