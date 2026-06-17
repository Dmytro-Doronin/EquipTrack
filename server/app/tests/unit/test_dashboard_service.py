from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import Mock

from app.core.permissions import (
    ADMIN_PERMISSIONS,
    MEMBER_PERMISSIONS,
    OWNER_PERMISSIONS,
)
from app.services.dashboard_service import DashboardService


def make_dashboard_service():
    dependencies = {
        "activity_log_query_repository": Mock(),
        "asset_query_repository": Mock(),
        "asset_transfer_query_repository": Mock(),
        "organization_member_query_repository": Mock(),
    }

    return DashboardService(**dependencies), dependencies


def make_user():
    return SimpleNamespace(
        id=5,
        login="john",
        email="john@example.com",
        avatar_url=None,
        role="user",
    )


def make_organization():
    return SimpleNamespace(
        id=1,
        name="Albert Heijn Haarlem",
    )


def make_active_membership(role: str = "member"):
    organization = make_organization()

    return SimpleNamespace(
        id=9,
        organization_id=organization.id,
        organization=organization,
        role=role,
        status="active",
    )


def test_get_context_enriches_active_member_dashboard_with_real_rows():
    dashboard_service, dependencies = make_dashboard_service()
    now = datetime(2026, 6, 3, 10, 0, tzinfo=UTC)
    user = make_user()
    membership = make_active_membership()
    asset = SimpleNamespace(
        id=1,
        name="Dell XPS 15",
        category="Laptop",
        serial_number="DXPS-001",
        status="assigned",
        assigned_at=now,
        due_date=None,
        created_at=now - timedelta(days=1),
    )
    transfer = SimpleNamespace(
        id=7,
        asset_id=asset.id,
        asset=asset,
        from_user=SimpleNamespace(id=2, login="admin"),
        to_user=user,
        status="pending",
        created_at=now,
    )
    activity = SimpleNamespace(
        id=15,
        type="asset_assigned",
        message="Dell XPS 15 was assigned to you",
        created_at=now,
    )

    dependencies[
        "organization_member_query_repository"
    ].find_active_by_user_id.return_value = membership
    dependencies["asset_query_repository"].find_assigned_to_user.return_value = [asset]
    dependencies["asset_query_repository"].count_assigned_to_user.return_value = 3
    dependencies["asset_query_repository"].count_overdue_assigned_to_user.return_value = 0
    dependencies["asset_transfer_query_repository"].find_pending_for_user.return_value = [
        transfer,
    ]
    dependencies[
        "asset_transfer_query_repository"
    ].count_pending_for_user.return_value = 1
    dependencies["activity_log_query_repository"].find_recent_for_user.return_value = [
        activity,
    ]

    result = dashboard_service.get_context(user)

    assert result.activeOrganization is not None
    assert result.activeOrganization.name == membership.organization.name
    assert result.membership is not None
    assert result.membership.role == "member"
    assert result.permissions == MEMBER_PERMISSIONS
    assert result.stats.assignedAssets == 3
    assert result.stats.pendingTransfers == 1
    assert result.stats.overdueReturns == 0
    assert result.myAssets[0].name == asset.name
    assert result.myAssets[0].serialNumber == asset.serial_number
    assert result.myTransfers[0].assetName == asset.name
    assert result.myTransfers[0].fromUser is not None
    assert result.myTransfers[0].fromUser.login == "admin"
    assert result.recentActivity[0].message == activity.message

    dependencies["asset_query_repository"].find_assigned_to_user.assert_called_once_with(
        organization_id=membership.organization_id,
        user_id=user.id,
    )
    dependencies[
        "asset_transfer_query_repository"
    ].find_pending_for_user.assert_called_once_with(
        organization_id=membership.organization_id,
        user_id=user.id,
    )
    dependencies["activity_log_query_repository"].find_recent_for_user.assert_called_once_with(
        organization_id=membership.organization_id,
        user_id=user.id,
    )


