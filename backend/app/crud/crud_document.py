from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.crud.base import CRUDBase
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    async def get_case_documents(
        self, db: AsyncSession, *, case_id: int, skip: int = 0, limit: int = 100
    ) -> List[Document]:
        query = select(Document)\
            .filter(Document.case_id == case_id)\
            .offset(skip)\
            .limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def create_with_owner(
        self, db: AsyncSession, *, obj_in: DocumentCreate, user_id: int
    ) -> Document:
        db_obj = Document(**obj_in.dict(), uploaded_by_id=user_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

document = CRUDDocument(Document)