from fastapi import APIRouter, Depends

from app.api.dependencies.auth import CurrentUser
from app.dependencies.dashboard_dependencies import get_dashboard_service
from app.schemas.dashboard import DashboardResponseSchema
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponseSchema)
def get_dashboard(
    current_user: CurrentUser,
    dashboard_service: DashboardService = Depends(get_dashboard_service),
) -> DashboardResponseSchema:
    return DashboardResponseSchema(
        success=True,
        data=dashboard_service.get_context(current_user),
    )
