from sqlalchemy.orm import Session

from app.models.organization import Organization


class OrganizationCommandRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str) -> Organization:
        organization = Organization(name=name)

        self.db.add(organization)
        self.db.flush()
        self.db.refresh(organization)

        return organization
