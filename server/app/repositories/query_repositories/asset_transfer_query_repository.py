from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.models.asset_transfer import AssetTransfer


class AssetTransferQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_pending_for_user(
        self,
        organization_id: int,
        user_id: int,
        limit: int = 10,
    ) -> list[AssetTransfer]:
        statement = (
            select(AssetTransfer)
            .options(
                joinedload(AssetTransfer.asset),
                joinedload(AssetTransfer.from_user),
                joinedload(AssetTransfer.to_user),
            )
            .where(
                AssetTransfer.organization_id == organization_id,
                AssetTransfer.status == "pending",
                or_(
                    AssetTransfer.from_user_id == user_id,
                    AssetTransfer.to_user_id == user_id,
                ),
            )
            .order_by(AssetTransfer.created_at.desc())
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def count_pending_for_user(
        self,
        organization_id: int,
        user_id: int,
    ) -> int:
        statement = select(func.count()).select_from(AssetTransfer).where(
            AssetTransfer.organization_id == organization_id,
            AssetTransfer.status == "pending",
            or_(
                AssetTransfer.from_user_id == user_id,
                AssetTransfer.to_user_id == user_id,
            ),
        )

        return self.db.scalar(statement) or 0

    def count_pending_by_organization(self, organization_id: int) -> int:
        statement = select(func.count()).select_from(AssetTransfer).where(
            AssetTransfer.organization_id == organization_id,
            AssetTransfer.status == "pending",
        )

        return self.db.scalar(statement) or 0
