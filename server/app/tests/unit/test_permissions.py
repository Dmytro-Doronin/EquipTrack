from app.core.permissions import (
    ADMIN_PERMISSIONS,
    MEMBER_PERMISSIONS,
    OWNER_PERMISSIONS,
    get_permissions_for_role,
)


def test_get_permissions_for_role_returns_owner_permissions():
    assert get_permissions_for_role("owner") == OWNER_PERMISSIONS


def test_get_permissions_for_role_returns_admin_permissions():
    assert get_permissions_for_role("admin") == ADMIN_PERMISSIONS


def test_get_permissions_for_role_returns_member_permissions():
    assert get_permissions_for_role("member") == MEMBER_PERMISSIONS


def test_get_permissions_for_role_returns_empty_list_for_unknown_role():
    assert get_permissions_for_role("viewer") == []


def test_get_permissions_for_role_returns_empty_list_for_missing_role():
    assert get_permissions_for_role(None) == []
