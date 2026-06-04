from sqlalchemy.orm import Session

from app.models.organization_member import OrganizationMember


class OrganizationMemberCommandRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        organization_id: int,
        user_id: int,
        role: str,
        status: str,
    ) -> OrganizationMember:
        membership = OrganizationMember(
            organization_id=organization_id,
            user_id=user_id,
            role=role,
            status=status,
        )

        self.db.add(membership)
        self.db.flush()
        self.db.refresh(membership)

        return membership

    def update_status(
        self,
        membership: OrganizationMember,
        status: str,
    ) -> OrganizationMember:
        membership.status = status

        self.db.flush()
        self.db.refresh(membership)

        return membership

    def delete(self, membership: OrganizationMember) -> None:
        self.db.delete(membership)
        self.db.flush()
