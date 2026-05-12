from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user_session import UserSession


class SessionQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_active_by_id(self, session_id: int) -> UserSession | None:
        statement = select(UserSession).where(
            UserSession.id == session_id,
            UserSession.revoked_at.is_(None),
            UserSession.expires_at > datetime.now(UTC),
        )

        return self.db.scalars(statement).first()
