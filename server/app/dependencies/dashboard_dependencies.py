from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)
from app.services.dashboard_service import DashboardService


def get_dashboard_service(db: Session = Depends(get_db)) -> DashboardService:
    return DashboardService(
        organization_member_query_repository=OrganizationMemberQueryRepository(db),
    )
