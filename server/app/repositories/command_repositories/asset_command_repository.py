from datetime import datetime

from sqlalchemy.orm import Session

from app.models.asset import Asset


class AssetCommandRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        organization_id: int,
        name: str,
        category: str,
        serial_number: str,
        status: str,
        assigned_to_user_id: int | None,
        assigned_at: datetime | None,
        due_date: datetime | None,
        image_url: str | None,
    ) -> Asset:
        asset = Asset(
            organization_id=organization_id,
            name=name,
            category=category,
            serial_number=serial_number,
            status=status,
            assigned_to_user_id=assigned_to_user_id,
            assigned_at=assigned_at,
            due_date=due_date,
            image_url=image_url,
        )

        self.db.add(asset)
        self.db.flush()
        self.db.refresh(asset)

        return asset

    def update(self, asset: Asset, values: dict[str, object]) -> Asset:
        for field, value in values.items():
            setattr(asset, field, value)

        self.db.flush()
        self.db.refresh(asset)

        return asset
