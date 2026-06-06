from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.asset import Asset


class AssetQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_assigned_to_user(
        self,
        organization_id: int,
        user_id: int,
        limit: int = 10,
    ) -> list[Asset]:
        statement = (
            select(Asset)
            .where(
                Asset.organization_id == organization_id,
                Asset.assigned_to_user_id == user_id,
                Asset.status == "assigned",
            )
            .order_by(
                Asset.assigned_at.desc().nulls_last(),
                Asset.created_at.desc(),
            )
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def count_assigned_to_user(
        self,
        organization_id: int,
        user_id: int,
    ) -> int:
        statement = select(func.count()).select_from(Asset).where(
            Asset.organization_id == organization_id,
            Asset.assigned_to_user_id == user_id,
            Asset.status == "assigned",
        )

        return self.db.scalar(statement) or 0

    def count_overdue_assigned_to_user(
        self,
        organization_id: int,
        user_id: int,
        now: datetime,
    ) -> int:
        statement = select(func.count()).select_from(Asset).where(
            Asset.organization_id == organization_id,
            Asset.assigned_to_user_id == user_id,
            Asset.status == "assigned",
            Asset.due_date < now,
        )

        return self.db.scalar(statement) or 0
