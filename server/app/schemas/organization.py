from typing import Literal

from pydantic import BaseModel


class CreateOrganizationSchema(BaseModel):
    name: str


class OrganizationSchema(BaseModel):
    id: int
    name: str


class OrganizationSearchResponseSchema(BaseModel):
    success: bool
    data: list[OrganizationSchema]


class OrganizationMembershipSchema(BaseModel):
    role: Literal["owner", "admin", "member"]
    status: Literal["active", "pending"]


class CreateOrganizationResultSchema(BaseModel):
    organization: OrganizationSchema
    membership: OrganizationMembershipSchema


class CreateOrganizationResponseSchema(BaseModel):
    success: bool
    message: str
    data: CreateOrganizationResultSchema


class JoinRequestResultSchema(BaseModel):
    id: int
    organizationId: int
    organizationName: str
    status: Literal["pending"]
    createdAt: str


class JoinRequestResponseSchema(BaseModel):
    success: bool
    message: str
    data: JoinRequestResultSchema


class JoinRequestUserSchema(BaseModel):
    id: int
    login: str
    email: str
    avatarUrl: str | None = None


class PendingJoinRequestSchema(BaseModel):
    id: int
    organizationId: int
    user: JoinRequestUserSchema
    status: Literal["pending"]
    createdAt: str


class PendingJoinRequestsResponseSchema(BaseModel):
    success: bool
    data: list[PendingJoinRequestSchema]


class ApproveJoinRequestResultSchema(BaseModel):
    id: int
    organizationId: int
    userId: int
    role: Literal["member"]
    status: Literal["active"]


class ApproveJoinRequestResponseSchema(BaseModel):
    success: bool
    message: str
    data: ApproveJoinRequestResultSchema


class RejectJoinRequestResultSchema(BaseModel):
    id: int
    organizationId: int
    status: Literal["rejected"]


class RejectJoinRequestResponseSchema(BaseModel):
    success: bool
    message: str
    data: RejectJoinRequestResultSchema
