from app.services.dashboard_service import DashboardService


def get_dashboard_service() -> DashboardService:
    return DashboardService()
