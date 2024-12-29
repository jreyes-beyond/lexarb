from typing import List, Optional
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, PackageLoader
from pydantic import EmailStr
from app.core.config import settings
import aioredis
import json

# Configure email templates
env = Environment(
    loader=PackageLoader('app', 'templates/email')
)

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER,
    MAIL_PASSWORD=settings.SMTP_PASSWORD,
    MAIL_FROM=settings.EMAIL_FROM,
    MAIL_FROM_NAME=settings.EMAIL_FROM_NAME,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER='app/templates/email'
)

class EmailService:
    def __init__(self):
        self.mail = FastMail(conf)
        self.redis = aioredis.from_url(settings.REDIS_URL)
    
    async def send_email(
        self,
        email_to: List[EmailStr],
        subject: str,
        template_name: str,
        template_data: dict,
        attachments: Optional[List[dict]] = None
    ):
        """Send email using template"""
        template = env.get_template(f"{template_name}.html")
        html = template.render(**template_data)
        
        message = MessageSchema(
            subject=subject,
            recipients=email_to,
            body=html,
            subtype="html"
        )
        
        await self.mail.send_message(message)
        
        # Log email in Redis for tracking
        await self.redis.lpush(
            "email_log",
            json.dumps({
                "to": email_to,
                "subject": subject,
                "template": template_name,
                "data": template_data
            })
        )
    
    async def generate_case_email(
        self,
        case_id: int
    ) -> str:
        """Generate unique email address for a case"""
        case_email = f"case-{case_id}@{settings.EMAIL_FROM.split('@')[1]}"
        
        # Store case email mapping in Redis
        await self.redis.set(
            f"case_email:{case_id}",
            case_email
        )
        await self.redis.set(
            f"email_case:{case_email}",
            str(case_id)
        )
        
        return case_email