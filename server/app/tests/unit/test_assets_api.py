from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient

from app.api.dependencies.auth import get_current_user
from app.dependencies.asset_dependencies import get_asset_service
from app.main import app
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)
from app.schemas.asset import AssetSchema

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_dependency_overrides():
    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()


def make_user():
    return SimpleNamespace(
        id=7,
        login="owner",
        email="owner@example.com",
        role="user",
    )


def make_membership(role: str = "owner"):
    return SimpleNamespace(
        id=12,
        organization_id=3,
        role=role,
        status="active",
    )


def make_asset_schema(**overrides) -> AssetSchema:
    values = {
        "assignedAt": None,
        "assignedTo": None,
        "assignedToUserId": None,
        "category": "Laptop",
        "createdAt": datetime(2026, 6, 10, 8, 0, tzinfo=UTC)
        .isoformat()
        .replace("+00:00", "Z"),
        "dueDate": None,
        "id": 44,
        "imageUrl": "https://cdn.example.com/assets/laptop.jpg",
        "name": "Dell XPS 15",
        "organizationId": 3,
        "serialNumber": "DXPS-001",
        "status": "available",
    }
    values.update(overrides)

    return AssetSchema(**values)


def install_authenticated_user():
    app.dependency_overrides[get_current_user] = make_user


def install_membership(monkeypatch: pytest.MonkeyPatch, role: str):
    membership = make_membership(role=role)

    monkeypatch.setattr(
        OrganizationMemberQueryRepository,
        "find_active_by_user_id",
        lambda self, user_id: membership,
    )

    return membership


def install_asset_service(service):
    app.dependency_overrides[get_asset_service] = lambda: service


def test_member_can_list_assets(monkeypatch):
    install_authenticated_user()
    membership = install_membership(monkeypatch, role="member")
    service = SimpleNamespace(
        list_assets=Mock(return_value=[make_asset_schema()]),
    )
    install_asset_service(service)

    response = client.get("/api/assets")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"][0]["name"] == "Dell XPS 15"
    assert payload["data"][0]["imageUrl"] == "https://cdn.example.com/assets/laptop.jpg"
    service.list_assets.assert_called_once_with(membership=membership)


def test_list_assets_returns_empty_list_for_empty_organization(monkeypatch):
    install_authenticated_user()
    membership = install_membership(monkeypatch, role="member")
    service = SimpleNamespace(
        list_assets=Mock(return_value=[]),
    )
    install_asset_service(service)

    response = client.get("/api/assets")

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "data": [],
    }
    service.list_assets.assert_called_once_with(membership=membership)


def test_owner_can_create_asset(monkeypatch):
    install_authenticated_user()
    install_membership(monkeypatch, role="owner")
    service = SimpleNamespace(
        create_asset=Mock(return_value=make_asset_schema()),
    )
    install_asset_service(service)

    response = client.post(
        "/api/assets",
        json={
            "category": "Laptop",
            "imageUrl": "https://cdn.example.com/assets/laptop.jpg",
            "name": "Dell XPS 15",
            "serialNumber": "DXPS-001",
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["imageUrl"] == "https://cdn.example.com/assets/laptop.jpg"
    service.create_asset.assert_called_once()


def test_admin_can_update_asset(monkeypatch):
    install_authenticated_user()
    install_membership(monkeypatch, role="admin")
    service = SimpleNamespace(
        update_asset=Mock(
            return_value=make_asset_schema(
                imageUrl="https://cdn.example.com/assets/updated.jpg",
            ),
        ),
    )
    install_asset_service(service)

    response = client.patch(
        "/api/assets/44",
        json={
            "imageUrl": "https://cdn.example.com/assets/updated.jpg",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["imageUrl"] == "https://cdn.example.com/assets/updated.jpg"
    service.update_asset.assert_called_once()


def test_member_cannot_create_asset(monkeypatch):
    install_authenticated_user()
    install_membership(monkeypatch, role="member")
    service = SimpleNamespace(
        create_asset=Mock(),
    )
    install_asset_service(service)

    response = client.post(
        "/api/assets",
        json={
            "category": "Laptop",
            "name": "Dell XPS 15",
            "serialNumber": "DXPS-001",
        },
    )

    assert response.status_code == 403
    assert response.json() == {
        "detail": {
            "message": "Forbidden",
        },
    }
    service.create_asset.assert_not_called()


def test_member_cannot_update_asset(monkeypatch):
    install_authenticated_user()
    install_membership(monkeypatch, role="member")
    service = SimpleNamespace(
        update_asset=Mock(),
    )
    install_asset_service(service)

    response = client.patch(
        "/api/assets/44",
        json={
            "name": "Updated asset",
        },
    )

    assert response.status_code == 403
    assert response.json() == {
        "detail": {
            "message": "Forbidden",
        },
    }
    service.update_asset.assert_not_called()


def test_unauthenticated_user_cannot_create_asset():
    service = SimpleNamespace(
        create_asset=Mock(),
    )
    install_asset_service(service)

    response = client.post(
        "/api/assets",
        json={
            "category": "Laptop",
            "name": "Dell XPS 15",
            "serialNumber": "DXPS-001",
        },
    )

    assert response.status_code == 401
    service.create_asset.assert_not_called()


def test_unauthenticated_user_cannot_list_assets():
    service = SimpleNamespace(
        list_assets=Mock(),
    )
    install_asset_service(service)

    response = client.get("/api/assets")

    assert response.status_code == 401
    service.list_assets.assert_not_called()


def test_unauthenticated_user_cannot_update_asset():
    service = SimpleNamespace(
        update_asset=Mock(),
    )
    install_asset_service(service)

    response = client.patch(
        "/api/assets/44",
        json={
            "imageUrl": "https://cdn.example.com/assets/updated.jpg",
        },
    )

    assert response.status_code == 401
    service.update_asset.assert_not_called()
