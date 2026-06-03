from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.repositories.command_repositories.organization_command_repository import (
    OrganizationCommandRepository,
)
from app.repositories.command_repositories.organization_member_command_repository import (
    OrganizationMemberCommandRepository,
)
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)
from app.services.organization_service import OrganizationService


def get_organization_service(db: Session = Depends(get_db)) -> OrganizationService:
    return OrganizationService(
        db=db,
        organization_command_repository=OrganizationCommandRepository(db),
        organization_member_command_repository=OrganizationMemberCommandRepository(db),
        organization_member_query_repository=OrganizationMemberQueryRepository(db),
    )
