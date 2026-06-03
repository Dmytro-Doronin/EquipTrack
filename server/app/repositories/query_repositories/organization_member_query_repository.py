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

    def find_pending_by_user_id(self, user_id: int) -> list[OrganizationMember]:
        statement = (
            select(OrganizationMember)
            .options(joinedload(OrganizationMember.organization))
            .where(
                OrganizationMember.user_id == user_id,
                OrganizationMember.status == "pending",
            )
            .order_by(OrganizationMember.created_at.desc())
        )

        return list(self.db.scalars(statement).all())

    def find_pending_by_user_and_organization(
        self,
        user_id: int,
        organization_id: int,
    ) -> OrganizationMember | None:
        statement = (
            select(OrganizationMember)
            .options(joinedload(OrganizationMember.organization))
            .where(
                OrganizationMember.user_id == user_id,
                OrganizationMember.organization_id == organization_id,
                OrganizationMember.status == "pending",
            )
        )

        return self.db.scalars(statement).first()
