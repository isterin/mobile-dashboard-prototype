"""Data models for the Mobile Market Analysis Dashboard.

Entity hierarchy:

    Indication (one per dashboard)
    ├── PatientPopulation           Layer 1: prevalence funnel
    ├── StandardOfCare              Layer 1: current treatments & limitations
    ├── UnmetNeed                   Layer 1: key clinical/commercial gaps
    │
    ├── Target                      Layer 2: biological targets / mechanisms
    │   └── CompoundTarget (M2M)    Links targets ↔ compounds
    │
    ├── Compound                    Layer 3: drugs (pipeline + marketed)
    │   ├── Trial                   Layer 4: competitor clinical trials
    │   └── MarketedDrugData        Layer 5: in-market commercial data
    │
    ├── ComparableTransaction       Layer 7: recent licensing deals / acquisitions
    ├── ThesisRisk                  Layer 7: key investment risks
    ├── GoNoGoCriterion             Layer 7: investment success conditions
    │
    └── AiAssessment                AI-generated narratives per layer

Market data (size, growth, projections, pipeline density) is stored
directly on the Indication table as JSON/scalar fields to keep the
model simple — there's one set of market data per indication.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import JSON, Column, Field, Relationship, SQLModel

# =============================================================================
# Helpers
# =============================================================================


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


# =============================================================================
# Generic response schema (not a table)
# =============================================================================


class Message(SQLModel):
    message: str


# =============================================================================
# Many-to-Many link: Compound ↔ Target
# =============================================================================


class CompoundTarget(SQLModel, table=True):
    """Join table linking compounds to their biological targets."""

    compound_id: uuid.UUID = Field(foreign_key="compound.id", primary_key=True)
    target_id: uuid.UUID = Field(foreign_key="target.id", primary_key=True)


# =============================================================================
# Layer 1 — Indication (core entity + market data)
# =============================================================================


class IndicationBase(SQLModel):
    """Fields shared across create/read schemas."""

    name: str = Field(index=True)
    icd_code: str | None = Field(default=None, max_length=20)

    # Market size & growth
    market_size_usd_bn: float | None = None
    market_growth_pct: float | None = None
    market_year: int | None = None
    market_history: list[float] = Field(default_factory=list, sa_column=Column(JSON))
    market_years: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    projected_size_usd_bn: float | None = None
    projected_year: str | None = None
    cagr_pct: str | None = None

    # Pipeline density (counts by phase)
    pipeline_phase1: int = 0
    pipeline_phase2: int = 0
    pipeline_phase3: int = 0
    pipeline_filed: int = 0
    pipeline_marketed: int = 0
    pipeline_total: int = 0


class IndicationCreate(IndicationBase):
    pass


class IndicationPublic(IndicationBase):
    id: uuid.UUID
    created_at: datetime


class Indication(IndicationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=_utcnow)

    # Relationships
    patient_populations: list["PatientPopulation"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    standards_of_care: list["StandardOfCare"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    unmet_needs: list["UnmetNeed"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    targets: list["Target"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    compounds: list["Compound"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    comparable_transactions: list["ComparableTransaction"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    thesis_risks: list["ThesisRisk"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    go_nogo_criteria: list["GoNoGoCriterion"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    ai_assessments: list["AiAssessment"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )
    expansion_indications: list["ExpansionIndication"] = Relationship(
        back_populates="indication",
        cascade_delete=True,
    )


class IndicationsPublic(SQLModel):
    data: list[IndicationPublic]
    count: int


# =============================================================================
# Layer 1 — Patient Population Funnel
# =============================================================================


class PatientPopulationBase(SQLModel):
    total_prevalence: float
    diagnosed: float
    treatable: float
    treated: float
    unit: str = "M (US+EU5)"

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class PatientPopulationCreate(PatientPopulationBase):
    pass


class PatientPopulationPublic(PatientPopulationBase):
    id: uuid.UUID


class PatientPopulation(PatientPopulationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="patient_populations")


# =============================================================================
# Layer 1 — Standard of Care
# =============================================================================


class StandardOfCareBase(SQLModel):
    name: str
    line_of_therapy: str = Field(max_length=20)
    limitation: str
    sort_order: int = 0

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class StandardOfCareCreate(StandardOfCareBase):
    pass


class StandardOfCarePublic(StandardOfCareBase):
    id: uuid.UUID


class StandardOfCare(StandardOfCareBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="standards_of_care")


# =============================================================================
# Layer 1 — Unmet Need
# =============================================================================


class UnmetNeedBase(SQLModel):
    description: str
    sort_order: int = 0

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class UnmetNeedCreate(UnmetNeedBase):
    pass


class UnmetNeedPublic(UnmetNeedBase):
    id: uuid.UUID


class UnmetNeed(UnmetNeedBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="unmet_needs")


# =============================================================================
# Layer 2 — Target / Mechanism
# =============================================================================


class TargetBase(SQLModel):
    name: str
    target_class: str
    most_advanced_phase: str
    has_marketed_drug: bool = False

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class TargetCreate(TargetBase):
    pass


class TargetPublic(TargetBase):
    id: uuid.UUID


class Target(TargetBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="targets")
    compounds: list["Compound"] = Relationship(
        back_populates="targets",
        link_model=CompoundTarget,
    )


# =============================================================================
# Layer 3 — Compound (pipeline + marketed drugs)
# =============================================================================


class CompoundBase(SQLModel):
    brand_name: str
    inn: str | None = None
    sponsor: str
    moa: str
    phase: str
    route: str | None = None
    frequency: str | None = None

    # Key efficacy data
    primary_efficacy_measure: str | None = None
    primary_efficacy_value: str | None = None
    onset_of_action: str | None = None

    # Safety
    safety_profile: str | None = None
    has_black_box_warning: bool = False

    # Regulatory
    regulatory_designations: str | None = None
    approval_year: int | None = None

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class CompoundCreate(CompoundBase):
    pass


class CompoundPublic(CompoundBase):
    id: uuid.UUID


class Compound(CompoundBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="compounds")
    targets: list[Target] = Relationship(
        back_populates="compounds",
        link_model=CompoundTarget,
    )
    trials: list["Trial"] = Relationship(
        back_populates="compound",
        cascade_delete=True,
    )
    marketed_drug_data: Optional["MarketedDrugData"] = Relationship(
        back_populates="compound",
        cascade_delete=True,
        sa_relationship_kwargs={"uselist": False},
    )


class CompoundsPublic(SQLModel):
    data: list[CompoundPublic]
    count: int


# =============================================================================
# Layer 4 — Competitor Trial
# =============================================================================


class TrialBase(SQLModel):
    trial_name: str
    phase: str
    target_enrollment: int | None = None
    current_enrollment_pct: float | None = None
    enrollment_velocity: str | None = None  # "fast", "moderate", "slow"
    status: str | None = None  # "Enrolling", "Completed", "Suspended"
    primary_completion_date: str | None = None
    primary_endpoint: str | None = None
    endpoint_timepoint: str | None = None
    comparator: str | None = None

    compound_id: uuid.UUID = Field(foreign_key="compound.id")


class TrialCreate(TrialBase):
    pass


class TrialPublic(TrialBase):
    id: uuid.UUID


class Trial(TrialBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    compound: Compound | None = Relationship(back_populates="trials")


class TrialsPublic(SQLModel):
    data: list[TrialPublic]
    count: int


# =============================================================================
# Layer 5 — On-Market Performance Data
# =============================================================================


class MarketedDrugDataBase(SQLModel):
    # Revenue history (parallel arrays, stored as JSON)
    revenue_history_m: list[float] = Field(default_factory=list, sa_column=Column(JSON))
    revenue_years: list[str] = Field(default_factory=list, sa_column=Column(JSON))

    # Market share
    market_share_pct: float | None = None
    share_change_pct: float | None = None

    # Pricing & access
    wac_price_usd: float | None = None
    formulary_access_pct: str | None = None

    # Prescription volume
    nbrx_volume: str | None = None
    nbrx_trend: str | None = None  # "up", "down", "flat"

    # Safety flags for marketed drugs
    has_post_market_safety_flag: bool = False
    safety_flag_detail: str | None = None

    compound_id: uuid.UUID = Field(foreign_key="compound.id", unique=True)


class MarketedDrugDataCreate(MarketedDrugDataBase):
    pass


class MarketedDrugDataPublic(MarketedDrugDataBase):
    id: uuid.UUID


class MarketedDrugData(MarketedDrugDataBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    compound: Compound | None = Relationship(back_populates="marketed_drug_data")


# =============================================================================
# Layer 6 — Expansion Indication
# =============================================================================


class ExpansionIndicationBase(SQLModel):
    """Potential indication expansion opportunities for a mechanism."""

    name: str
    market_size_usd_bn: float | None = None
    patient_population: str | None = None
    competitive_density: str | None = None  # "high", "medium", "low"
    validation_status: str | None = None  # "Marketed", "Phase 3", "Phase 2", etc.
    scientific_rationale: str | None = None  # "strong", "moderate", "speculative"

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class ExpansionIndicationCreate(ExpansionIndicationBase):
    pass


class ExpansionIndicationPublic(ExpansionIndicationBase):
    id: uuid.UUID


class ExpansionIndication(ExpansionIndicationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="expansion_indications")


# =============================================================================
# Layer 7 — Comparable Transaction
# =============================================================================


class ComparableTransactionBase(SQLModel):
    date: str
    transaction_type: str  # "License", "Acquisition", "Partnership"
    parties: str
    asset: str
    total_value: str | None = None
    upfront_value: str | None = None

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class ComparableTransactionCreate(ComparableTransactionBase):
    pass


class ComparableTransactionPublic(ComparableTransactionBase):
    id: uuid.UUID


class ComparableTransaction(ComparableTransactionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(
        back_populates="comparable_transactions"
    )


# =============================================================================
# Layer 7 — Thesis Risk
# =============================================================================


class ThesisRiskBase(SQLModel):
    risk: str
    detail: str
    severity: str = Field(max_length=10)  # "high", "medium", "low"
    sort_order: int = 0

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class ThesisRiskCreate(ThesisRiskBase):
    pass


class ThesisRiskPublic(ThesisRiskBase):
    id: uuid.UUID


class ThesisRisk(ThesisRiskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="thesis_risks")


# =============================================================================
# Layer 7 — Go/No-Go Criterion
# =============================================================================


class GoNoGoCriterionBase(SQLModel):
    description: str
    is_met: bool | None = None  # None = unknown, True = met, False = not met
    sort_order: int = 0

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class GoNoGoCriterionCreate(GoNoGoCriterionBase):
    pass


class GoNoGoCriterionPublic(GoNoGoCriterionBase):
    id: uuid.UUID


class GoNoGoCriterion(GoNoGoCriterionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="go_nogo_criteria")


# =============================================================================
# Cross-Layer — AI Assessment
# =============================================================================


class AiAssessmentBase(SQLModel):
    layer: int  # 1–7, corresponding to dashboard layers
    title: str | None = None
    content: str
    generated_at: datetime = Field(default_factory=_utcnow)

    indication_id: uuid.UUID = Field(foreign_key="indication.id")


class AiAssessmentCreate(AiAssessmentBase):
    pass


class AiAssessmentPublic(AiAssessmentBase):
    id: uuid.UUID


class AiAssessment(AiAssessmentBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    indication: Indication | None = Relationship(back_populates="ai_assessments")


# =============================================================================
# Composite Dashboard Response
# =============================================================================


class TargetWithCompounds(TargetPublic):
    """Target with full compound data and computed competitive metrics."""

    compounds: list[CompoundPublic] = []
    compound_count: int = 0
    crowding: str = "low"  # Computed: "high", "medium", "low"


class TrialWithCompound(TrialPublic):
    """Trial enriched with compound brand name and sponsor."""

    compound_brand_name: str
    compound_sponsor: str


class MarketedDrugWithCompound(MarketedDrugDataPublic):
    """Marketed drug data enriched with compound info."""

    compound_brand_name: str
    compound_has_black_box_warning: bool = False


class DashboardPublic(SQLModel):
    """Composite response containing all dashboard data for a single indication."""

    # Layer 1 — Indication Market Overview
    indication: IndicationPublic
    patient_populations: list[PatientPopulationPublic]
    standards_of_care: list[StandardOfCarePublic]
    unmet_needs: list[UnmetNeedPublic]

    # Layer 2 — Competitive Pipeline (targets with nested compounds)
    targets: list[TargetWithCompounds]

    # Layer 3 — Competitor Trial Tracker
    trials: list[TrialWithCompound]

    # Layer 4 — In-Market Performance
    marketed_drugs: list[MarketedDrugWithCompound]

    # Layer 5 — Expansion Opportunity
    expansion_indications: list[ExpansionIndicationPublic]

    # Layer 6 — Investment Thesis
    comparable_transactions: list[ComparableTransactionPublic]
    thesis_risks: list[ThesisRiskPublic]
    go_nogo_criteria: list[GoNoGoCriterionPublic]

    # Cross-layer — AI Assessments
    ai_assessments: list[AiAssessmentPublic]
