from app.schemas.auth import SignUpFormData


class AuthService:
    def create_user(self, form_data: SignUpFormData) -> dict:
        user = {
            "id": "mock-user-id-1",
            "login": form_data.login,
            "email": str(form_data.email),
            "avatar": {
                "filename": form_data.avatar.filename,
                "contentType": form_data.avatar.content_type,
            } if form_data.avatar is not None else None,
        }

        return user