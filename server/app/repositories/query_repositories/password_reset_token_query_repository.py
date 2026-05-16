from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.password_reset_token import PasswordResetToken


class PasswordResetTokenQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_token_hash(self, token_hash: str) -> PasswordResetToken | None:
        stmt = select(PasswordResetToken).where(
            PasswordResetToken.token_hash == token_hash,
        )

        return self.db.execute(stmt).scalar_one_or_none()

    def find_valid_by_token_hash(self, token_hash: str) -> PasswordResetToken | None:
        now = datetime.now(UTC)

        stmt = select(PasswordResetToken).where(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > now,
        )

        return self.db.execute(stmt).scalar_one_or_none()