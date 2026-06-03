from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.errors.app_error import raise_app_error
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
from app.repositories.query_repositories.organization_query_repository import (
    OrganizationQueryRepository,
)
from app.schemas.organization import (
    CreateOrganizationResultSchema,
    CreateOrganizationSchema,
    JoinRequestResultSchema,
    OrganizationMembershipSchema,
    OrganizationSchema,
)
from app.utils.format import format_datetime_z


class OrganizationService:
    def __init__(
        self,
        db: Session,
        organization_command_repository: OrganizationCommandRepository,
        organization_member_command_repository: OrganizationMemberCommandRepository,
        organization_member_query_repository: OrganizationMemberQueryRepository,
        organization_query_repository: OrganizationQueryRepository,
    ):
        self.db = db
        self.organization_command_repository = organization_command_repository
        self.organization_member_command_repository = organization_member_command_repository
        self.organization_member_query_repository = organization_member_query_repository
        self.organization_query_repository = organization_query_repository

    def search_organizations(self, query: str) -> list[OrganizationSchema]:
        organizations = self.organization_query_repository.search_by_name(
            query=query,
            limit=10,
        )

        return [
            OrganizationSchema(
                id=organization.id,
                name=organization.name,
            )
            for organization in organizations
        ]

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

    def create_join_request(
        self,
        current_user: User,
        organization_id: int,
    ) -> JoinRequestResultSchema:
        organization = self.organization_query_repository.find_by_id(organization_id)

        if organization is None:
            raise_app_error("Organization not found", status_code=404)

        active_membership = (
            self.organization_member_query_repository.find_active_by_user_id(
                current_user.id,
            )
        )

        if active_membership is not None:
            if active_membership.organization_id == organization.id:
                raise_validation_error({
                    "organization": [
                        "User is already an active member of this organization",
                    ],
                })

            raise_validation_error({
                "organization": ["User already has an active organization"],
            })

        pending_membership = (
            self.organization_member_query_repository.find_pending_by_user_and_organization(
                user_id=current_user.id,
                organization_id=organization.id,
            )
        )

        if pending_membership is not None:
            raise_validation_error({
                "organization": [
                    "Join request is already pending for this organization",
                ],
            })

        pending_requests = self.organization_member_query_repository.find_pending_by_user_id(
            current_user.id,
        )

        if pending_requests:
            raise_validation_error({
                "organization": ["User already has a pending organization request"],
            })

        try:
            membership = self.organization_member_command_repository.create(
                organization_id=organization.id,
                user_id=current_user.id,
                role="member",
                status="pending",
            )
            self.db.commit()
            self.db.refresh(membership)
        except IntegrityError:
            self.db.rollback()
            raise_validation_error({
                "organization": ["Unable to create join request"],
            })
        except Exception:
            self.db.rollback()
            raise

        return JoinRequestResultSchema(
            id=membership.id,
            organizationId=organization.id,
            organizationName=organization.name,
            status="pending",
            createdAt=format_datetime_z(membership.created_at),
        )
