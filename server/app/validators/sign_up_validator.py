from fastapi import File, Form, UploadFile
from pydantic import ValidationError

from app.errors.format_validation_errors import format_pydantic_errors
from app.errors.validation_error import raise_validation_error
from app.schemas.auth import SignUpFormData, SignUpSchema
from app.validators.avatar_validator import validate_avatar


async def validate_sign_up_form(
    login: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    confirmPassword: str = Form(...),
    avatar: UploadFile | None = File(default=None),
) -> SignUpFormData:
    errors: dict[str, list[str]] = {}

    sign_up_data: SignUpSchema | None = None

    try:
        sign_up_data = SignUpSchema(
            login=login,
            email=email,
            password=password,
            confirm_password=confirmPassword,
        )
    except ValidationError as error:
        errors.update(format_pydantic_errors(error))

    avatar_error = await validate_avatar(avatar)

    if avatar_error:
        errors["avatar"] = [avatar_error]

    if errors:
        raise_validation_error(errors)

    if sign_up_data is None:
        raise_validation_error({
            "form": ["Invalid signup data"],
        })

    return SignUpFormData(
        login=sign_up_data.login,
        email=sign_up_data.email,
        password=sign_up_data.password,
        confirm_password=sign_up_data.confirm_password,
        avatar=avatar,
    )