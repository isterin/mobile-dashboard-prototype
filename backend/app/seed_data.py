"""Seed the database with sample market analysis data.

Usage:
    cd backend && uv run python -m app.seed_data

This script is idempotent — it clears all existing data and re-seeds.
"""

import logging

from sqlmodel import Session, text

from app.core.db import engine
from app.seed import seed_all

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Tables to clear, ordered to respect foreign key constraints
TABLES_TO_CLEAR = [
    "compoundtarget",
    "trial",
    "marketeddrugdata",
    "aiassessment",
    "comparabletransaction",
    "thesisrisk",
    "gonogocriterion",
    "expansionindication",
    "unmetneed",
    "standardofcare",
    "patientpopulation",
    "compound",
    "target",
    "indication",
]


def clear_all(session: Session) -> None:
    """Delete all rows from all domain tables."""
    for table in TABLES_TO_CLEAR:
        session.exec(text(f"DELETE FROM {table}"))  # type: ignore[call-overload]
    session.commit()
    logger.info("Cleared all existing data.")


def main() -> None:
    """Clear and re-seed the database."""
    logger.info("Starting database seed...")
    with Session(engine) as session:
        clear_all(session)
        seed_all(session)
    logger.info("Database seeded successfully.")


if __name__ == "__main__":
    main()
