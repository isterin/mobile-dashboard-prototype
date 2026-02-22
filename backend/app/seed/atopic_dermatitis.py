"""Seed data for Atopic Dermatitis indication.

Archetype: Crowded, large, fast-growing market with strong incumbents.
Data is directionally realistic — real drug names and sponsors,
plausible but approximate market figures.
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


def seed_atopic_dermatitis(session: Session) -> None:
    """Create all seed data for the Atopic Dermatitis indication."""

    # ── Indication (Layer 1 market data) ─────────────────────────────────
    indication = Indication(
        name="Atopic Dermatitis",
        icd_code="L20",
        market_size_usd_bn=14.8,
        market_growth_pct=11.2,
        market_year=2024,
        market_history=[4.2, 5.1, 6.3, 7.8, 9.1, 10.6, 12.2, 13.3, 14.8],
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
        projected_size_usd_bn=24.1,
        projected_year="2030",
        cagr_pct="8.4%",
        pipeline_phase1=18,
        pipeline_phase2=14,
        pipeline_phase3=8,
        pipeline_filed=1,
        pipeline_marketed=6,
        pipeline_total=47,
    )
    session.add(indication)
    session.flush()

    # ── Patient Population ───────────────────────────────────────────────
    session.add(
        PatientPopulation(
            total_prevalence=223,
            diagnosed=84,
            treatable=31,
            treated=18,
            unit="M (US+EU5)",
            indication_id=indication.id,
        )
    )

    # ── Standard of Care ─────────────────────────────────────────────────
    for i, soc in enumerate(
        [
            ("Topical corticosteroids", "1L", "Skin thinning, rebound flares"),
            ("Dupixent (dupilumab)", "2L", "Injectable, slow onset (~16wk)"),
            (
                "JAK inhibitors (oral)",
                "2L/3L",
                "Black box warnings, CV/malignancy risk",
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
            "Oral therapy with clean safety profile (no JAK class warnings)",
            "Faster onset of action vs. biologics (~4wk vs ~16wk)",
            "Pediatric-friendly formulations (<6 years)",
            "Durable remission without continuous therapy",
        ]
    ):
        session.add(
            UnmetNeed(
                description=need,
                sort_order=i,
                indication_id=indication.id,
            )
        )

    # ── Targets (Layer 2) ────────────────────────────────────────────────
    targets_data = [
        ("IL-4/IL-13", "Cytokine", "Marketed", True, "high", 5),
        ("JAK1", "Kinase", "Marketed", True, "high", 4),
        ("JAK1/JAK2", "Kinase", "Marketed", True, "medium", 2),
        ("OX40 / OX40L", "Co-stimulatory", "Phase 3", False, "medium", 3),
        ("IL-13", "Cytokine", "Marketed", True, "medium", 2),
        ("IL-31", "Cytokine", "Phase 3", False, "low", 2),
        ("TSLP", "Cytokine", "Phase 2", False, "low", 1),
        ("IL-22", "Cytokine", "Phase 2", False, "low", 1),
        ("PDE4", "Enzyme", "Marketed", True, "medium", 2),
        ("IL-33 / ST2", "Alarmin", "Phase 2", False, "low", 2),
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

    # ── Compounds (Layer 3) ──────────────────────────────────────────────
    compounds_data = [
        {
            "brand_name": "Dupixent",
            "inn": "Dupilumab",
            "sponsor": "Regeneron / Sanofi",
            "moa": "IL-4Rα mAb",
            "phase": "Marketed",
            "route": "SC injection",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "44–52%",
            "onset_of_action": "~16 weeks",
            "safety_profile": "Conjunctivitis (8–10%), injection site rxn",
            "has_black_box_warning": False,
            "regulatory_designations": "Breakthrough (2017)",
            "approval_year": 2017,
            "target_names": ["IL-4/IL-13"],
        },
        {
            "brand_name": "Rinvoq",
            "inn": "Upadacitinib",
            "sponsor": "AbbVie",
            "moa": "JAK1 inhibitor",
            "phase": "Marketed",
            "route": "Oral",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "62–70%",
            "onset_of_action": "~2 weeks",
            "safety_profile": "BB warning: CV, malignancy, thrombosis",
            "has_black_box_warning": True,
            "regulatory_designations": "—",
            "approval_year": 2022,
            "target_names": ["JAK1"],
        },
        {
            "brand_name": "Cibinqo",
            "inn": "Abrocitinib",
            "sponsor": "Pfizer",
            "moa": "JAK1 inhibitor",
            "phase": "Marketed",
            "route": "Oral",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "58–63%",
            "onset_of_action": "~2 weeks",
            "safety_profile": "BB warning: CV, malignancy, thrombosis",
            "has_black_box_warning": True,
            "regulatory_designations": "Breakthrough (2018)",
            "approval_year": 2022,
            "target_names": ["JAK1"],
        },
        {
            "brand_name": "Adbry",
            "inn": "Tralokinumab",
            "sponsor": "LEO Pharma",
            "moa": "IL-13 mAb",
            "phase": "Marketed",
            "route": "SC injection",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "25–33%",
            "onset_of_action": "~16 weeks",
            "safety_profile": "Injection site rxn, URI",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": 2021,
            "target_names": ["IL-13"],
        },
        {
            "brand_name": "Olumiant",
            "inn": "Baricitinib",
            "sponsor": "Lilly",
            "moa": "JAK1/2 inhibitor",
            "phase": "Marketed",
            "route": "Oral",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "30–38%",
            "onset_of_action": "~4 weeks",
            "safety_profile": "BB warning: CV, malignancy, thrombosis",
            "has_black_box_warning": True,
            "regulatory_designations": "—",
            "approval_year": 2022,
            "target_names": ["JAK1/JAK2"],
        },
        {
            "brand_name": "Amlitelimab",
            "inn": "Amlitelimab",
            "sponsor": "Sanofi",
            "moa": "OX40L mAb",
            "phase": "Phase 3",
            "route": "SC injection",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "~61% (Ph2)",
            "onset_of_action": "~12 weeks",
            "safety_profile": "Clean profile in Ph2",
            "has_black_box_warning": False,
            "regulatory_designations": "Breakthrough (2023)",
            "approval_year": None,
            "target_names": ["OX40 / OX40L"],
        },
        {
            "brand_name": "Rocatinlimab",
            "inn": "Rocatinlimab",
            "sponsor": "Lilly",
            "moa": "OX40 mAb",
            "phase": "Phase 3",
            "route": "SC injection",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "~42% (Ph2b)",
            "onset_of_action": "~16 weeks",
            "safety_profile": "Pyrexia, cytokine release",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["OX40 / OX40L"],
        },
        {
            "brand_name": "Nemolizumab",
            "inn": "Nemolizumab",
            "sponsor": "Galderma",
            "moa": "IL-31Rα mAb",
            "phase": "Phase 3",
            "route": "SC injection",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "~44% (Ph3, prurigo)",
            "onset_of_action": "~4 weeks (itch)",
            "safety_profile": "Peripheral edema, AD flares",
            "has_black_box_warning": False,
            "regulatory_designations": "Breakthrough (2024)",
            "approval_year": None,
            "target_names": ["IL-31"],
        },
        {
            "brand_name": "Cendakimab",
            "inn": "Cendakimab",
            "sponsor": "Sanofi",
            "moa": "IL-13 mAb",
            "phase": "Phase 3",
            "route": "SC injection",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "~49% (Ph2)",
            "onset_of_action": "~16 weeks",
            "safety_profile": "Nasopharyngitis, URI",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["IL-13"],
        },
        {
            "brand_name": "Lebrikizumab",
            "inn": "Lebrikizumab",
            "sponsor": "Lilly / Almirall",
            "moa": "IL-13 mAb",
            "phase": "Filed",
            "route": "SC injection",
            "primary_efficacy_measure": "EASI-75",
            "primary_efficacy_value": "~43% (Ph3)",
            "onset_of_action": "~16 weeks",
            "safety_profile": "Conjunctivitis, injection site rxn",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["IL-13"],
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

    # ── Trials (Layer 4) ─────────────────────────────────────────────────
    trials_data = [
        (
            "Amlitelimab",
            "OCEANA-1",
            "Phase 3",
            900,
            72,
            "fast",
            "Enrolling",
            "Q1 2027",
            "EASI-75 wk16",
            "Placebo",
        ),
        (
            "Amlitelimab",
            "OCEANA-2",
            "Phase 3",
            850,
            48,
            "moderate",
            "Enrolling",
            "Q3 2027",
            "EASI-75 wk16",
            "Placebo",
        ),
        (
            "Rocatinlimab",
            "ROCKET-1",
            "Phase 3",
            1000,
            35,
            "moderate",
            "Enrolling",
            "Q4 2027",
            "EASI-75 wk24",
            "Placebo",
        ),
        (
            "Nemolizumab",
            "ARCADIA-3",
            "Phase 3",
            600,
            81,
            "fast",
            "Enrolling",
            "Q2 2027",
            "IGA 0/1 wk16",
            "Placebo + TCS",
        ),
        (
            "Cendakimab",
            "CEDAR",
            "Phase 3",
            750,
            55,
            "moderate",
            "Enrolling",
            "Q3 2027",
            "EASI-75 wk16",
            "Placebo",
        ),
        (
            "Lebrikizumab",
            "ADhere-6",
            "Phase 3",
            500,
            100,
            None,
            "Completed",
            "Completed",
            "EASI-75 wk16",
            "Dupixent",
        ),
        (
            "Rinvoq",
            "HEADS UP 2",
            "Phase 3b",
            400,
            20,
            "slow",
            "Enrolling",
            "Q1 2028",
            "EASI-75 wk12",
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

    # ── Marketed Drug Data (Layer 5) ─────────────────────────────────────
    marketed_data = [
        (
            "Dupixent",
            [1890, 3530, 5050, 6390, 7820, 9200],
            ["2019", "2020", "2021", "2022", "2023", "2024"],
            62,
            -3.1,
            37000,
            "89%",
            "68K/mo",
            "up",
            False,
            None,
        ),
        (
            "Rinvoq",
            [0, 0, 0, 420, 980, 1450],
            ["2019", "2020", "2021", "2022", "2023", "2024"],
            14,
            4.2,
            66000,
            "71%",
            "22K/mo",
            "up",
            True,
            "BB Warning — restricts formulary positioning & 1L adoption",
        ),
        (
            "Cibinqo",
            [0, 0, 0, 180, 380, 560],
            ["2019", "2020", "2021", "2022", "2023", "2024"],
            5,
            1.8,
            62000,
            "58%",
            "9K/mo",
            "flat",
            True,
            "BB Warning — restricts formulary positioning & 1L adoption",
        ),
        (
            "Adbry",
            [0, 0, 120, 290, 410, 480],
            ["2019", "2020", "2021", "2022", "2023", "2024"],
            4,
            -0.5,
            33000,
            "64%",
            "6K/mo",
            "down",
            False,
            None,
        ),
        (
            "Olumiant",
            [0, 0, 0, 150, 220, 260],
            ["2019", "2020", "2021", "2022", "2023", "2024"],
            2,
            -0.3,
            58000,
            "52%",
            "3K/mo",
            "down",
            True,
            "BB Warning — restricts formulary positioning & 1L adoption",
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

    # ── Expansion Indications (Layer 6) ──────────────────────────────────
    for exp in [
        ("Asthma", 8.2, "350M globally", "high", "Marketed", "strong"),
        (
            "CRSwNP (Chronic Rhinosinusitis with Nasal Polyps)",
            3.1,
            "30M globally",
            "medium",
            "Marketed",
            "strong",
        ),
        ("COPD (Type 2 High)", 18.4, "380M globally", "medium", "Phase 3", "strong"),
        ("Eosinophilic Esophagitis", 2.1, "160K US", "medium", "Marketed", "strong"),
        ("Food Allergy", 1.2, "32M US+EU5", "low", "Phase 2", "moderate"),
        ("Prurigo Nodularis", 0.8, "72K US", "low", "Phase 3", "strong"),
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

    # ── Comparable Transactions (Layer 7) ────────────────────────────────
    for deal in [
        (
            "2024",
            "License",
            "Lilly → Almirall",
            "Lebrikizumab (EU rights)",
            "$1.5B total",
            "$550M",
        ),
        (
            "2024",
            "Acquisition",
            "AbbVie ← Cerevel",
            "CNS pipeline (neuro-derm overlap)",
            "$8.7B",
            None,
        ),
        (
            "2023",
            "License",
            "Galderma → Licensed In",
            "Nemolizumab (ex-Japan)",
            "$1.2B+",
            "$450M",
        ),
        (
            "2023",
            "Partnership",
            "Sanofi + Teva",
            "OX40L/AD co-develop",
            "Undisclosed",
            None,
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

    # ── Thesis Risks (Layer 7) ───────────────────────────────────────────
    for i, risk in enumerate(
        [
            (
                "High competitive density",
                "47 programs active; 8 in Phase 3 — crowded approval window "
                "in 2027–2029",
                "high",
            ),
            (
                "Amlitelimab threat",
                "Strong Phase 2 data, Breakthrough designation, Sanofi "
                "resources — may redefine biologic standard",
                "high",
            ),
            (
                "JAK class overhang",
                "If entering JAK space, BB warning stigma limits formulary "
                "access to ~55–70%",
                "medium",
            ),
            (
                "Regulatory bar rising",
                "FDA increasingly expects active comparator data (vs Dupixent), "
                "not just placebo",
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

    # ── Go/No-Go Criteria (Layer 7) ─────────────────────────────────────
    for i, criterion in enumerate(
        [
            "Differentiated efficacy or safety profile vs. Dupixent AND JAK inhibitors",
            "Clinical data readout before or concurrent with amlitelimab approval",
            "Oral route of administration OR dosing advantage "
            "(Q3–6 month SC vs Dupixent Q2W)",
            "Phase 2 data supporting ≥50% EASI-75 with manageable safety",
            "Viable path to broad formulary access (>75% coverage within 2 years)",
        ]
    ):
        session.add(
            GoNoGoCriterion(
                description=criterion,
                sort_order=i,
                indication_id=indication.id,
            )
        )

    # ── AI Assessments (all layers) ──────────────────────────────────────
    assessments = [
        (
            1,
            "Market Attractiveness",
            "Large, growing market with significant unmet need. The AD "
            "market has tripled since Dupixent's launch but 13M "
            "treatment-eligible patients remain untreated systemically. "
            "The opportunity is real. However, with 47 active programs "
            "the space is crowding rapidly — a viable entry requires "
            "clear differentiation on safety, convenience, or efficacy.",
        ),
        (
            2,
            "Target Landscape",
            "White space exists in alarmins and neuro-immune axes. "
            "IL-4/IL-13 and JAK targets are saturated with 9+ programs "
            "each. The OX40/OX40L axis is the most active novel mechanism. "
            "The clearest differentiation opportunities lie in "
            "underexplored targets like TSLP, IL-22, and IL-33/ST2 — "
            "each has only 1–2 programs and no marketed drugs, though "
            "clinical validation remains early-stage.",
        ),
        (
            3,
            "Compound Analysis",
            "The compound landscape splits into two tiers: Dupixent as "
            "the dominant biologic with moderate efficacy but clean safety, "
            "and oral JAK inhibitors with superior efficacy but boxed "
            "warnings. Amlitelimab's Phase 2 data (~61% EASI-75 with "
            "clean safety) represents the most promising profile among "
            "pipeline candidates. The differentiation gap is narrowest "
            "for new injectable biologics targeting IL-13.",
        ),
        (
            4,
            "Trial Tracker",
            "Data inflection point in H1 2027. Five Phase 3 trials are "
            "expected to report primary results between Q1–Q3 2027. "
            "Amlitelimab and Nemolizumab are enrolling fastest — their "
            "readouts will materially reshape the competitive landscape. "
            "Any new entrant should plan around this wave: data may "
            "create differentiation opportunities or eliminate them.",
        ),
        (
            5,
            "Commercial Landscape",
            "Dupixent dominates but shows share erosion. Oral JAK "
            "inhibitors are gaining share despite black box warnings, "
            "signaling strong physician/patient demand for oral options. "
            "Adbry and Olumiant are underperforming — IL-13 monotherapy "
            "and JAK1/2 broad inhibition appear to be weaker profiles. "
            "The combination of Dupixent's share loss and JAK safety "
            "concerns creates a clear opening for a differentiated oral "
            "or subcutaneous entrant.",
        ),
        (
            6,
            "Expansion Potential",
            "Strong platform value across Type 2 inflammation. The "
            "IL-4/IL-13 axis has proven expansion into asthma ($8B), "
            "CRSwNP ($3B), EoE ($2B), and COPD ($18B). Dupixent's "
            "multi-indication success provides precedent — total "
            "addressable market across viable expansions exceeds $30B. "
            "A novel mechanism with AD proof-of-concept would have "
            "substantial platform optionality.",
        ),
        (
            7,
            "Investment Thesis: Conditional Positive",
            "Atopic Dermatitis remains an attractive market — large, "
            "growing, with persistent unmet need despite multiple "
            "approvals. The opportunity to capture $2–4B in peak sales "
            "exists for a differentiated entrant.\n\n"
            "Strongest path: An oral compound with JAK1 selectivity AND "
            "a clean safety profile would address the market's biggest "
            "unmet need. Target EASI-75 ≥55%, onset ≤4 weeks.\n\n"
            "Critical watch items: Amlitelimab Phase 3 data (H1 2027) "
            "will reshape the biologic landscape. If it succeeds with a "
            "clean safety profile, the bar for new entrants rises "
            "significantly. Investment decision should ideally be made "
            "with this data in hand.",
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
