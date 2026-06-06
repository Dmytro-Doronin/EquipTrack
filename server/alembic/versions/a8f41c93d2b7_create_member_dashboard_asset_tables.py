"""create member dashboard asset tables

Revision ID: a8f41c93d2b7
Revises: 7a2e1b0c9d44
Create Date: 2026-06-06 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a8f41c93d2b7"
down_revision: Union[str, Sequence[str], None] = "7a2e1b0c9d44"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "assets",
        sa.Column("id", sa.Integer(), sa.Identity(always=False), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("serial_number", sa.String(length=100), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("assigned_to_user_id", sa.Integer(), nullable=True),
        sa.Column("assigned_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint(
            "status IN ('available', 'assigned', 'maintenance', 'lost')",
            name="ck_assets_status",
        ),
        sa.ForeignKeyConstraint(
            ["assigned_to_user_id"],
            ["users.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_assets_assigned_to_user_id"),
        "assets",
        ["assigned_to_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_assets_organization_id"),
        "assets",
        ["organization_id"],
        unique=False,
    )

    op.create_table(
        "asset_transfers",
        sa.Column("id", sa.Integer(), sa.Identity(always=False), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("asset_id", sa.Integer(), nullable=False),
        sa.Column("from_user_id", sa.Integer(), nullable=True),
        sa.Column("to_user_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "status IN ('pending', 'approved', 'rejected', 'cancelled')",
            name="ck_asset_transfers_status",
        ),
        sa.ForeignKeyConstraint(
            ["asset_id"],
            ["assets.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["from_user_id"],
            ["users.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["to_user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_asset_transfers_from_user_id"),
        "asset_transfers",
        ["from_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_asset_transfers_organization_id"),
        "asset_transfers",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_asset_transfers_to_user_id"),
        "asset_transfers",
        ["to_user_id"],
        unique=False,
    )

    op.create_table(
        "activity_logs",
        sa.Column("id", sa.Integer(), sa.Identity(always=False), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("asset_id", sa.Integer(), nullable=True),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("message", sa.String(length=500), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["asset_id"],
            ["assets.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_activity_logs_organization_id"),
        "activity_logs",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_activity_logs_user_id"),
        "activity_logs",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_activity_logs_user_id"), table_name="activity_logs")
    op.drop_index(
        op.f("ix_activity_logs_organization_id"),
        table_name="activity_logs",
    )
    op.drop_table("activity_logs")

    op.drop_index(
        op.f("ix_asset_transfers_to_user_id"),
        table_name="asset_transfers",
    )
    op.drop_index(
        op.f("ix_asset_transfers_organization_id"),
        table_name="asset_transfers",
    )
    op.drop_index(
        op.f("ix_asset_transfers_from_user_id"),
        table_name="asset_transfers",
    )
    op.drop_table("asset_transfers")

    op.drop_index(op.f("ix_assets_organization_id"), table_name="assets")
    op.drop_index(op.f("ix_assets_assigned_to_user_id"), table_name="assets")
    op.drop_table("assets")