def test_get_context_enriches_admin_dashboard_with_organization_rows():
    dashboard_service, dependencies = make_dashboard_service()
    now = datetime(2026, 6, 3, 10, 0, tzinfo=UTC)
    user = make_user()
    membership = make_active_membership(role="admin")
    assigned_user = SimpleNamespace(id=8, login="anna")
    asset = SimpleNamespace(
        id=1,
        name="Dell XPS 15",
        category="Laptop",
        serial_number="DXPS-001",
        status="assigned",
        assigned_to_user=assigned_user,
        created_at=now,
    )
    member = SimpleNamespace(
        id=3,
        user=SimpleNamespace(
            id=5,
            login="john",
            email="john@example.com",
            avatar_url=None,
        ),
        role="member",
        status="active",
        created_at=now,
    )
    activity = SimpleNamespace(
        id=15,
        type="asset_assigned",
        message="Dell XPS 15 was assigned to john",
        created_at=now,
    )

    dependencies[
        "organization_member_query_repository"
    ].find_active_by_user_id.return_value = membership
    dependencies["asset_query_repository"].find_latest_by_organization.return_value = [
        asset,
    ]
    dependencies["asset_query_repository"].count_by_organization.return_value = 25
    dependencies["asset_query_repository"].count_by_organization_and_status.side_effect = [
        12,
        8,
        3,
        2,
    ]
    dependencies["asset_query_repository"].count_overdue_by_organization.return_value = 0
    dependencies[
        "organization_member_query_repository"
    ].find_active_by_organization_id.return_value = [member]
    dependencies[
        "organization_member_query_repository"
    ].count_by_organization_and_status.side_effect = [6, 2]
    dependencies[
        "asset_transfer_query_repository"
    ].count_pending_by_organization.return_value = 1
    dependencies["activity_log_query_repository"].find_recent_by_organization.return_value = [
        activity,
    ]

    result = dashboard_service.get_context(user)

    assert result.membership is not None
    assert result.membership.role == "admin"
    assert result.permissions == ADMIN_PERMISSIONS
    assert result.stats.totalAssets == 25
    assert result.stats.assignedAssets == 12
    assert result.stats.availableAssets == 8
    assert result.stats.maintenanceAssets == 3
    assert result.stats.lostAssets == 2
    assert result.stats.members == 6
    assert result.stats.pendingJoinRequests == 2
    assert result.stats.pendingTransfers == 1
    assert result.latestAssets[0].assignedTo is not None
    assert result.latestAssets[0].assignedTo.login == assigned_user.login
    assert result.membersPreview[0].email == member.user.email
    assert result.recentActivity[0].message == activity.message
    assert result.myAssets == []
    assert result.myTransfers == []
    dependencies["asset_query_repository"].find_assigned_to_user.assert_not_called()
    dependencies["asset_transfer_query_repository"].find_pending_for_user.assert_not_called()
    dependencies[
        "asset_query_repository"
    ].find_latest_by_organization.assert_called_once_with(
        organization_id=membership.organization_id,
    )
    dependencies[
        "organization_member_query_repository"
    ].find_active_by_organization_id.assert_called_once_with(
        organization_id=membership.organization_id,
    )
    dependencies[
        "activity_log_query_repository"
    ].find_recent_by_organization.assert_called_once_with(
        organization_id=membership.organization_id,
    )


def test_get_context_adds_owner_permissions():
    dashboard_service, dependencies = make_dashboard_service()
    user = make_user()
    membership = make_active_membership(role="owner")

    dependencies[
        "organization_member_query_repository"
    ].find_active_by_user_id.return_value = membership
    dependencies["asset_query_repository"].find_latest_by_organization.return_value = []
    dependencies["asset_query_repository"].count_by_organization.return_value = 0
    dependencies["asset_query_repository"].count_by_organization_and_status.return_value = 0
    dependencies["asset_query_repository"].count_overdue_by_organization.return_value = 0
    dependencies[
        "organization_member_query_repository"
    ].find_active_by_organization_id.return_value = []
    dependencies[
        "organization_member_query_repository"
    ].count_by_organization_and_status.return_value = 0
    dependencies[
        "asset_transfer_query_repository"
    ].count_pending_by_organization.return_value = 0
    dependencies["activity_log_query_repository"].find_recent_by_organization.return_value = []

    result = dashboard_service.get_context(user)

    assert result.membership is not None
    assert result.membership.role == "owner"
    assert result.permissions == OWNER_PERMISSIONS


def test_get_context_preserves_pending_request_state_without_member_queries():
    dashboard_service, dependencies = make_dashboard_service()
    user = make_user()
    organization = make_organization()
    pending_request = SimpleNamespace(
        id=4,
        organization_id=organization.id,
        organization=organization,
        status="pending",
        created_at=datetime(2026, 6, 2, 9, 0, tzinfo=UTC),
    )

    dependencies[
        "organization_member_query_repository"
    ].find_active_by_user_id.return_value = None
    dependencies[
        "organization_member_query_repository"
    ].find_pending_by_user_id.return_value = [pending_request]

    result = dashboard_service.get_context(user)

    assert result.activeOrganization is None
    assert result.membership is None
    assert result.permissions == []
    assert result.pendingRequests[0].organizationName == organization.name
    assert result.stats.pendingTransfers == 0
    assert result.myAssets == []
    dependencies["asset_query_repository"].find_assigned_to_user.assert_not_called()
    dependencies["asset_transfer_query_repository"].find_pending_for_user.assert_not_called()
    dependencies["activity_log_query_repository"].find_recent_for_user.assert_not_called()
