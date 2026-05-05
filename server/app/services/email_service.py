class EmailService:
    def send_verification_code(
        self,
        email: str,
        code: str,
    ) -> None:
        print(f"Verification code for {email}: {code}")