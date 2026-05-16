from fastapi import Body
from pydantic import ValidationError

from app.errors.format_validation_errors import format_pydantic_errors
from app.errors.validation_error import raise_validation_error
from app.schemas.auth import (
    PasswordRecoveryConfirmSchema,
    PasswordRecoveryStartSchema,
)


async def validate_password_recovery_start_form(
    email: str = Body(...),
) -> PasswordRecoveryStartSchema:
    try:
        return PasswordRecoveryStartSchema(email=email)
    except ValidationError as error:
        raise_validation_error(format_pydantic_errors(error))


async def validate_password_recovery_confirm_form(
    token: str = Body(...),
    password: str = Body(...),
    confirmPassword: str = Body(...),
) -> PasswordRecoveryConfirmSchema:
    try:
        return PasswordRecoveryConfirmSchema(
            token=token,
            password=password,
            confirm_password=confirmPassword,
        )
    except ValidationError as error:
        raise_validation_error(format_pydantic_errors(error))
