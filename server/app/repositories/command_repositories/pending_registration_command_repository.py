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
        resend_available_at: datetime,
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
            resend_available_at = resend_available_at
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
        resend_available_at: datetime,
        avatar_url: str | None = None,
    ) -> PendingRegistration:
        pending_registration.login = login
        pending_registration.password_hash = password_hash
        pending_registration.avatar_url = avatar_url
        pending_registration.verification_code_hash = verification_code_hash
        pending_registration.attempts = 0
        pending_registration.expires_at = datetime.now(UTC) + timedelta(minutes=10)
        pending_registration.resend_available_at = resend_available_at

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

    def update_verification_code(
            self,
            pending_registration: PendingRegistration,
            verification_code_hash: str,
            expires_at: datetime,
            resend_available_at: datetime,
    ) -> PendingRegistration:
        pending_registration.verification_code_hash = verification_code_hash
        pending_registration.expires_at = expires_at
        pending_registration.resend_available_at = resend_available_at
        pending_registration.attempts = 0

        self.db.commit()
        self.db.refresh(pending_registration)

        return pending_registration