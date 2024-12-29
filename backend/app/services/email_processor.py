import json
from typing import Dict, List
import aioredis
from fastapi import BackgroundTasks
from app.core.config import settings
from app.crud import case, document
from app.schemas.document import DocumentCreate

class EmailProcessor:
    def __init__(self):
        self.redis = aioredis.from_url(settings.REDIS_URL)
    
    async def process_incoming_email(
        self,
        from_email: str,
        to_email: str,
        subject: str,
        body: str,
        attachments: List[Dict]
    ):
        """Process incoming email and associate with case"""
        # Get case ID from email address
        case_id = await self.redis.get(f"email_case:{to_email}")
        if not case_id:
            raise ValueError(f"No case found for email: {to_email}")
        
        # Store email in Redis queue for processing
        await self.redis.lpush(
            "incoming_emails",
            json.dumps({
                "case_id": int(case_id),
                "from_email": from_email,
                "subject": subject,
                "body": body,
                "attachments": attachments
            })
        )
    
    async def process_email_queue(self, background_tasks: BackgroundTasks):
        """Process emails in the queue"""
        while True:
            # Get email from queue
            email_data = await self.redis.rpop("incoming_emails")
            if not email_data:
                break
            
            data = json.loads(email_data)
            background_tasks.add_task(
                self.process_single_email,
                data
            )
    
    async def process_single_email(self, data: Dict):
        """Process a single email"""
        # Create document for email body
        email_doc = DocumentCreate(
            title=f"Email: {data['subject']}",
            content_type="email",
            status="processed",
            case_id=data['case_id'],
            body=data['body']
        )
        
        # Process attachments
        for attachment in data.get('attachments', []):
            doc = DocumentCreate(
                title=attachment['filename'],
                content_type=attachment['content_type'],
                status="processed",
                case_id=data['case_id'],
                file_path=attachment['path']
            )
            # Create document record
            await document.create(db=None, obj_in=doc)  # Need to add proper db session handling