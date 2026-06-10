from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import CurrentUser
from app.db.database import get_db
from app.errors.app_error import raise_app_error
from app.models.organization_member import OrganizationMember
from app.repositories.command_repositories.asset_command_repository import (
    AssetCommandRepository,
)
from app.repositories.query_repositories.asset_query_repository import (
    AssetQueryRepository,
)
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)
from app.services.asset_service import AssetService


def require_asset_manager_role(
    current_user: CurrentUser,
    db: Session = Depends(get_db),
) -> OrganizationMember:
    membership = OrganizationMemberQueryRepository(db).find_active_by_user_id(
        current_user.id,
    )

    if membership is None or membership.role not in {"owner", "admin"}:
        raise_app_error("Forbidden", status_code=403)

    return membership


AssetManagerMembership = Annotated[
    OrganizationMember,
    Depends(require_asset_manager_role),
]


def get_asset_service(db: Session = Depends(get_db)) -> AssetService:
    return AssetService(
        db=db,
        asset_command_repository=AssetCommandRepository(db),
        asset_query_repository=AssetQueryRepository(db),
        organization_member_query_repository=OrganizationMemberQueryRepository(db),
    )
