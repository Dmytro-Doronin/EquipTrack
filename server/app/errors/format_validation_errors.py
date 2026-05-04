from pydantic import ValidationError


FIELD_NAME_MAP = {
    "confirm_password": "confirmPassword",
}


def format_pydantic_errors(error: ValidationError) -> dict[str, list[str]]:
    formatted_errors: dict[str, list[str]] = {}

    for issue in error.errors():
        field = str(issue["loc"][0])
        field = FIELD_NAME_MAP.get(field, field)

        if field in formatted_errors:
            continue

        formatted_errors[field] = [issue["msg"]]

    return formatted_errors