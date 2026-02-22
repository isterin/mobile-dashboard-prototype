"""API routes for Indication resources."""

import uuid

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.api.deps import SessionDep
from app.models import Indication, IndicationPublic, IndicationsPublic

router = APIRouter(prefix="/indications", tags=["indications"])


@router.get("/", response_model=IndicationsPublic)
def list_indications(session: SessionDep) -> IndicationsPublic:
    """List all indications.

    Returns:
        All indications with their count.
    """
    statement = select(Indication).order_by(Indication.name)
    indications = session.exec(statement).all()
    return IndicationsPublic(
        data=[IndicationPublic.model_validate(i) for i in indications],
        count=len(indications),
    )


@router.get("/{indication_id}", response_model=IndicationPublic)
def get_indication(session: SessionDep, indication_id: uuid.UUID) -> IndicationPublic:
    """Get a single indication by ID.

    Args:
        session: Database session.
        indication_id: UUID of the indication.

    Returns:
        The indication details.
    """
    indication = session.get(Indication, indication_id)
    if not indication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Indication not found",
        )
    return IndicationPublic.model_validate(indication)
