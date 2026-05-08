from uuid import uuid4

import boto3
from fastapi import UploadFile

from app.core.config import settings


class S3StorageService:
    def __init__(self):
        self.client = boto3.client(
            "s3",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )

    async def upload_avatar(self, avatar: UploadFile | None) -> str | None:
        if avatar is None:
            return None

        file_extension = self._get_file_extension(avatar.filename)
        file_key = f"avatars/{uuid4()}{file_extension}"

        await avatar.seek(0)

        self.client.upload_fileobj(
            avatar.file,
            settings.aws_s3_bucket_name,
            file_key,
            ExtraArgs={
                "ContentType": avatar.content_type or "application/octet-stream",
            },
        )

        return f"{settings.aws_s3_public_url}/{file_key}"

    def _get_file_extension(self, filename: str | None) -> str:
        if filename is None:
            return ""

        if "." not in filename:
            return ""

        return f".{filename.rsplit('.', 1)[1].lower()}"