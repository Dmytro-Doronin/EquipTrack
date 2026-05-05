from email.message import EmailMessage

import aiosmtplib

from app.core.config import settings


class EmailService:
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str | None = None,
    ) -> None:
        message = EmailMessage()

        message["From"] = settings.mail_from
        message["To"] = to_email
        message["Subject"] = subject

        if text_content is not None:
            message.set_content(text_content)
            message.add_alternative(html_content, subtype="html")
        else:
            message.set_content(html_content, subtype="html")

        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=587,
            username=settings.mail_username,
            password=settings.mail_password,
            start_tls=True,
            use_tls=False,
        )

    async def send_verification_code(
        self,
        email: str,
        code: str,
    ) -> None:
        await self.send_email(
            to_email=email,
            subject="Your EquipTrack verification code",
            text_content=f"Your EquipTrack verification code is: {code}",
            html_content=f"""
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>EquipTrack email verification</h2>

                    <p>Your verification code is:</p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 6px;
                        margin: 24px 0;
                    ">
                        {code}
                    </div>

                    <p>This code will expire in 10 minutes.</p>

                    <p>If you did not request this code, you can ignore this email.</p>
                </div>
            """,
        )