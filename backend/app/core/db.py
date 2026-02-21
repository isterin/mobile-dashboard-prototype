from sqlmodel import Session, create_engine

from app.core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def init_db(session: Session) -> None:
    """Initialize the database.

    Tables are created via Alembic migrations.
    Add any seed data logic here when needed.
    """
    pass
