"""Seed data for NASH/MASH (Metabolic-Associated Steatohepatitis).

Archetype: Emerging blockbuster with first-ever approval in 2024.
Massive unmet need, explosive growth, first-mover advantage matters.
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


def seed_nash_mash(session: Session) -> None:
    """Create all seed data for the NASH/MASH indication."""

    # ── Indication ───────────────────────────────────────────────────────
    indication = Indication(
        name="NASH / MASH",
        icd_code="K75.81",
        market_size_usd_bn=2.5,
        market_growth_pct=68.0,
        market_year=2024,
        market_history=[0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.3, 0.8, 2.5],
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
        projected_size_usd_bn=27.5,
        projected_year="2030",
        cagr_pct="49.2%",
        pipeline_phase1=12,
        pipeline_phase2=15,
        pipeline_phase3=6,
        pipeline_filed=1,
        pipeline_marketed=1,
        pipeline_total=35,
    )
    session.add(indication)
    session.flush()

    # ── Patient Population ───────────────────────────────────────────────
    session.add(
        PatientPopulation(
            total_prevalence=115,
            diagnosed=18,
            treatable=8.5,
            treated=0.6,
            unit="M (US+EU5)",
            indication_id=indication.id,
        )
    )

    # ── Standard of Care ─────────────────────────────────────────────────
    for i, soc in enumerate(
        [
            (
                "Lifestyle modification (diet/exercise)",
                "1L",
                "Low compliance, modest histological improvement",
            ),
            (
                "Rezdiffra (resmetirom)",
                "2L",
                "First approved drug (2024); accelerated approval, "
                "confirmatory trial ongoing",
            ),
            (
                "Vitamin E (off-label)",
                "Adjunctive",
                "Modest benefit, long-term safety concerns",
            ),
            (
                "GLP-1 agonists (off-label)",
                "Adjunctive",
                "Weight loss benefit, not approved for MASH fibrosis",
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
            "Therapies that reverse fibrosis (F2–F3), not just resolve steatohepatitis",
            "Drugs effective in F4/compensated cirrhosis population",
            "Combination regimens addressing multiple pathogenic pathways",
            "Non-invasive biomarkers to replace liver biopsy for diagnosis "
            "and monitoring",
            "Treatments for the large undiagnosed population "
            "(~85% of MASH patients undiagnosed)",
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
        ("THR-β", "Nuclear Receptor", "Marketed", True),
        ("FXR", "Nuclear Receptor", "Phase 3", False),
        ("GLP-1R", "Incretin Receptor", "Phase 3", False),
        ("GLP-1R/GIPR", "Dual Incretin", "Phase 2", False),
        ("FGF21", "Growth Factor", "Phase 2", False),
        ("ACC", "Enzyme (Lipogenesis)", "Phase 2", False),
        ("PPAR α/δ/γ", "Nuclear Receptor", "Phase 2", False),
        ("ASK1", "Kinase (Apoptosis)", "Phase 2", False),
        ("Galectin-3", "Lectin", "Phase 2", False),
    ]
    targets = {}
    for td in targets_data:
        t = Target(
            name=td[0],
            target_class=td[1],
            most_advanced_phase=td[2],
            has_marketed_drug=td[3],
            indication_id=indication.id,
        )
        session.add(t)
        session.flush()
        targets[td[0]] = t

    # ── Compounds ────────────────────────────────────────────────────────
    compounds_data = [
        {
            "brand_name": "Rezdiffra",
            "inn": "Resmetirom",
            "sponsor": "Madrigal Pharmaceuticals",
            "moa": "THR-β agonist",
            "phase": "Marketed",
            "route": "Oral",
            "primary_efficacy_measure": "NASH resolution (no worsening fibrosis)",
            "primary_efficacy_value": "25.9% vs 9.7% placebo",
            "onset_of_action": "~52 weeks (histology)",
            "safety_profile": "Diarrhea, nausea; generally well tolerated",
            "has_black_box_warning": False,
            "regulatory_designations": "Breakthrough (2023), Accelerated Approval",
            "approval_year": 2024,
            "target_names": ["THR-β"],
        },
        {
            "brand_name": "Obeticholic acid",
            "inn": "Obeticholic acid",
            "sponsor": "Intercept / Alfasigma",
            "moa": "FXR agonist",
            "phase": "Phase 3",
            "route": "Oral",
            "primary_efficacy_measure": "Fibrosis improvement ≥1 stage",
            "primary_efficacy_value": "23% vs 12% placebo",
            "onset_of_action": "~72 weeks",
            "safety_profile": "Pruritus (significant), LDL increase",
            "has_black_box_warning": False,
            "regulatory_designations": "CRL received (2020) — resubmission planned",
            "approval_year": None,
            "target_names": ["FXR"],
        },
        {
            "brand_name": "Semaglutide (MASH)",
            "inn": "Semaglutide",
            "sponsor": "Novo Nordisk",
            "moa": "GLP-1R agonist",
            "phase": "Phase 3",
            "route": "SC injection",
            "primary_efficacy_measure": "NASH resolution (no worsening fibrosis)",
            "primary_efficacy_value": "59% vs 17% placebo (Ph2)",
            "onset_of_action": "~48 weeks",
            "safety_profile": "GI events (nausea, diarrhea), well characterized",
            "has_black_box_warning": False,
            "regulatory_designations": "Breakthrough (2024)",
            "approval_year": None,
            "target_names": ["GLP-1R"],
        },
        {
            "brand_name": "Survodutide",
            "inn": "Survodutide",
            "sponsor": "Boehringer Ingelheim",
            "moa": "GLP-1R/GCGR dual agonist",
            "phase": "Phase 3",
            "route": "SC injection",
            "primary_efficacy_measure": "NASH resolution + fibrosis improvement",
            "primary_efficacy_value": "~62% resolution, ~34% fibrosis (Ph2)",
            "onset_of_action": "~48 weeks",
            "safety_profile": "Nausea, vomiting (GLP-1 class effects)",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["GLP-1R"],
        },
        {
            "brand_name": "Tirzepatide (MASH)",
            "inn": "Tirzepatide",
            "sponsor": "Lilly",
            "moa": "GLP-1R/GIPR dual agonist",
            "phase": "Phase 2",
            "route": "SC injection",
            "primary_efficacy_measure": "NASH resolution",
            "primary_efficacy_value": "~74% (Ph2, SYNERGY-NASH)",
            "onset_of_action": "~52 weeks",
            "safety_profile": "GI events, consistent with GLP-1 class",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["GLP-1R/GIPR"],
        },
        {
            "brand_name": "Pegozafermin",
            "inn": "Pegozafermin",
            "sponsor": "89bio",
            "moa": "FGF21 analog",
            "phase": "Phase 3",
            "route": "SC injection",
            "primary_efficacy_measure": "NASH resolution + fibrosis improvement",
            "primary_efficacy_value": "~37% resolution, ~26% fibrosis (Ph2)",
            "onset_of_action": "~24 weeks",
            "safety_profile": "Injection site rxn, diarrhea, nausea",
            "has_black_box_warning": False,
            "regulatory_designations": "Breakthrough (2023)",
            "approval_year": None,
            "target_names": ["FGF21"],
        },
        {
            "brand_name": "Efruxifermin",
            "inn": "Efruxifermin",
            "sponsor": "Akero Therapeutics",
            "moa": "FGF21 Fc fusion",
            "phase": "Phase 3",
            "route": "SC injection",
            "primary_efficacy_measure": "NASH resolution + fibrosis improvement",
            "primary_efficacy_value": "~39% resolution (Ph2b HARMONY)",
            "onset_of_action": "~24 weeks",
            "safety_profile": "Diarrhea, nausea, mild-moderate",
            "has_black_box_warning": False,
            "regulatory_designations": "Breakthrough (2024)",
            "approval_year": None,
            "target_names": ["FGF21"],
        },
        {
            "brand_name": "Firsocostat",
            "inn": "Firsocostat",
            "sponsor": "Gilead",
            "moa": "ACC inhibitor",
            "phase": "Phase 2",
            "route": "Oral",
            "primary_efficacy_measure": "Liver fat reduction (MRI-PDFF)",
            "primary_efficacy_value": "~29% relative reduction",
            "onset_of_action": "~12 weeks",
            "safety_profile": "Hypertriglyceridemia (requires statin co-admin)",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["ACC"],
        },
        {
            "brand_name": "Seladelpar",
            "inn": "Seladelpar",
            "sponsor": "CymaBay / Gilead",
            "moa": "PPARδ agonist",
            "phase": "Phase 2",
            "route": "Oral",
            "primary_efficacy_measure": "NASH resolution",
            "primary_efficacy_value": "Data emerging",
            "onset_of_action": "~52 weeks",
            "safety_profile": "Generally well tolerated",
            "has_black_box_warning": False,
            "regulatory_designations": "—",
            "approval_year": None,
            "target_names": ["PPAR α/δ/γ"],
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
            "Semaglutide (MASH)",
            "ESSENCE",
            "Phase 3",
            1200,
            88,
            "fast",
            "Enrolling",
            "Q2 2027",
            "NASH resolution + fibrosis improvement wk72",
            "Placebo",
        ),
        (
            "Survodutide",
            "SYNCHRONIZE-1",
            "Phase 3",
            950,
            42,
            "moderate",
            "Enrolling",
            "Q4 2027",
            "NASH resolution no worsening fibrosis wk48",
            "Placebo",
        ),
        (
            "Pegozafermin",
            "ENLIGHTEN-1",
            "Phase 3",
            800,
            65,
            "fast",
            "Enrolling",
            "Q3 2027",
            "Fibrosis improvement ≥1 stage wk48",
            "Placebo",
        ),
        (
            "Efruxifermin",
            "SYMMETRY",
            "Phase 3",
            700,
            38,
            "moderate",
            "Enrolling",
            "Q1 2028",
            "NASH resolution + fibrosis improvement wk48",
            "Placebo",
        ),
        (
            "Tirzepatide (MASH)",
            "SYNERGY-NASH Ph3",
            "Phase 3",
            900,
            15,
            "slow",
            "Enrolling",
            "Q4 2028",
            "NASH resolution wk52",
            "Placebo",
        ),
        (
            "Obeticholic acid",
            "REVERSE Ph3b",
            "Phase 3",
            500,
            72,
            "moderate",
            "Enrolling",
            "Q2 2027",
            "Fibrosis improvement ≥1 stage",
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
    if "Rezdiffra" in compounds:
        session.add(
            MarketedDrugData(
                revenue_history_m=[0, 0, 0, 0, 0, 0, 0, 80, 580],
                revenue_years=[
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
                market_share_pct=95,
                share_change_pct=95.0,
                wac_price_usd=47400,
                formulary_access_pct="42%",
                nbrx_volume="4.8K/mo",
                nbrx_trend="up",
                has_post_market_safety_flag=False,
                compound_id=compounds["Rezdiffra"].id,
            )
        )

    # ── Expansion Indications ────────────────────────────────────────────
    for exp in [
        (
            "Primary Biliary Cholangitis (PBC)",
            1.8,
            "130K US+EU5",
            "medium",
            "Marketed",
            "strong",
        ),
        (
            "Obesity (metabolic syndrome)",
            54.0,
            "650M globally",
            "high",
            "Phase 2",
            "moderate",
        ),
        (
            "Type 2 Diabetes (hepatic component)",
            42.0,
            "537M globally",
            "high",
            "Phase 2",
            "moderate",
        ),
        ("Alcoholic Hepatitis", 0.9, "28K US", "low", "Preclinical", "speculative"),
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
            "Acquisition",
            "Gilead ← CymaBay",
            "Seladelpar (PPARδ, PBC/MASH)",
            "$4.3B",
            "$4.3B",
        ),
        (
            "2024",
            "License",
            "Boehringer Ingelheim + Zealand",
            "Survodutide (MASH/obesity)",
            "$1.8B+ milestones",
            "$100M",
        ),
        (
            "2023",
            "Partnership",
            "Novo Nordisk + Inversago",
            "CB1 antagonist (MASH combo)",
            "$700M+ milestones",
            "$85M",
        ),
        ("2023", "IPO", "89bio", "Pegozafermin (FGF21 analog)", "$210M raised", "—"),
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
                "GLP-1 agonist dominance",
                "Semaglutide's MASH data (~59% resolution) may establish "
                "GLP-1 as de facto standard, marginalizing other mechanisms",
                "high",
            ),
            (
                "Accelerated approval uncertainty",
                "Rezdiffra's approval was accelerated — confirmatory trial "
                "failure could destabilize the market",
                "medium",
            ),
            (
                "Combination therapy requirement",
                "Single-agent approaches may prove insufficient; winning "
                "strategy may require costly combination development",
                "medium",
            ),
            (
                "Diagnostic bottleneck",
                "~85% of MASH patients undiagnosed — market realization "
                "depends on non-invasive diagnostic adoption",
                "high",
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
            "Demonstrated fibrosis improvement (not just NASH resolution) in Phase 2",
            "Differentiated mechanism vs. GLP-1 agonists — oral preferred, "
            "or combination synergy",
            "Viable in F2–F3 population where disease modification is most impactful",
            "Non-invasive biomarker strategy for patient identification and monitoring",
            "Phase 2 data available before semaglutide ESSENCE readout (H1 2027)",
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
            "Explosive growth from near-zero base. MASH is the largest "
            "unmet need in hepatology — 115M patients in US+EU5 with "
            "only 0.6M currently treated. Rezdiffra's 2024 approval "
            "validated the market, but with only 42% formulary access "
            "and accelerated approval, the field is far from settled. "
            "Projected $27.5B by 2030 makes this one of the largest "
            "emerging therapeutic markets globally.",
        ),
        (
            2,
            "Competitive Pipeline",
            "Multi-mechanism opportunity with no clear winner. GLP-1 "
            "agonists show the strongest efficacy signals but require "
            "injection. THR-β (Rezdiffra) has first-mover advantage but "
            "modest efficacy. FGF21 analogs represent the most "
            "interesting emerging class with dual resolution + fibrosis "
            "data. The field is wide open — combination strategies "
            "targeting multiple pathways will likely define the ultimate "
            "standard of care. "
            "Semaglutide leads on efficacy (~59% NASH resolution) but "
            "is injectable and faces GLP-1 supply constraints. Rezdiffra "
            "has oral convenience but modest efficacy (~26%). The FGF21 "
            "analogs (pegozafermin, efruxifermin) occupy an attractive "
            "middle ground. No compound has yet demonstrated fibrosis "
            "reversal as a primary outcome.",
        ),
        (
            3,
            "Trial Tracker",
            "Critical data readouts in 2027. The ESSENCE trial "
            "(semaglutide) is the most pivotal — 88% enrolled, "
            "reporting Q2 2027. Positive data could establish GLP-1 as "
            "the MASH standard. Pegozafermin (ENLIGHTEN) and OCA "
            "(REVERSE) also report mid-2027. The competitive landscape "
            "will look fundamentally different by end of 2027.",
        ),
        (
            4,
            "In-Market Performance",
            "First-mover is gaining traction but far from dominant. "
            "Rezdiffra's $580M first-year revenue is strong for a new "
            "category, but 42% formulary access shows payer resistance "
            "to the $47K price point with only accelerated approval. "
            "The market is wide open for competitors with stronger "
            "efficacy data and/or full approval.",
        ),
        (
            5,
            "Expansion Potential",
            "Massive platform value across metabolic disease. MASH "
            "mechanisms — particularly GLP-1 and FGF21 — have direct "
            "relevance to obesity ($54B), T2D ($42B), and PBC ($1.8B). "
            "A successful MASH program could expand into a $100B+ total "
            "addressable market. The metabolic disease convergence makes "
            "mechanism-level investments particularly attractive.",
        ),
        (
            6,
            "Investment Thesis: Positive",
            "MASH represents the strongest market opportunity in "
            "hepatology — perhaps in all of specialty pharma. The "
            "combination of massive unmet need (115M patients, <1% "
            "treated), explosive market growth, and an unsettled "
            "competitive landscape creates a rare window.\n\n"
            "Strongest path: An oral agent with fibrosis reversal data "
            "would be transformative. Alternatively, a combination "
            "strategy pairing with GLP-1 agonists could capture the "
            "emerging combo paradigm.\n\n"
            "Critical watch: Semaglutide ESSENCE data (Q2 2027) will "
            "define the competitive bar. If GLP-1 monotherapy delivers "
            "fibrosis reversal, the standalone opportunity for other "
            "mechanisms narrows. However, the sheer size of the "
            "undiagnosed population suggests room for multiple winners.",
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
