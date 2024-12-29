from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import os
import uuid

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=List[schemas.Document])
async def read_documents(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve documents."""
    if current_user.is_superuser:
        documents = await crud.document.get_multi(db, skip=skip, limit=limit)
    else:
        # TODO: Implement get_user_documents
        documents = []
    return documents

@router.post("/upload/{case_id}", response_model=schemas.Document)
async def create_document(
    *,
    db: AsyncSession = Depends(deps.get_db),
    case_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Upload a new document."""
    case = await crud.case.get(db=db, id=case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_location = os.path.join("uploads", unique_filename)
    
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Save file
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    
    # Create document record
    document_in = schemas.DocumentCreate(
        title=file.filename,
        file_path=file_location,
        content_type=file.content_type,
        status="uploaded",
        case_id=case_id
    )
    document = await crud.document.create_with_owner(
        db=db, obj_in=document_in, user_id=current_user.id
    )
    return document

@router.get("/{id}", response_model=schemas.Document)
async def read_document(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get document by ID."""
    document = await crud.document.get(db=db, id=id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document