from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.crud.base import CRUDBase
from app.models.case import Case
from app.schemas.case import CaseCreate, CaseUpdate

class CRUDCase(CRUDBase[Case, CaseCreate, CaseUpdate]):
    async def get_user_cases(
        self, db: AsyncSession, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Case]:
        query = select(Case)\
            .filter(Case.created_by_id == user_id)\
            .offset(skip)\
            .limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def create_with_owner(
        self, db: AsyncSession, *, obj_in: CaseCreate, user_id: int
    ) -> Case:
        db_obj = Case(**obj_in.dict(), created_by_id=user_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

case = CRUDCase(Case)