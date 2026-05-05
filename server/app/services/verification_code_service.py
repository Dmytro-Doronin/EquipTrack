import secrets


class VerificationCodeService:
    def generate_code(self) -> str:
        return f"{secrets.randbelow(1_000_000):06d}"