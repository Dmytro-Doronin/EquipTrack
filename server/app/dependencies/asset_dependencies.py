from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.permissions import (
    ASSET_CREATE,
    ASSET_DELETE,
    ASSET_READ,
    ASSET_UPDATE,
)
from app.db.database import get_db
from app.dependencies.permission_dependencies import require_permissions
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


AssetMembership = Annotated[
    OrganizationMember,
    Depends(require_permissions(ASSET_READ)),
]


AssetCreatorMembership = Annotated[
    OrganizationMember,
    Depends(require_permissions(ASSET_CREATE)),
]


AssetUpdaterMembership = Annotated[
    OrganizationMember,
    Depends(require_permissions(ASSET_UPDATE)),
]


AssetDeleterMembership = Annotated[
    OrganizationMember,
    Depends(require_permissions(ASSET_DELETE)),
]


AssetManagerMembership = AssetCreatorMembership


def get_asset_service(db: Session = Depends(get_db)) -> AssetService:
    return AssetService(
        db=db,
        asset_command_repository=AssetCommandRepository(db),
        asset_query_repository=AssetQueryRepository(db),
        organization_member_query_repository=OrganizationMemberQueryRepository(db),
    )
