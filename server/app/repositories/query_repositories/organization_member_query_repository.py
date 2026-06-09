from sqlalchemy import func, select
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

    def find_active_by_user_and_organization(
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

    def find_by_id(self, membership_id: int) -> OrganizationMember | None:
        statement = (
            select(OrganizationMember)
            .options(
                joinedload(OrganizationMember.organization),
                joinedload(OrganizationMember.user),
            )
            .where(OrganizationMember.id == membership_id)
        )

        return self.db.scalars(statement).first()

    def find_pending_by_organization_id(
        self,
        organization_id: int,
    ) -> list[OrganizationMember]:
        statement = (
            select(OrganizationMember)
            .options(joinedload(OrganizationMember.user))
            .where(
                OrganizationMember.organization_id == organization_id,
                OrganizationMember.status == "pending",
            )
            .order_by(OrganizationMember.created_at.asc())
        )

        return list(self.db.scalars(statement).all())

    def find_active_by_organization_id(
        self,
        organization_id: int,
        limit: int = 10,
    ) -> list[OrganizationMember]:
        statement = (
            select(OrganizationMember)
            .options(joinedload(OrganizationMember.user))
            .where(
                OrganizationMember.organization_id == organization_id,
                OrganizationMember.status == "active",
            )
            .order_by(OrganizationMember.created_at.desc())
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def count_by_organization_and_status(
        self,
        organization_id: int,
        status: str,
    ) -> int:
        statement = select(func.count()).select_from(OrganizationMember).where(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.status == status,
        )

        return self.db.scalar(statement) or 0
