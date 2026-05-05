from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.pending_registration import PendingRegistration

class PendingRegistrationQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_email(self, email: str) -> PendingRegistration | None:
        statement = select(PendingRegistration).where(
            PendingRegistration.email == email,
        )

        return self.db.scalars(statement).first()