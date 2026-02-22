"""Seed data package for the Market Analysis Dashboard.

Provides seed_all() to populate the database with realistic sample data
for multiple indications.
"""

import logging

from sqlmodel import Session

from app.seed.alopecia_areata import seed_alopecia_areata
from app.seed.atopic_dermatitis import seed_atopic_dermatitis
from app.seed.nash_mash import seed_nash_mash

logger = logging.getLogger(__name__)


def seed_all(session: Session) -> None:
    """Seed the database with sample data for all indications."""
    logger.info("Seeding Atopic Dermatitis...")
    seed_atopic_dermatitis(session)

    logger.info("Seeding NASH/MASH...")
    seed_nash_mash(session)

    logger.info("Seeding Alopecia Areata...")
    seed_alopecia_areata(session)

    session.commit()
    logger.info("All seed data inserted successfully.")
