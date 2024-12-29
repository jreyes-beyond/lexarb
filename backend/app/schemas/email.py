from typing import List, Dict, Optional
from pydantic import BaseModel, EmailStr

class EmailSend(BaseModel):
    recipients: List[EmailStr]
    subject: str
    template: str
    template_data: Dict
    attachments: Optional[List[Dict]] = None

class EmailWebhook(BaseModel):
    from_email: EmailStr
    to_email: EmailStr
    subject: str
    body: str
    attachments: Optional[List[Dict]] = None