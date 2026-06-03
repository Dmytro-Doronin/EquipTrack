from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.organization_member import OrganizationMember


class OrganizationMemberQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_active_by_user_id(self, user_id: int) -> OrganizationMember | None:
        statement = (
            select(OrganizationMember)
            .options(joinedload(OrganizationMember.organization))
            .where(
                OrganizationMember.user_id == user_id,
                OrganizationMember.status == "active",
            )
        )

        return self.db.scalars(statement).first()
