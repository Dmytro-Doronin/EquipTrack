from typing import NoReturn

from fastapi import HTTPException


def raise_app_error(
    message: str,
    status_code: int = 400,
) -> NoReturn:
    raise HTTPException(
        status_code=status_code,
        detail={
            "message": message,
        },
    )