from sqlalchemy.orm import Session
from datetime import UTC, datetime
from secrets import token_urlsafe
from sqlalchemy import update

from app.models.user_session import UserSession


class SessionCommandRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_session(
            self,
            user_id: int,
            refresh_token_hash: str,
            user_agent: str | None,
            ip_address: str | None,
            expires_at: datetime,
    ) -> UserSession:
        user_session = UserSession(
            user_id=user_id,
            refresh_token_hash=refresh_token_hash,
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=expires_at,
        )

        self.db.add(user_session)
        self.db.commit()
        self.db.refresh(user_session)

        return user_session

    def revoke_session(self, user_session: UserSession) -> UserSession:
        user_session.revoked_at = datetime.now(UTC)

        self.db.commit()
        self.db.refresh(user_session)

        return user_session

    def update_last_used_at(self, user_session: UserSession) -> UserSession:
        user_session.last_used_at = datetime.now(UTC)

        self.db.commit()
        self.db.refresh(user_session)

        return user_session

    def create_pending_session(
            self,
            user_id: int,
            user_agent: str | None,
            ip_address: str | None,
            expires_at: datetime,
    ) -> UserSession:
        user_session = UserSession(
            user_id=user_id,
            refresh_token_hash=f"pending:{token_urlsafe(64)}",
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=expires_at,
        )

        self.db.add(user_session)
        self.db.flush()
        self.db.refresh(user_session)

        return user_session

    def rotate_refresh_token(
            self,
            user_session: UserSession,
            refresh_token_hash: str,
            user_agent: str | None,
            ip_address: str | None,
            expires_at: datetime,
    ) -> UserSession:
        user_session.refresh_token_hash = refresh_token_hash
        user_session.user_agent = user_agent
        user_session.ip_address = ip_address
        user_session.expires_at = expires_at
        user_session.last_used_at = datetime.now(UTC)

        self.db.commit()
        self.db.refresh(user_session)

        return user_session

    def delete_session(self, user_session: UserSession) -> None:
        self.db.delete(user_session)
        self.db.commit()

    def revoke_active_sessions_for_user(self, user_id: int) -> None:
        stmt = (
            update(UserSession)
            .where(
                UserSession.user_id == user_id,
                UserSession.revoked_at.is_(None),
            )
            .values(revoked_at=datetime.now(UTC))
        )

        self.db.execute(stmt)
        self.db.commit()
