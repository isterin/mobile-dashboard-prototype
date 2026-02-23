"""API route for the composite dashboard endpoint.

Returns all data for a single indication across all 6 layers in one call.
"""

import uuid

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.api.deps import SessionDep
from app.models import (
    AiAssessmentPublic,
    ComparableTransactionPublic,
    Compound,
    CompoundPublic,
    DashboardPublic,
    ExpansionIndicationPublic,
    GoNoGoCriterionPublic,
    Indication,
    IndicationPublic,
    MarketedDrugData,
    MarketedDrugDataPublic,
    MarketedDrugWithCompound,
    PatientPopulationPublic,
    StandardOfCarePublic,
    Target,
    TargetPublic,
    TargetWithCompounds,
    ThesisRiskPublic,
    Trial,
    TrialPublic,
    TrialWithCompound,
    UnmetNeedPublic,
)

router = APIRouter(prefix="/indications", tags=["indications"])


@router.get("/{indication_id}/dashboard/", response_model=DashboardPublic)
def get_dashboard(session: SessionDep, indication_id: uuid.UUID) -> DashboardPublic:
    """Get the full competitive intelligence dashboard for an indication.

    Loads all data across all 6 layers in a single request to avoid
    waterfall requests from the frontend.

    Args:
        session: Database session.
        indication_id: UUID of the indication.

    Returns:
        Composite dashboard data spanning all layers.
    """
    indication = session.get(Indication, indication_id)
    if not indication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Indication not found",
        )

    # Layer 1 — Market overview data is on the Indication itself
    patient_populations = [
        PatientPopulationPublic.model_validate(pp)
        for pp in indication.patient_populations
    ]
    standards_of_care = sorted(
        [
            StandardOfCarePublic.model_validate(soc)
            for soc in indication.standards_of_care
        ],
        key=lambda s: s.sort_order,
    )
    unmet_needs = sorted(
        [UnmetNeedPublic.model_validate(un) for un in indication.unmet_needs],
        key=lambda u: u.sort_order,
    )

    # Layer 2 — Competitive Pipeline (targets with nested compounds)
    targets_raw = session.exec(
        select(Target).where(Target.indication_id == indication_id)
    ).all()
    targets_raw = sorted(targets_raw, key=lambda t: t.compound_count, reverse=True)

    targets: list[TargetWithCompounds] = []
    for t in targets_raw:
        compounds = [CompoundPublic.model_validate(c) for c in t.compounds]
        base = TargetPublic.model_validate(t).model_dump()
        targets.append(TargetWithCompounds(**base, compounds=compounds))

    # Layer 3 — Trials (flattened with compound info)
    trials_raw = session.exec(
        select(Trial).join(Compound).where(Compound.indication_id == indication_id)
    ).all()
    trials: list[TrialWithCompound] = []
    for tr in trials_raw:
        compound = tr.compound
        base = TrialPublic.model_validate(tr).model_dump()
        trials.append(
            TrialWithCompound(
                **base,
                compound_brand_name=compound.brand_name if compound else "",
                compound_sponsor=compound.sponsor if compound else "",
            )
        )

    # Layer 4 — In-market drug data (joined with compound info)
    marketed_raw = session.exec(
        select(MarketedDrugData)
        .join(Compound)
        .where(Compound.indication_id == indication_id)
    ).all()
    marketed_drugs: list[MarketedDrugWithCompound] = []
    for md in marketed_raw:
        compound = md.compound
        base = MarketedDrugDataPublic.model_validate(md).model_dump()
        marketed_drugs.append(
            MarketedDrugWithCompound(
                **base,
                compound_brand_name=(compound.brand_name if compound else ""),
                compound_has_black_box_warning=(
                    compound.has_black_box_warning if compound else False
                ),
            )
        )

    # Layer 5 — Expansion indications
    expansion_indications = [
        ExpansionIndicationPublic.model_validate(ei)
        for ei in indication.expansion_indications
    ]

    # Layer 6 — Thesis data
    comparable_transactions = [
        ComparableTransactionPublic.model_validate(ct)
        for ct in indication.comparable_transactions
    ]
    thesis_risks = sorted(
        [ThesisRiskPublic.model_validate(tr) for tr in indication.thesis_risks],
        key=lambda r: r.sort_order,
    )
    go_nogo_criteria = sorted(
        [GoNoGoCriterionPublic.model_validate(g) for g in indication.go_nogo_criteria],
        key=lambda g: g.sort_order,
    )

    # AI Assessments
    ai_assessments = [
        AiAssessmentPublic.model_validate(a) for a in indication.ai_assessments
    ]

    return DashboardPublic(
        indication=IndicationPublic.model_validate(indication),
        patient_populations=patient_populations,
        standards_of_care=standards_of_care,
        unmet_needs=unmet_needs,
        targets=targets,
        trials=trials,
        marketed_drugs=marketed_drugs,
        expansion_indications=expansion_indications,
        comparable_transactions=comparable_transactions,
        thesis_risks=thesis_risks,
        go_nogo_criteria=go_nogo_criteria,
        ai_assessments=ai_assessments,
    )
