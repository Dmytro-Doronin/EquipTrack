
from sqlalchemy.orm import Session

from app.models.user import User

class UserCommandRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(
        self,
        login: str,
        email: str,
        password_hash: str,
        avatar_url: str | None = None,
        role: str = "user",
    ) -> User:
        user = User(
            login=login,
            email=email,
            password_hash=password_hash,
            avatar_url=avatar_url,
            role=role,
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user
