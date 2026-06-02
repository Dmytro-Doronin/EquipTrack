from app.models.user import User
from app.schemas.dashboard import DashboardContextSchema, DashboardUserSchema
from app.utils.format import format_auth_user


class DashboardService:
    def get_context(self, current_user: User) -> DashboardContextSchema:
        return DashboardContextSchema(
            user=DashboardUserSchema(**format_auth_user(current_user)),
            activeOrganization=None,
            membership=None,
            pendingRequests=[],
            stats=None,
            recentActivity=[],
        )
