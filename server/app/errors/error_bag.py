def add_error(
    errors: dict[str, list[str]],
    field: str,
    message: str,
) -> None:
    if field in errors:
        return

    errors[field] = [message]