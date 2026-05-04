from fastapi import APIRouter, Depends

from app.schemas.auth import SignUpFormData
from app.validators.sign_up_validator import validate_sign_up_form

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
async def signup(
    form_data: SignUpFormData = Depends(validate_sign_up_form),
):
    return {
        "success": True,
        "data": {
            "login": form_data.login,
            "email": str(form_data.email),
            "hasAvatar": form_data.avatar is not None,
        },
    }