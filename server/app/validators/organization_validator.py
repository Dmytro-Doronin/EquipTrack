from typing import Any

from fastapi import Body

from app.errors.validation_error import raise_validation_error
from app.schemas.organization import CreateOrganizationSchema


async def validate_create_organization_body(
    payload: str = Body(default=None),
) -> CreateOrganizationSchema:
    if not isinstance(payload, dict):
        raise_validation_error({
            "name": ["Organization name is required"],
        })

    name = payload.get("name")

    if not isinstance(name, str):
        raise_validation_error({
            "name": ["Organization name is required"],
        })

    name = name.strip()

    if not name:
        raise_validation_error({
            "name": ["Organization name is required"],
        })

    if len(name) > 100:
        raise_validation_error({
            "name": ["Organization name must be 100 characters or less"],
        })

    return CreateOrganizationSchema(name=name)
