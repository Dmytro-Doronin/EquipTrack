from sqlalchemy.orm import Session

from app.models.pending_registration import PendingRegistration

class PendingRegistrationQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_email(self, email: str) -> type[PendingRegistration] | None:
        return (
            self.db.query(PendingRegistration)
            .filter(PendingRegistration.email == email)
            .first()
        )