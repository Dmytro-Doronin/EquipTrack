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


class DashboardContextSchema(BaseModel):
    user: DashboardUserSchema
    activeOrganization: DashboardOrganizationSchema | None = None
    membership: DashboardMembershipSchema | None = None
    pendingRequests: list[DashboardPendingRequestSchema] = Field(default_factory=list)
    stats: None = None
    recentActivity: list[dict] = Field(default_factory=list)


class DashboardResponseSchema(BaseModel):
    success: bool
    data: DashboardContextSchema
