from app.models.user import User
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)
from app.schemas.dashboard import (
    DashboardContextSchema,
    DashboardMembershipSchema,
    DashboardOrganizationSchema,
    DashboardUserSchema,
)
from app.utils.format import format_auth_user


class DashboardService:
    def __init__(
        self,
        organization_member_query_repository: OrganizationMemberQueryRepository,
    ):
        self.organization_member_query_repository = organization_member_query_repository

    def get_context(self, current_user: User) -> DashboardContextSchema:
        active_membership = (
            self.organization_member_query_repository.find_active_by_user_id(
                current_user.id,
            )
        )
        active_organization = (
            active_membership.organization if active_membership is not None else None
        )

        return DashboardContextSchema(
            user=DashboardUserSchema(**format_auth_user(current_user)),
            activeOrganization=DashboardOrganizationSchema(
                id=active_organization.id,
                name=active_organization.name,
            )
            if active_organization is not None
            else None,
            membership=DashboardMembershipSchema(
                role=active_membership.role,
                status=active_membership.status,
            )
            if active_membership is not None
            else None,
            pendingRequests=[],
            stats=None,
            recentActivity=[],
        )
