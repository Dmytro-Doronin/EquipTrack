from pydantic import ValidationError


FIELD_NAME_MAP = {
    "confirm_password": "confirmPassword",
    "__root__": "form",
}


def format_pydantic_errors(error: ValidationError) -> dict[str, list[str]]:
    formatted_errors: dict[str, list[str]] = {}

    for issue in error.errors():
        location = issue["loc"]
        field = str(location[0]) if location else "form"
        field = FIELD_NAME_MAP.get(field, field)

        if field in formatted_errors:
            continue

        formatted_errors[field] = [issue["msg"]]

    return formatted_errors
