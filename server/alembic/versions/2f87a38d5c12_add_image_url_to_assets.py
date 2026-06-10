"""add image url to assets

Revision ID: 2f87a38d5c12
Revises: a8f41c93d2b7
Create Date: 2026-06-10 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "2f87a38d5c12"
down_revision: Union[str, Sequence[str], None] = "a8f41c93d2b7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "assets",
        sa.Column("image_url", sa.String(length=500), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("assets", "image_url")
