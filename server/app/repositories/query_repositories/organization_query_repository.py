from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.organization import Organization


class OrganizationQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_id(self, organization_id: int) -> Organization | None:
        statement = select(Organization).where(Organization.id == organization_id)

        return self.db.scalars(statement).first()

    def search_by_name(self, query: str, limit: int = 10) -> list[Organization]:
        normalized_query = query.strip()

        if not normalized_query:
            return []

        statement = (
            select(Organization)
            .where(Organization.name.ilike(f"%{normalized_query}%"))
            .order_by(Organization.name.asc())
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())
