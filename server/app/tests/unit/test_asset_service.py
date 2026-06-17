from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from fastapi import HTTPException

from app.schemas.asset import AssetCreateSchema, AssetUpdateSchema
from app.services.asset_service import AssetService


def make_asset_service():
    dependencies = {
        "db": Mock(),
        "asset_command_repository": Mock(),
        "asset_query_repository": Mock(),
        "organization_member_query_repository": Mock(),
    }

    return AssetService(**dependencies), dependencies


def make_membership(role: str = "owner", organization_id: int = 1):
    return SimpleNamespace(
        id=10,
        organization_id=organization_id,
        role=role,
        status="active",
    )


def make_asset(**overrides):
    values = {
        "assigned_at": None,
        "assigned_to_user": None,
        "assigned_to_user_id": None,
        "category": "Laptop",
        "created_at": datetime(2026, 6, 10, 8, 0, tzinfo=UTC),
        "due_date": None,
        "id": 25,
        "image_url": "https://cdn.example.com/assets/laptop.jpg",
        "name": "Dell XPS 15",
        "organization_id": 1,
        "serial_number": "DXPS-001",
        "status": "available",
    }
    values.update(overrides)

    return SimpleNamespace(**values)


def test_create_asset_persists_asset_in_manager_organization():
    asset_service, dependencies = make_asset_service()
    membership = make_membership(role="owner", organization_id=7)
    assigned_user_membership = make_membership(role="member", organization_id=7)
    asset = make_asset(
        assigned_to_user=SimpleNamespace(id=9, login="jane"),
        assigned_to_user_id=9,
        organization_id=membership.organization_id,
    )
    data = AssetCreateSchema(
        assignedToUserId=9,
        category="Laptop",
        imageUrl="https://cdn.example.com/assets/laptop.jpg",
        name="Dell XPS 15",
        serialNumber="DXPS-001",
        status="assigned",
    )

    dependencies[
        "organization_member_query_repository"
    ].find_active_by_user_and_organization.return_value = assigned_user_membership
    dependencies["asset_command_repository"].create.return_value = asset

    result = asset_service.create_asset(
        manager_membership=membership,
        data=data,
    )

    assert result.organizationId == membership.organization_id
    assert result.imageUrl == data.imageUrl
    assert result.assignedTo is not None
    assert result.assignedTo.login == "jane"
    dependencies["asset_command_repository"].create.assert_called_once_with(
        organization_id=membership.organization_id,
        name=data.name,
        category=data.category,
        serial_number=data.serialNumber,
        status=data.status,
        assigned_to_user_id=data.assignedToUserId,
        assigned_at=data.assignedAt,
        due_date=data.dueDate,
        image_url=data.imageUrl,
    )
    dependencies["db"].commit.assert_called_once()


def test_update_asset_partially_updates_image_url():
    asset_service, dependencies = make_asset_service()
    membership = make_membership(role="admin", organization_id=1)
    asset = make_asset(image_url="https://cdn.example.com/assets/old.jpg")
    updated_asset = make_asset(image_url="https://cdn.example.com/assets/new.jpg")
    data = AssetUpdateSchema(imageUrl="https://cdn.example.com/assets/new.jpg")

    dependencies["asset_query_repository"].find_by_id.return_value = asset
    dependencies["asset_command_repository"].update.return_value = updated_asset

    result = asset_service.update_asset(
        manager_membership=membership,
        asset_id=asset.id,
        data=data,
    )

    assert result.imageUrl == data.imageUrl
    dependencies["asset_command_repository"].update.assert_called_once_with(
        asset=asset,
        values={
            "image_url": data.imageUrl,
        },
    )
    dependencies["db"].commit.assert_called_once()


def test_list_assets_uses_membership_organization_scope():
    asset_service, dependencies = make_asset_service()
    membership = make_membership(role="member", organization_id=7)
    asset = make_asset(organization_id=membership.organization_id)

    dependencies["asset_query_repository"].find_by_organization.return_value = [asset]

    result = asset_service.list_assets(membership=membership)

    assert len(result) == 1
    assert result[0].organizationId == membership.organization_id
    assert result[0].imageUrl == asset.image_url
    dependencies["asset_query_repository"].find_by_organization.assert_called_once_with(
        organization_id=membership.organization_id,
    )


def test_update_asset_rejects_assets_from_another_organization():
    asset_service, dependencies = make_asset_service()
    membership = make_membership(role="owner", organization_id=1)
    asset = make_asset(organization_id=99)

    dependencies["asset_query_repository"].find_by_id.return_value = asset

    with pytest.raises(HTTPException) as exc:
        asset_service.update_asset(
            manager_membership=membership,
            asset_id=asset.id,
            data=AssetUpdateSchema(name="Updated asset"),
        )

    assert exc.value.status_code == 404
    assert exc.value.detail == {
        "message": "Asset not found",
    }
    dependencies["asset_command_repository"].update.assert_not_called()
    dependencies["db"].commit.assert_not_called()


def test_delete_asset_removes_asset_from_manager_organization():
    asset_service, dependencies = make_asset_service()
    membership = make_membership(role="admin", organization_id=1)
    asset = make_asset(organization_id=membership.organization_id)

    dependencies["asset_query_repository"].find_by_id.return_value = asset

    result = asset_service.delete_asset(
        manager_membership=membership,
        asset_id=asset.id,
    )

    assert result.id == asset.id
    assert result.organizationId == membership.organization_id
    dependencies["asset_command_repository"].delete.assert_called_once_with(asset)
    dependencies["db"].commit.assert_called_once()


def test_delete_asset_rejects_assets_from_another_organization():
    asset_service, dependencies = make_asset_service()
    membership = make_membership(role="owner", organization_id=1)
    asset = make_asset(organization_id=99)

    dependencies["asset_query_repository"].find_by_id.return_value = asset

    with pytest.raises(HTTPException) as exc:
        asset_service.delete_asset(
            manager_membership=membership,
            asset_id=asset.id,
        )

    assert exc.value.status_code == 404
    assert exc.value.detail == {
        "message": "Asset not found",
    }
    dependencies["asset_command_repository"].delete.assert_not_called()
    dependencies["db"].commit.assert_not_called()


def test_create_asset_rejects_assignee_outside_organization():
    asset_service, dependencies = make_asset_service()
    membership = make_membership(role="admin", organization_id=1)
    data = AssetCreateSchema(
        assignedToUserId=42,
        category="Laptop",
        name="Dell XPS 15",
        serialNumber="DXPS-001",
    )

    dependencies[
        "organization_member_query_repository"
    ].find_active_by_user_and_organization.return_value = None

    with pytest.raises(HTTPException) as exc:
        asset_service.create_asset(
            manager_membership=membership,
            data=data,
        )

    assert exc.value.status_code == 422
    assert exc.value.detail == {
        "message": "Validation failed",
        "errors": {
            "assignedToUserId": [
                "Assigned user must be an active member of this organization",
            ],
        },
    }
    dependencies["asset_command_repository"].create.assert_not_called()
