from fastapi import Form
from pydantic import ValidationError

from app.errors.format_validation_errors import format_pydantic_errors
from app.errors.validation_error import raise_validation_error
from app.schemas.auth import EmailSchema


async def validate_email_address(
    email: str = Form(...),
) -> EmailSchema:
    try:
        return EmailSchema(
            email=email,
        )
    except ValidationError as error:
        raise_validation_error(
            format_pydantic_errors(error),
        )