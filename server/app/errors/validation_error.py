from typing import NoReturn

from fastapi import HTTPException


def raise_validation_error(errors: dict[str, list[str]]) -> NoReturn:
    raise HTTPException(
        status_code=422,
        detail={
            "message": "Validation failed",
            "errors": errors,
        },
    )