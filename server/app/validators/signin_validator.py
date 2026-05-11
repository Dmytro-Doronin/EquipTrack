from app.schemas.auth import SigninSchema
from fastapi import File, Form, UploadFile
from pydantic import ValidationError

from app.errors.format_validation_errors import format_pydantic_errors
from app.errors.validation_error import raise_validation_error

async def validate_signin(
        email: str = Form(...),
        password: str = Form(...),
) -> SigninSchema:
    try:
        return SigninSchema(
            email=email,
            password=password
        )
    except ValidationError as error:
        raise_validation_error(
            format_pydantic_errors(error),
        )