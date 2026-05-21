from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.oauth_account import OAuthAccount


class OAuthAccountCommandRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_oauth_account(
        self,
        user_id: int,
        provider: str,
        provider_user_id: str,
        email: str,
    ) -> OAuthAccount:
        oauth_account = OAuthAccount(
            user_id=user_id,
            provider=provider,
            provider_user_id=provider_user_id,
            email=email,
        )

        self.db.add(oauth_account)

        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise

        self.db.refresh(oauth_account)

        return oauth_account
