from datetime import UTC, datetime, timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import models  # noqa: F401
from app.db.base import Base
from app.models.asset import Asset
from app.models.organization import Organization
from app.repositories.query_repositories.asset_query_repository import (
    AssetQueryRepository,
)


def make_db_session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine)

    return session_factory()


def make_asset(
    asset_id: int,
    organization_id: int,
    name: str,
    created_at: datetime,
) -> Asset:
    return Asset(
        id=asset_id,
        organization_id=organization_id,
        name=name,
        category="Laptop",
        serial_number=f"ASSET-{asset_id}",
        status="available",
        image_url=f"https://cdn.example.com/assets/{asset_id}.jpg",
        created_at=created_at,
    )


def test_find_by_organization_returns_only_assets_for_requested_organization():
    db = make_db_session()
    now = datetime(2026, 6, 10, 8, 0, tzinfo=UTC)

    db.add_all([
        Organization(id=1, name="Primary organization"),
        Organization(id=2, name="Other organization"),
        make_asset(
            asset_id=1,
            organization_id=1,
            name="Primary laptop",
            created_at=now,
        ),
        make_asset(
            asset_id=2,
            organization_id=2,
            name="Other laptop",
            created_at=now + timedelta(minutes=1),
        ),
    ])
    db.commit()

    assets = AssetQueryRepository(db).find_by_organization(organization_id=1)

    assert [asset.name for asset in assets] == ["Primary laptop"]
    assert all(asset.organization_id == 1 for asset in assets)
