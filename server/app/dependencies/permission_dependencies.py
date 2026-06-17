from collections.abc import Callable

from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import CurrentUser
from app.core.permissions import get_permissions_for_role
from app.db.database import get_db
from app.errors.app_error import raise_app_error
from app.models.organization_member import OrganizationMember
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)


def require_permissions(
    *required_permissions: str,
) -> Callable[[CurrentUser, Session], OrganizationMember]:
    def permission_dependency(
        current_user: CurrentUser,
        db: Session = Depends(get_db),
    ) -> OrganizationMember:
        membership = OrganizationMemberQueryRepository(db).find_active_by_user_id(
            current_user.id,
        )

        if membership is None:
            raise_app_error("Forbidden", status_code=403)

        permissions = set(get_permissions_for_role(membership.role))

        if not set(required_permissions).issubset(permissions):
            raise_app_error("Forbidden", status_code=403)

        return membership

    return permission_dependency
