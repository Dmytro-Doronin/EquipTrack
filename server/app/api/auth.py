from fastapi import APIRouter, Depends

from app.schemas.auth import SignUpFormData
from app.validators.sign_up_validator import validate_sign_up_form
from app.db.database import get_db
from sqlalchemy.orm import Session

from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
async def signup(
    form_data: SignUpFormData = Depends(validate_sign_up_form),
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)

    data = auth_service.start_signup(form_data)

    return {
        "success": True,
        "data": data,
    }