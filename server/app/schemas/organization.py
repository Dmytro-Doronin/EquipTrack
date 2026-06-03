from typing import Literal

from pydantic import BaseModel


class CreateOrganizationSchema(BaseModel):
    name: str


class OrganizationSchema(BaseModel):
    id: int
    name: str


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
