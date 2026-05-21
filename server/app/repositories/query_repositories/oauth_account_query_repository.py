from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.oauth_account import OAuthAccount


class OAuthAccountQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_provider_user_id(
        self,
        provider: str,
        provider_user_id: str,
    ) -> OAuthAccount | None:
        statement = select(OAuthAccount).where(
            OAuthAccount.provider == provider,
            OAuthAccount.provider_user_id == provider_user_id,
        )

        return self.db.scalars(statement).first()

    def find_by_user_and_provider(
        self,
        user_id: int,
        provider: str,
    ) -> OAuthAccount | None:
        statement = select(OAuthAccount).where(
            OAuthAccount.user_id == user_id,
            OAuthAccount.provider == provider,
        )

        return self.db.scalars(statement).first()

    def find_by_email_and_provider(
        self,
        email: str,
        provider: str,
    ) -> OAuthAccount | None:
        statement = select(OAuthAccount).where(
            OAuthAccount.email == email,
            OAuthAccount.provider == provider,
        )

        return self.db.scalars(statement).first()
