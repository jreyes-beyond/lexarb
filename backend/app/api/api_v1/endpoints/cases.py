from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Case])
async def read_cases(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve cases."""
    if current_user.is_superuser:
        cases = await crud.case.get_multi(db, skip=skip, limit=limit)
    else:
        cases = await crud.case.get_user_cases(
            db=db, user_id=current_user.id, skip=skip, limit=limit
        )
    return cases

@router.post("/", response_model=schemas.Case)
async def create_case(
    *,
    db: AsyncSession = Depends(deps.get_db),
    case_in: schemas.CaseCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new case."""
    case = await crud.case.create_with_owner(
        db=db, obj_in=case_in, user_id=current_user.id
    )
    return case

@router.get("/{id}", response_model=schemas.Case)
async def read_case(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get case by ID."""
    case = await crud.case.get(db=db, id=id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if not current_user.is_superuser and case.created_by_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return case

@router.put("/{id}", response_model=schemas.Case)
async def update_case(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    case_in: schemas.CaseUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Update a case."""
    case = await crud.case.get(db=db, id=id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if not current_user.is_superuser and case.created_by_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    case = await crud.case.update(db=db, db_obj=case, obj_in=case_in)
    return case