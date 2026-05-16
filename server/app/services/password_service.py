import hashlib
import hmac

from pwdlib import PasswordHash

from app.core.config import settings


class PasswordService:
    def __init__(self):
        self.password_hash = PasswordHash.recommended()

    def hash_password(self, password: str) -> str:
        return self.password_hash.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.password_hash.verify(plain_password, hashed_password)

    def hash_reset_token(self, token: str) -> str:
        secret = settings.password_reset_token_secret.encode()

        return hmac.new(
            secret,
            token.encode(),
            hashlib.sha256,
        ).hexdigest()
