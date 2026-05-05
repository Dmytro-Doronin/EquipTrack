from fastapi import Form
from pydantic import ValidationError

from app.errors.format_validation_errors import format_pydantic_errors
from app.errors.validation_error import raise_validation_error
from app.schemas.auth import ConfirmSignupCodeSchema


async def validate_confirm_signup_code_form(
    email: str = Form(...),
    code: str = Form(...),
) -> ConfirmSignupCodeSchema:
    try:
        return ConfirmSignupCodeSchema(
            email=email,
            code=code,
        )
    except ValidationError as error:
        raise_validation_error(
            format_pydantic_errors(error),
        )