from datetime import UTC, datetime

from sqlalchemy import update, delete
from sqlalchemy.orm import Session

from app.models.password_reset_token import PasswordResetToken


class PasswordResetTokenCommandRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        user_id: int,
        token_hash: str,
        expires_at: datetime,
    ) -> PasswordResetToken:
        reset_token = PasswordResetToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        self.db.add(reset_token)
        self.db.commit()
        self.db.refresh(reset_token)

        return reset_token

    def mark_as_used(self, reset_token: PasswordResetToken) -> None:
        reset_token.used_at = datetime.now(UTC)
        self.db.commit()

    def revoke_active_tokens_for_user(self, user_id: int) -> None:
        stmt = (
            update(PasswordResetToken)
            .where(
                PasswordResetToken.user_id == user_id,
                PasswordResetToken.used_at.is_(None),
            )
            .values(used_at=datetime.now(UTC))
        )

        self.db.execute(stmt)
        self.db.commit()

    def delete_expired_tokens(self) -> None:
        stmt = delete(PasswordResetToken).where(
            PasswordResetToken.expires_at <= datetime.now(UTC),
        )

        self.db.execute(stmt)
        self.db.commit()
