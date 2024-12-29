from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

class DocumentAnalysisBase(BaseModel):
    classification: str
    summary: str
    key_information: Dict[str, Any]
    citations: Dict[str, Any]
    metadata: Dict[str, Any]

class DocumentAnalysisCreate(DocumentAnalysisBase):
    document_id: int

class DocumentAnalysisUpdate(DocumentAnalysisBase):
    pass

class DocumentAnalysis(DocumentAnalysisBase):
    id: int
    document_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True