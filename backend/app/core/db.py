import logging

from sqlmodel import Session, create_engine, select

from app.core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

logger = logging.getLogger(__name__)


def init_db(session: Session) -> None:
    """Initialize the database.

    Tables are created via Alembic migrations.
    Seeds sample data if the database is empty.
    """
    from app.models import Indication

    count = session.exec(select(Indication)).first()
    if count is None:
        logger.info("Empty database detected — seeding sample data...")
        from app.seed import seed_all

        seed_all(session)
    else:
        logger.info("Database already has data — skipping seed.")
