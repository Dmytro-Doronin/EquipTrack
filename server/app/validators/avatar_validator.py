from fastapi import UploadFile

MAX_AVATAR_SIZE = 5 * 1024 * 1024

ALLOWED_AVATAR_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


async def validate_avatar(avatar: UploadFile | None) -> str | None:
    if avatar is None:
        return None

    if avatar.content_type not in ALLOWED_AVATAR_TYPES:
        return "Only JPEG, PNG and WEBP images are allowed"

    avatar_bytes = await avatar.read()

    if len(avatar_bytes) > MAX_AVATAR_SIZE:
        await avatar.seek(0)
        return "Avatar must be less than 5MB"

    await avatar.seek(0)

    return None