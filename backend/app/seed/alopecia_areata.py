"""Seed data for Alopecia Areata indication.

Archetype: Smaller niche with clear mechanism winner (JAK), less
competition, room for safety-differentiated entrants.
"""

from sqlmodel import Session

from app.models import (
    AiAssessment,
    ComparableTransaction,
    Compound,
    CompoundTarget,
    ExpansionIndication,
    GoNoGoCriterion,
    Indication,
    MarketedDrugData,
    PatientPopulation,
    StandardOfCare,
    Target,
    ThesisRisk,
    Trial,
    UnmetNeed,
)


def seed_alopecia_areata(session: Session) -> None:
    """Create all seed data for the Alopecia Areata indication."""

    # ── Indication ───────────────────────────────────────────────────────
    indication = Indication(
        name="Alopecia Areata",
        icd_code="L63",
        market_size_usd_bn=1.8,
        market_growth_pct=32.5,
        market_year=2024,
        market_history=[0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.5, 1.1, 1.8],
        market_years=[
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
            "2024",
        ],
        projected_size_usd_bn=5.2,
        projected_year="2030",
        cagr_pct="19.3%",
        pipeline_phase1=5,
        pipeline_phase2=6,
        pipeline_phase3=3,
        pipeline_filed=0,
        pipeline_marketed=2,
        pipeline_total=16,
    )
    session.add(indication)
    session.flush()

    # ── Patient Population ───────────────────────────────────────────────
    session.add(
        PatientPopulation(
            total_prevalence=6.7,
            diagnosed=4.5,
            treatable=2.1,
            treated=0.4,
            unit="M (US+EU5)",
            indication_id=indication.id,
        )
    )

    # ── Standard of Care ─────────────────────────────────────────────────
    for i, soc in enumerate(
        [
            (
                "Topical/intralesional corticosteroids",
                "1L",
                "Only effective for limited patches; not for severe/total AA",
            ),
            (
                "Olumiant (baricitinib)",
                "2L",
                "First approved systemic; BB warning limits adoption, "
                "moderate efficacy (~35% SALT50)",
            ),
            (
                "Litfulo (ritlecitinib)",
                "2L",
                "Second approved; oral JAK3/TEC inhibitor, no BB warning "
                "but limited long-term data",
            ),
        ]
    ):
        session.add(
            StandardOfCare(
                name=soc[0],
                line_of_therapy=soc[1],
                limitation=soc[2],
                sort_order=i,
                indication_id=indication.id,
            )
        )

    # ── Unmet Needs ──────────────────────────────────────────────────────
    for i, need in enumerate(
        [
            "Systemic therapy with durable regrowth (>80% scalp coverage) "
            "and clean safety profile",
            "Treatment for alopecia totalis/universalis "
            "(complete hair loss) — current approvals have low response",
            "Therapies that prevent relapse after discontinuation",
            "Options for pediatric patients (<12 years) — limited approved therapies",
        ]
    ):
        session.add(
            UnmetNeed(
                description=need,
                sort_order=i,
                indication_id=indication.id,
            )
        )

    # ── Targets ──────────────────────────────────────────────────────────
    targets_data = [
        ("JAK1/JAK2", "Kinase", "Marketed", True, "high", 3),
        ("JAK3/TEC", "Kinase", "Marketed", True, "medium", 2),
        ("JAK1", "Kinase", "Phase 3", False, "medium", 2),
        ("IL-15", "Cytokine", "Phase 2", False, "low", 2),
        ("IL-17A", "Cytokine", "Phase 2", False, "low", 1),
        ("Deuruxolitinib (TYK2/JAK1)", "Kinase", "Phase 3", False, "medium", 1),
        ("Oral CGRP", "Neuropeptide", "Phase 1", False, "low", 1),
    ]
    targets = {}
    for td in targets_data:
        t = Target(
            name=td[0],
            target_class=td[1],
            most_advanced_phase=td[2],
            has_marketed_drug=td[3],
            crowding=td[4],
            compound_count=td[5],
            indication_id=indication.id,
        )
        session.add(t)
        session.flush()
        targets[td[0]] = t

    # ── Compounds ────────────────────────────────────────────────────────
    compounds_data = [
        {
            "brand_name": "Olumiant",
            "inn": "Baricitinib",
            "sponsor": "Lilly",
            "moa": "JAK1/2 inhibitor",
            "phase": "Marketed",
            "route": "Oral",
            "primary_efficacy_measure": "SALT50",
            "primary_efficacy_value": "~35% (wk36)",
            "onset_of_action": "~12–16 weeks",
            "safety_profile": "BB warning: CV, malignancy, thrombosis",
            "has_black_box_warning": True,
            "regulatory_designations": "—",
            "approval_year": 2022,
            "target_names": ["JAK1/JAK2"],
        },
        {
            "brand_name": "Litfulo",
            "inn": "Ritlecitinib",
            "sponsor": "Pfizer",
            "moa": "JAK3/TEC family inhibitor",
            "phase": "Marketed",
            "route": "Oral",
            "primary_efficacy_measure": "SALT20",
            "primary_efficacy_value": "~50% (wk24)",
            "onset_of_action": "~12 weeks",
            "safety_profile": "Headache, URI, acne; no BB warning",
            "has_black_box_warning": False,
            "regulatory_designations": "Priority Review",
            "approval_year": 2023,
            "target_names": ["JAK3/TEC"],
        },
        {
            "brand_name": "Deuruxolitinib",
            "inn": "Deuruxolitinib",
            "sponsor": "Sun Pharma (ex-Concert)",
            "moa": "TYK2/JAK1 inhibitor",
            "phase": "Phase 3",
            "route": "Oral",
            "primary_efficacy_measure": "SALT50",
            "primary_efficacy_value": "~42% (Ph2)",
            "onset_of_action": "~12 weeks",
            "safety_profile": "Acne, headache; no BB warning in Ph2",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["Deuruxolitinib (TYK2/JAK1)"],
        },
        {
            "brand_name": "Brepocitinib",
            "inn": "Brepocitinib",
            "sponsor": "Pfizer",
            "moa": "TYK2/JAK1 inhibitor",
            "phase": "Phase 3",
            "route": "Oral",
            "primary_efficacy_measure": "SALT50",
            "primary_efficacy_value": "~48% (Ph2b)",
            "onset_of_action": "~12 weeks",
            "safety_profile": "Herpes zoster, headache; monitoring ongoing",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["JAK1"],
        },
        {
            "brand_name": "CTP-543",
            "inn": "Ruxolitinib (oral)",
            "sponsor": "Sun Pharma (ex-Concert)",
            "moa": "JAK1/2 inhibitor",
            "phase": "Phase 3",
            "route": "Oral",
            "primary_efficacy_measure": "SALT50",
            "primary_efficacy_value": "~45% (Ph2)",
            "onset_of_action": "~24 weeks",
            "safety_profile": "Similar to JAK1/2 class; BB warning expected",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["JAK1/JAK2"],
        },
        {
            "brand_name": "LEO 77871",
            "inn": "LEO 77871",
            "sponsor": "LEO Pharma",
            "moa": "IL-15 mAb",
            "phase": "Phase 2",
            "route": "SC injection",
            "primary_efficacy_measure": "SALT50",
            "primary_efficacy_value": "Data pending",
            "onset_of_action": "TBD",
            "safety_profile": "Data pending",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["IL-15"],
        },
        {
            "brand_name": "ATI-2138",
            "inn": "ATI-2138",
            "sponsor": "Aclaris Therapeutics",
            "moa": "JAK3/TEC inhibitor",
            "phase": "Phase 2",
            "route": "Oral",
            "primary_efficacy_measure": "SALT50",
            "primary_efficacy_value": "Data emerging",
            "onset_of_action": "~12 weeks",
            "safety_profile": "Phase 1 well tolerated",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["JAK3/TEC"],
        },
    ]

    compounds = {}
    for cd in compounds_data:
        target_names = cd.pop("target_names")
        c = Compound(**cd, indication_id=indication.id)
        session.add(c)
        session.flush()
        compounds[cd["brand_name"]] = c
        for tn in target_names:
            if tn in targets:
                session.add(
                    CompoundTarget(
                        compound_id=c.id,
                        target_id=targets[tn].id,
                    )
                )

    # ── Trials ───────────────────────────────────────────────────────────
    trials_data = [
        (
            "Deuruxolitinib",
            "THRIVE-AA3",
            "Phase 3",
            500,
            68,
            "fast",
            "Enrolling",
            "Q2 2027",
            "SALT50 wk24",
            "Placebo",
        ),
        (
            "Brepocitinib",
            "BRAVE-AA3",
            "Phase 3",
            600,
            45,
            "moderate",
            "Enrolling",
            "Q4 2027",
            "SALT50 wk24",
            "Placebo",
        ),
        (
            "CTP-543",
            "RESTORE-1",
            "Phase 3",
            400,
            82,
            "fast",
            "Enrolling",
            "Q1 2027",
            "SALT50 wk24",
            "Placebo",
        ),
        (
            "LEO 77871",
            "LEO-AA-201",
            "Phase 2",
            200,
            35,
            "moderate",
            "Enrolling",
            "Q3 2027",
            "SALT30 wk24",
            "Placebo",
        ),
        (
            "ATI-2138",
            "ACLA-AA-201",
            "Phase 2",
            150,
            55,
            "moderate",
            "Enrolling",
            "Q1 2028",
            "SALT50 wk24",
            "Placebo",
        ),
    ]
    for td in trials_data:
        if td[0] in compounds:
            session.add(
                Trial(
                    trial_name=td[1],
                    phase=td[2],
                    target_enrollment=td[3],
                    current_enrollment_pct=td[4],
                    enrollment_velocity=td[5],
                    status=td[6],
                    primary_completion_date=td[7],
                    primary_endpoint=td[8],
                    comparator=td[9],
                    compound_id=compounds[td[0]].id,
                )
            )

    # ── Marketed Drug Data ───────────────────────────────────────────────
    marketed_data = [
        (
            "Olumiant",
            [0, 0, 0, 0, 0, 0, 120, 310, 520],
            ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
            48,
            -6.2,
            58000,
            "68%",
            "5.2K/mo",
            "flat",
            True,
            "BB Warning — primary barrier to broader adoption",
        ),
        (
            "Litfulo",
            [0, 0, 0, 0, 0, 0, 0, 280, 680],
            ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
            42,
            18.5,
            49000,
            "62%",
            "6.8K/mo",
            "up",
            False,
            None,
        ),
    ]
    for md in marketed_data:
        if md[0] in compounds:
            session.add(
                MarketedDrugData(
                    revenue_history_m=md[1],
                    revenue_years=md[2],
                    market_share_pct=md[3],
                    share_change_pct=md[4],
                    wac_price_usd=md[5],
                    formulary_access_pct=md[6],
                    nbrx_volume=md[7],
                    nbrx_trend=md[8],
                    has_post_market_safety_flag=md[9],
                    safety_flag_detail=md[10],
                    compound_id=compounds[md[0]].id,
                )
            )

    # ── Expansion Indications ────────────────────────────────────────────
    for exp in [
        ("Vitiligo", 1.5, "65M globally", "medium", "Phase 3", "strong"),
        ("Atopic Dermatitis", 14.8, "223M globally", "high", "Marketed", "strong"),
        (
            "Androgenetic Alopecia",
            3.8,
            "150M globally",
            "low",
            "Phase 1",
            "speculative",
        ),
    ]:
        session.add(
            ExpansionIndication(
                name=exp[0],
                market_size_usd_bn=exp[1],
                patient_population=exp[2],
                competitive_density=exp[3],
                validation_status=exp[4],
                scientific_rationale=exp[5],
                indication_id=indication.id,
            )
        )

    # ── Comparable Transactions ──────────────────────────────────────────
    for deal in [
        (
            "2024",
            "License",
            "Sun Pharma ← Concert (CTP-543)",
            "Oral ruxolitinib for AA",
            "$700M total",
            "$250M",
        ),
        (
            "2023",
            "Partnership",
            "Pfizer + Arcus (brepocitinib AA)",
            "TYK2/JAK1 co-development",
            "$500M+ milestones",
            "$75M",
        ),
        (
            "2023",
            "Acquisition",
            "LEO Pharma ← Aditx",
            "IL-15 program for autoimmune alopecia",
            "$180M",
            "$180M",
        ),
    ]:
        session.add(
            ComparableTransaction(
                date=deal[0],
                transaction_type=deal[1],
                parties=deal[2],
                asset=deal[3],
                total_value=deal[4],
                upfront_value=deal[5],
                indication_id=indication.id,
            )
        )

    # ── Thesis Risks ─────────────────────────────────────────────────────
    for i, risk in enumerate(
        [
            (
                "JAK class BB warning overhang",
                "All JAK1/2 inhibitors carry BB warnings — limits first-line "
                "positioning and formulary access for any new JAK entrant",
                "high",
            ),
            (
                "Limited market ceiling",
                "Total addressable market (~$5B by 2030) is smaller than "
                "other dermatology indications — may not support blockbuster "
                "returns for late entrants",
                "medium",
            ),
            (
                "Relapse after discontinuation",
                "Hair loss recurs in ~80% of patients within 6 months of "
                "stopping JAK therapy — creates durability concern for "
                "all current mechanisms",
                "medium",
            ),
        ]
    ):
        session.add(
            ThesisRisk(
                risk=risk[0],
                detail=risk[1],
                severity=risk[2],
                sort_order=i,
                indication_id=indication.id,
            )
        )

    # ── Go/No-Go Criteria ────────────────────────────────────────────────
    for i, criterion in enumerate(
        [
            "SALT50 ≥45% at week 24 without BB warning requirement",
            "Durable response maintenance beyond 52 weeks off-treatment",
            "Efficacy in alopecia totalis/universalis subpopulation (SALT score ≥95)",
            "Oral route with once-daily dosing for patient convenience",
        ]
    ):
        session.add(
            GoNoGoCriterion(
                description=criterion,
                sort_order=i,
                indication_id=indication.id,
            )
        )

    # ── AI Assessments ───────────────────────────────────────────────────
    assessments = [
        (
            1,
            "Market Attractiveness",
            "Fast-growing niche with established mechanism. The AA market "
            "has grown 6x since 2022 with the first systemic approvals. "
            "At $1.8B, it's smaller than other dermatology markets but "
            "growing at 32% YoY with a $5.2B projection by 2030. "
            "The critical gap: 1.7M treatment-eligible patients are not "
            "on systemic therapy, largely due to BB warning concerns "
            "with baricitinib and limited awareness of ritlecitinib.",
        ),
        (
            2,
            "Target Landscape",
            "JAK pathway dominates — the question is selectivity. JAK1/2 "
            "inhibitors have the strongest efficacy but carry BB warnings. "
            "JAK3/TEC inhibitors (ritlecitinib) avoid the BB warning but "
            "show more modest efficacy. TYK2/JAK1 selectivity represents "
            "an interesting middle ground with potentially better safety. "
            "IL-15 is the most intriguing non-JAK target but remains "
            "early-stage.",
        ),
        (
            3,
            "Compound Analysis",
            "Two marketed drugs with complementary weaknesses define the "
            "opportunity. Olumiant has moderate efficacy (~35% SALT50) "
            "plus a BB warning. Litfulo avoids the BB warning but uses a "
            "SALT20 endpoint, making cross-trial comparison difficult. "
            "Pipeline entrants (deuruxolitinib, brepocitinib) target the "
            "TYK2/JAK1 axis seeking the efficacy-safety sweet spot.",
        ),
        (
            4,
            "Trial Tracker",
            "Key data windows in 2027. CTP-543 (RESTORE-1) is most "
            "advanced at 82% enrolled, reporting Q1 2027. Deuruxolitinib "
            "(THRIVE-AA3) follows in Q2 2027 at 68% enrolled. These "
            "readouts will determine whether TYK2/JAK1 selectivity "
            "delivers better safety without sacrificing efficacy — the "
            "central question for the next wave of AA drugs.",
        ),
        (
            5,
            "Commercial Landscape",
            "Market share is shifting toward the safer option. Litfulo "
            "is gaining share rapidly (+18.5% YoY) despite launching "
            "a year after Olumiant, driven by the absence of a BB "
            "warning. Olumiant is losing share (-6.2%) despite adequate "
            "efficacy. This share migration confirms that safety profile "
            "is the primary prescriber decision driver in AA — a strong "
            "signal for any new entrant's positioning strategy.",
        ),
        (
            6,
            "Expansion Potential",
            "Moderate platform value within autoimmune dermatology. "
            "JAK-based mechanisms have direct applicability to vitiligo "
            "($1.5B, Phase 3 validation) and atopic dermatitis ($14.8B, "
            "marketed). Androgenetic alopecia ($3.8B) is more "
            "speculative for immune-modulatory approaches. Total "
            "expansion potential of ~$20B, but competitive density in "
            "AD limits incremental value.",
        ),
        (
            7,
            "Investment Thesis: Conditional Positive",
            "Alopecia Areata is an attractive niche with validated "
            "biology and clear commercial momentum. The market is growing "
            "rapidly with only two approved therapies, both with "
            "meaningful limitations.\n\n"
            "Strongest path: An oral JAK-selective inhibitor achieving "
            "SALT50 ≥45% without BB warning would displace both current "
            "options. The Litfulo share gain trajectory demonstrates the "
            "commercial value of a cleaner safety profile.\n\n"
            "Key limitation: The market ceiling (~$5B) constrains peak "
            "sales potential to $1–2B for a leading drug. This is a "
            "good bolt-on opportunity for a dermatology portfolio rather "
            "than a standalone platform play.",
        ),
    ]
    for layer, title, content in assessments:
        session.add(
            AiAssessment(
                layer=layer,
                title=title,
                content=content,
                indication_id=indication.id,
            )
        )
