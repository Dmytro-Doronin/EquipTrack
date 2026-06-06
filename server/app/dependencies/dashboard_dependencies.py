from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.query_repositories.activity_log_query_repository import (
    ActivityLogQueryRepository,
)
from app.repositories.query_repositories.asset_query_repository import (
    AssetQueryRepository,
)
from app.repositories.query_repositories.asset_transfer_query_repository import (
    AssetTransferQueryRepository,
)
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)
from app.services.dashboard_service import DashboardService


def get_dashboard_service(db: Session = Depends(get_db)) -> DashboardService:
    return DashboardService(
        activity_log_query_repository=ActivityLogQueryRepository(db),
        asset_query_repository=AssetQueryRepository(db),
        asset_transfer_query_repository=AssetTransferQueryRepository(db),
        organization_member_query_repository=OrganizationMemberQueryRepository(db),
    )
