ASSET_READ = "asset:read"
ASSET_CREATE = "asset:create"
ASSET_UPDATE = "asset:update"
ASSET_DELETE = "asset:delete"
TRANSFER_CREATE = "transfer:create"
MEMBER_INVITE = "member:invite"
MEMBER_REMOVE = "member:remove"
ORGANIZATION_UPDATE = "organization:update"

OWNER_PERMISSIONS = [
    ASSET_READ,
    ASSET_CREATE,
    ASSET_UPDATE,
    ASSET_DELETE,
    TRANSFER_CREATE,
    MEMBER_INVITE,
    MEMBER_REMOVE,
    ORGANIZATION_UPDATE,
]

ADMIN_PERMISSIONS = [
    ASSET_READ,
    ASSET_CREATE,
    ASSET_UPDATE,
    ASSET_DELETE,
    TRANSFER_CREATE,
    MEMBER_INVITE,
]

MEMBER_PERMISSIONS = [
    ASSET_READ,
    TRANSFER_CREATE,
]

ROLE_PERMISSIONS = {
    "owner": OWNER_PERMISSIONS,
    "admin": ADMIN_PERMISSIONS,
    "member": MEMBER_PERMISSIONS,
}


def get_permissions_for_role(role: str | None) -> list[str]:
    return list(ROLE_PERMISSIONS.get(role, []))
