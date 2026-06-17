from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient

from app.api.dependencies.auth import get_current_user
from app.dependencies.organization_dependencies import get_organization_service
from app.main import app
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)

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


def install_no_membership(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(
        OrganizationMemberQueryRepository,
        "find_active_by_user_id",
        lambda self, user_id: None,
    )


def install_organization_service(service):
    app.dependency_overrides[get_organization_service] = lambda: service


def test_admin_can_list_pending_join_requests(monkeypatch):
    install_authenticated_user()
    membership = install_membership(monkeypatch, role="admin")
    service = SimpleNamespace(
        get_pending_join_requests=Mock(return_value=[]),
    )
    install_organization_service(service)

    response = client.get("/api/organizations/3/join-requests")

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "data": [],
    }
    service.get_pending_join_requests.assert_called_once_with(
        membership=membership,
        organization_id=3,
        status="pending",
    )


def test_member_cannot_list_pending_join_requests(monkeypatch):
    install_authenticated_user()
    install_membership(monkeypatch, role="member")
    service = SimpleNamespace(
        get_pending_join_requests=Mock(),
    )
    install_organization_service(service)

    response = client.get("/api/organizations/3/join-requests")

    assert response.status_code == 403
    assert response.json() == {
        "detail": {
            "message": "Forbidden",
        },
    }
    service.get_pending_join_requests.assert_not_called()


def test_user_without_active_membership_cannot_list_pending_join_requests(
    monkeypatch,
):
    install_authenticated_user()
    install_no_membership(monkeypatch)
    service = SimpleNamespace(
        get_pending_join_requests=Mock(),
    )
    install_organization_service(service)

    response = client.get("/api/organizations/3/join-requests")

    assert response.status_code == 403
    assert response.json() == {
        "detail": {
            "message": "Forbidden",
        },
    }
    service.get_pending_join_requests.assert_not_called()
