"""Add document analysis

Revision ID: 002
Revises: 001
Create Date: 2024-12-28

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create document_analyses table
    op.create_table(
        'document_analyses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('document_id', sa.Integer(), nullable=False),
        sa.Column('classification', sa.String(), nullable=True),
        sa.Column('summary', sa.String(), nullable=True),
        sa.Column('key_information', postgresql.JSONB(), nullable=True),
        sa.Column('citations', postgresql.JSONB(), nullable=True),
        sa.Column('metadata', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(
        op.f('ix_document_analyses_id'),
        'document_analyses',
        ['id'],
        unique=False
    )

def downgrade() -> None:
    op.drop_index(op.f('ix_document_analyses_id'), table_name='document_analyses')
    op.drop_table('document_analyses')