from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog


class ActivityLogQueryRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_recent_for_user(
        self,
        organization_id: int,
        user_id: int,
        limit: int = 10,
    ) -> list[ActivityLog]:
        statement = (
            select(ActivityLog)
            .where(
                ActivityLog.organization_id == organization_id,
                ActivityLog.user_id == user_id,
            )
            .order_by(ActivityLog.created_at.desc())
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())
