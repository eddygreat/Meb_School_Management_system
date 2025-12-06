"""add is_active to users

Revision ID: e4b2f5cd2d3e
Revises: d3a1f4db1c2a
Create Date: 2025-12-06 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4b2f5cd2d3e'
down_revision: Union[str, None] = 'd3a1f4db1c2a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Check if column exists to avoid DuplicateColumn error (idempotency)
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = [c['name'] for c in inspector.get_columns('users')]
    if 'is_active' not in columns:
        op.add_column('users', sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False))


def downgrade() -> None:
    op.drop_column('users', 'is_active')
