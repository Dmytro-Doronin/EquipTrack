"""add oauth accounts

Revision ID: 5de402bf2fd1
Revises: 8fa49ee3c633
Create Date: 2026-05-21 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5de402bf2fd1"
down_revision: Union[str, Sequence[str], None] = "8fa49ee3c633"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        "users",
        "password_hash",
        existing_type=sa.String(length=255),
        nullable=True,
    )
    op.create_table(
        "oauth_accounts",
        sa.Column("id", sa.Integer(), sa.Identity(always=False), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("provider", sa.String(length=50), nullable=False),
        sa.Column("provider_user_id", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "provider",
            "provider_user_id",
            name="uq_oauth_accounts_provider_provider_user_id",
        ),
    )
    op.create_index(
        op.f("ix_oauth_accounts_email"),
        "oauth_accounts",
        ["email"],
        unique=False,
    )
    op.create_index(
        op.f("ix_oauth_accounts_user_id"),
        "oauth_accounts",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_oauth_accounts_user_id"), table_name="oauth_accounts")
    op.drop_index(op.f("ix_oauth_accounts_email"), table_name="oauth_accounts")
    op.drop_table("oauth_accounts")
    op.alter_column(
        "users",
        "password_hash",
        existing_type=sa.String(length=255),
        nullable=False,
    )
