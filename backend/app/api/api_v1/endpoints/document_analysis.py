from typing import Any
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, models, schemas
from app.api import deps
from app.services.ai.document_processor import DocumentProcessor

router = APIRouter()

@router.post("/documents/{document_id}/analyze", response_model=schemas.DocumentAnalysis)
async def analyze_document(
    *,
    db: AsyncSession = Depends(deps.get_db),
    document_id: int,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Analyze a document using AI"""
    # Get document
    document = await crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check permissions
    case = await crud.case.get(db=db, id=document.case_id)
    if not current_user.is_superuser and case.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    try:
        # Initialize document processor
        processor = DocumentProcessor()
        
        # Process document in background
        background_tasks.add_task(
            process_document_background,
            processor=processor,
            document=document,
            db=db
        )
        
        return {"message": "Document analysis started"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error starting document analysis: {str(e)}"
        )

@router.get("/documents/{document_id}/analysis", response_model=schemas.DocumentAnalysis)
async def get_document_analysis(
    *,
    db: AsyncSession = Depends(deps.get_db),
    document_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get document analysis results"""
    # Get document
    document = await crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check permissions
    case = await crud.case.get(db=db, id=document.case_id)
    if not current_user.is_superuser and case.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Get analysis
    analysis = await crud.document_analysis.get_by_document(
        db=db,
        document_id=document_id
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis

async def process_document_background(
    processor: DocumentProcessor,
    document: models.Document,
    db: AsyncSession
):
    """Process document in background"""
    try:
        # Process document
        analysis_result = await processor.process_document(
            file_path=document.file_path,
            metadata={
                "case_id": document.case_id,
                "document_id": document.id,
                "title": document.title,
                "content_type": document.content_type
            }
        )
        
        # Create analysis record
        analysis_data = schemas.DocumentAnalysisCreate(
            document_id=document.id,
            classification=analysis_result["analysis"]["classification"],
            summary=analysis_result["analysis"]["summary"],
            key_information=analysis_result["analysis"]["key_information"],
            citations=analysis_result["analysis"]["citations"],
            metadata=analysis_result["metadata"]
        )
        
        await crud.document_analysis.create(db=db, obj_in=analysis_data)
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        # TODO: Add proper error handling and notification