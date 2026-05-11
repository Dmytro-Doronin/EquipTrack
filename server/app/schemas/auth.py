from fastapi import UploadFile
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

class SignUpSchema(BaseModel):
    login: str = Field(
        min_length=3,
        max_length=10,
    )
    email: EmailStr
    password: str = Field(
        min_length=8,
    )
    confirm_password: str = Field(
        min_length=8,
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:
        if not any(char.isupper() for char in password):
            raise ValueError("Password must contain an uppercase letter")

        if not any(char.isdigit() for char in password):
            raise ValueError("Password must contain a number")

        return password

    @model_validator(mode="after")
    def validate_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")

        return self

class SignUpFormData(SignUpSchema):
    avatar: UploadFile | None = None

class ConfirmSignupCodeSchema(BaseModel):
    email: EmailStr
    code: str = Field(
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$",
    )

class ResendCodeSchema(BaseModel):
    email: EmailStr

class SigninSchema(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=8,
    )