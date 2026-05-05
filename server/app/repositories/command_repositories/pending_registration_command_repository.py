from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from app.models.pending_registration import PendingRegistration


class PendingRegistrationCommandRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_pending_registration(
        self,
        login: str,
        email: str,
        password_hash: str,
        verification_code_hash: str,
        avatar_url: str | None = None,
    ) -> PendingRegistration:
        pending_registration = PendingRegistration(
            login=login,
            email=email,
            password_hash=password_hash,
            avatar_url=avatar_url,
            verification_code_hash=verification_code_hash,
            attempts=0,
            expires_at=datetime.now(UTC) + timedelta(minutes=10),
        )

        self.db.add(pending_registration)
        self.db.commit()
        self.db.refresh(pending_registration)

        return pending_registration

    def update_pending_registration(
        self,
        pending_registration: PendingRegistration,
        login: str,
        password_hash: str,
        verification_code_hash: str,
        avatar_url: str | None = None,
    ) -> PendingRegistration:
        pending_registration.login = login
        pending_registration.password_hash = password_hash
        pending_registration.avatar_url = avatar_url
        pending_registration.verification_code_hash = verification_code_hash
        pending_registration.attempts = 0
        pending_registration.expires_at = datetime.now(UTC) + timedelta(minutes=10)

        self.db.commit()
        self.db.refresh(pending_registration)

        return pending_registration

    def increment_attempts(
        self,
        pending_registration: PendingRegistration,
    ) -> PendingRegistration:
        pending_registration.attempts += 1

        self.db.commit()
        self.db.refresh(pending_registration)

        return pending_registration

    def delete_pending_registration(
        self,
        pending_registration: PendingRegistration,
    ) -> None:
        self.db.delete(pending_registration)
        self.db.commit()