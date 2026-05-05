from sqlalchemy.orm import Session
from app.models.user import User
from sqlalchemy import select
class UserQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_email(self, email: str) -> User | None:
        statement = select(User).where(
            User.email == email,
        )

        return self.db.scalars(statement).first()

    def find_by_id(self, user_id: int) -> User | None:
        statement = select(User).where(
            User.id == user_id,
        )

        return self.db.scalars(statement).first()