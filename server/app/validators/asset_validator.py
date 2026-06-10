from typing import Any, TypeVar

from fastapi import Body
from pydantic import ValidationError

from app.errors.format_validation_errors import format_pydantic_errors
from app.errors.validation_error import raise_validation_error
from app.schemas.asset import AssetCreateSchema, AssetUpdateSchema

TEXT_FIELD_LABELS = {
    "category": "Category",
    "name": "Asset name",
    "serialNumber": "Serial number",
}

TEXT_FIELD_LIMITS = {
    "category": 100,
    "imageUrl": 500,
    "name": 100,
    "serialNumber": 100,
}

CREATE_REQUIRED_TEXT_FIELDS = ("name", "category", "serialNumber")

AssetPayloadSchema = TypeVar(
    "AssetPayloadSchema",
    AssetCreateSchema,
    AssetUpdateSchema,
)


async def validate_create_asset_body(
    payload: Any = Body(default=None),
) -> AssetCreateSchema:
    normalized_payload = _normalize_payload(payload, CREATE_REQUIRED_TEXT_FIELDS)

    return _build_schema(AssetCreateSchema, normalized_payload)


async def validate_update_asset_body(
    payload: Any = Body(default=None),
) -> AssetUpdateSchema:
    normalized_payload = _normalize_payload(payload, ())

    return _build_schema(AssetUpdateSchema, normalized_payload)


def _normalize_payload(
    payload: Any,
    required_text_fields: tuple[str, ...],
) -> dict[str, Any]:
    if not isinstance(payload, dict):
        if required_text_fields:
            raise_validation_error({
                field: [f"{TEXT_FIELD_LABELS[field]} is required"]
                for field in required_text_fields
            })

        raise_validation_error({
            "asset": ["Asset payload is required"],
        })

    normalized_payload = dict(payload)
    errors: dict[str, list[str]] = {}

    for field in required_text_fields:
        _normalize_required_text_field(
            payload=normalized_payload,
            errors=errors,
            field=field,
        )

    for field in TEXT_FIELD_LABELS:
        if field not in required_text_fields and field in normalized_payload:
            _normalize_optional_text_field(
                payload=normalized_payload,
                errors=errors,
                field=field,
            )

    if "imageUrl" in normalized_payload:
        _normalize_optional_url_field(normalized_payload, errors)

    if errors:
        raise_validation_error(errors)

    return normalized_payload


def _normalize_required_text_field(
    payload: dict[str, Any],
    errors: dict[str, list[str]],
    field: str,
) -> None:
    value = payload.get(field)
    label = TEXT_FIELD_LABELS[field]

    if not isinstance(value, str):
        errors[field] = [f"{label} is required"]
        return

    normalized_value = value.strip()

    if not normalized_value:
        errors[field] = [f"{label} is required"]
        return

    _set_text_value(payload, errors, field, normalized_value)


def _normalize_optional_text_field(
    payload: dict[str, Any],
    errors: dict[str, list[str]],
    field: str,
) -> None:
    value = payload.get(field)

    if value is None:
        return

    if not isinstance(value, str):
        return

    normalized_value = value.strip()

    if not normalized_value:
        errors[field] = [f"{TEXT_FIELD_LABELS[field]} is required"]
        return

    _set_text_value(payload, errors, field, normalized_value)


def _normalize_optional_url_field(
    payload: dict[str, Any],
    errors: dict[str, list[str]],
) -> None:
    value = payload.get("imageUrl")

    if value is None:
        return

    if not isinstance(value, str):
        return

    normalized_value = value.strip()

    if not normalized_value:
        payload["imageUrl"] = None
        return

    _set_text_value(payload, errors, "imageUrl", normalized_value)


def _set_text_value(
    payload: dict[str, Any],
    errors: dict[str, list[str]],
    field: str,
    value: str,
) -> None:
    max_length = TEXT_FIELD_LIMITS[field]

    if len(value) > max_length:
        label = TEXT_FIELD_LABELS.get(field, "Image URL")
        errors[field] = [f"{label} must be {max_length} characters or less"]
        return

    payload[field] = value


def _build_schema(
    schema: type[AssetPayloadSchema],
    payload: dict[str, Any],
) -> AssetPayloadSchema:
    try:
        return schema(**payload)
    except ValidationError as error:
        raise_validation_error(
            format_pydantic_errors(error),
        )
