from sqlalchemy.orm import Session
from app.models.user import User

class UserQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_email(self, email: str) -> type[User] | None:
        return self.db.query(User).filter(User.email == email).first()

    def find_by_id(self, user_id: int) -> type[User] | None:
        return self.db.query(User).filter(User.id == user_id).first()