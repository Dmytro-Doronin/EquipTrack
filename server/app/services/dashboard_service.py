from datetime import UTC, datetime

from app.models.activity_log import ActivityLog
from app.models.asset import Asset
from app.models.asset_transfer import AssetTransfer
from app.models.user import User
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
from app.schemas.dashboard import (
    DashboardActivityItemSchema,
    DashboardAssetItemSchema,
    DashboardContextSchema,
    DashboardMembershipSchema,
    DashboardOrganizationSchema,
    DashboardPendingRequestSchema,
    DashboardStatsSchema,
    DashboardTransferItemSchema,
    DashboardTransferUserSchema,
    DashboardUserSchema,
)
from app.utils.format import format_auth_user, format_datetime_z


class DashboardService:
    def __init__(
        self,
        activity_log_query_repository: ActivityLogQueryRepository,
        asset_query_repository: AssetQueryRepository,
        asset_transfer_query_repository: AssetTransferQueryRepository,
        organization_member_query_repository: OrganizationMemberQueryRepository,
    ):
        self.activity_log_query_repository = activity_log_query_repository
        self.asset_query_repository = asset_query_repository
        self.asset_transfer_query_repository = asset_transfer_query_repository
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
        pending_requests = (
            []
            if active_membership is not None
            else self.organization_member_query_repository.find_pending_by_user_id(
                current_user.id,
            )
        )
        member_dashboard_data = (
            self._get_member_dashboard_data(
                organization_id=active_membership.organization_id,
                user_id=current_user.id,
            )
            if active_membership is not None and active_membership.role == "member"
            else {}
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
            pendingRequests=[
                DashboardPendingRequestSchema(
                    id=pending_request.id,
                    organizationId=pending_request.organization_id,
                    organizationName=pending_request.organization.name,
                    status="pending",
                    createdAt=format_datetime_z(pending_request.created_at),
                )
                for pending_request in pending_requests
            ],
            **member_dashboard_data,
        )

    def _get_member_dashboard_data(
        self,
        organization_id: int,
        user_id: int,
    ) -> dict:
        assets = self.asset_query_repository.find_assigned_to_user(
            organization_id=organization_id,
            user_id=user_id,
        )
        transfers = self.asset_transfer_query_repository.find_pending_for_user(
            organization_id=organization_id,
            user_id=user_id,
        )
        recent_activity = self.activity_log_query_repository.find_recent_for_user(
            organization_id=organization_id,
            user_id=user_id,
        )

        return {
            "stats": DashboardStatsSchema(
                assignedAssets=self.asset_query_repository.count_assigned_to_user(
                    organization_id=organization_id,
                    user_id=user_id,
                ),
                pendingTransfers=(
                    self.asset_transfer_query_repository.count_pending_for_user(
                        organization_id=organization_id,
                        user_id=user_id,
                    )
                ),
                overdueReturns=(
                    self.asset_query_repository.count_overdue_assigned_to_user(
                        organization_id=organization_id,
                        user_id=user_id,
                        now=datetime.now(UTC),
                    )
                ),
            ),
            "myAssets": [self._format_asset(asset) for asset in assets],
            "myTransfers": [
                self._format_transfer(transfer) for transfer in transfers
            ],
            "recentActivity": [
                self._format_activity(activity) for activity in recent_activity
            ],
        }

    def _format_asset(self, asset: Asset) -> DashboardAssetItemSchema:
        assigned_at = asset.assigned_at or asset.created_at

        return DashboardAssetItemSchema(
            id=asset.id,
            name=asset.name,
            category=asset.category,
            serialNumber=asset.serial_number,
            status=asset.status,
            assignedAt=format_datetime_z(assigned_at),
            dueDate=format_datetime_z(asset.due_date) if asset.due_date else None,
        )

    def _format_transfer(
        self,
        transfer: AssetTransfer,
    ) -> DashboardTransferItemSchema:
        return DashboardTransferItemSchema(
            id=transfer.id,
            assetId=transfer.asset_id,
            assetName=transfer.asset.name,
            fromUser=self._format_transfer_user(transfer.from_user),
            toUser=self._format_transfer_user(transfer.to_user),
            status=transfer.status,
            createdAt=format_datetime_z(transfer.created_at),
        )

    def _format_activity(self, activity: ActivityLog) -> DashboardActivityItemSchema:
        return DashboardActivityItemSchema(
            id=activity.id,
            type=activity.type,
            message=activity.message,
            createdAt=format_datetime_z(activity.created_at),
        )

    def _format_transfer_user(
        self,
        user: User | None,
    ) -> DashboardTransferUserSchema | None:
        if user is None:
            return None

        return DashboardTransferUserSchema(
            id=user.id,
            login=user.login,
        )
