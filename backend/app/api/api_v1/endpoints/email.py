from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, models, schemas
from app.api import deps
from app.services.email_service import EmailService
from app.services.email_processor import EmailProcessor
from app.core.config import settings
import aiofiles
import os

router = APIRouter()

@router.post("/webhook/incoming")
async def process_incoming_email(
    *,
    background_tasks: BackgroundTasks,
    from_email: str,
    to_email: str,
    subject: str,
    body: str,
    attachments: List[UploadFile] = File(...),
) -> Any:
    """Process incoming email webhook"""
    try:
        # Save attachments to disk
        saved_attachments = []
        for attachment in attachments:
            file_location = f"uploads/{attachment.filename}"
            os.makedirs("uploads", exist_ok=True)
            
            async with aiofiles.open(file_location, 'wb') as out_file:
                content = await attachment.read()
                await out_file.write(content)
            
            saved_attachments.append({
                'filename': attachment.filename,
                'content_type': attachment.content_type,
                'path': file_location
            })
        
        # Process email
        processor = EmailProcessor()
        await processor.process_incoming_email(
            from_email=from_email,
            to_email=to_email,
            subject=subject,
            body=body,
            attachments=saved_attachments
        )
        
        return {"message": "Email processed successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing email: {str(e)}"
        )

@router.post("/case/{case_id}/send")
async def send_case_email(
    *,
    case_id: int,
    email_data: schemas.EmailSend,
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Send email related to a case"""
    # Verify case exists and user has access
    case = await crud.case.get(db=db, id=case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if not current_user.is_superuser and case.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    try:
        email_service = EmailService()
        await email_service.send_email(
            email_to=email_data.recipients,
            subject=email_data.subject,
            template_name=email_data.template,
            template_data=email_data.template_data
        )
        return {"message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error sending email: {str(e)}"
        )