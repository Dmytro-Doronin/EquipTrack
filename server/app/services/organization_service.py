from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.errors.validation_error import raise_validation_error
from app.models.user import User
from app.repositories.command_repositories.organization_command_repository import (
    OrganizationCommandRepository,
)
from app.repositories.command_repositories.organization_member_command_repository import (
    OrganizationMemberCommandRepository,
)
from app.repositories.query_repositories.organization_member_query_repository import (
    OrganizationMemberQueryRepository,
)
from app.schemas.organization import (
    CreateOrganizationResultSchema,
    CreateOrganizationSchema,
    OrganizationMembershipSchema,
    OrganizationSchema,
)


class OrganizationService:
    def __init__(
        self,
        db: Session,
        organization_command_repository: OrganizationCommandRepository,
        organization_member_command_repository: OrganizationMemberCommandRepository,
        organization_member_query_repository: OrganizationMemberQueryRepository,
    ):
        self.db = db
        self.organization_command_repository = organization_command_repository
        self.organization_member_command_repository = organization_member_command_repository
        self.organization_member_query_repository = organization_member_query_repository

    def create_organization(
        self,
        current_user: User,
        data: CreateOrganizationSchema,
    ) -> CreateOrganizationResultSchema:
        active_membership = (
            self.organization_member_query_repository.find_active_by_user_id(
                current_user.id,
            )
        )

        if active_membership is not None:
            raise_validation_error({
                "organization": ["User already has an active organization"],
            })

        try:
            organization = self.organization_command_repository.create(name=data.name)
            membership = self.organization_member_command_repository.create(
                organization_id=organization.id,
                user_id=current_user.id,
                role="owner",
                status="active",
            )
            self.db.commit()
            self.db.refresh(organization)
            self.db.refresh(membership)
        except IntegrityError:
            self.db.rollback()
            raise_validation_error({
                "organization": ["Unable to create organization membership"],
            })
        except Exception:
            self.db.rollback()
            raise

        return CreateOrganizationResultSchema(
            organization=OrganizationSchema(
                id=organization.id,
                name=organization.name,
            ),
            membership=OrganizationMembershipSchema(
                role=membership.role,
                status=membership.status,
            ),
        )
