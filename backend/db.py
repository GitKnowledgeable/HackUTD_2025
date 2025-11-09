import logging
import time

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker, scoped_session

from sqlalchemy import make_url

_engine = None
_Session = None

def init_db(
    database_url: str,
    *,
    attempts: int = 10,
    delay_seconds: float = 3.0,
    connect_timeout: int = 5,
):
    """Initialise the SQLAlchemy engine and session factory with retry logic."""

    global _engine, _Session

    # modification to make SQLite work in backend unit tests
    # make connect_args conditional since SQLite doesn't accept it

    url = make_url(database_url)
    is_sqlite = url.get_backend_name().startswith("sqlite")

    create_engine_kwargs = {
        "future": True,
        "pool_pre_ping": True,
    }
    if not is_sqlite:
        create_engine_kwargs["connect_args"] = {"connect_timeout": connect_timeout}

    _engine = create_engine(database_url, **create_engine_kwargs)

    # _engine = create_engine(
    #     database_url,
    #     pool_pre_ping=True,
    #     future=True,
    #     connect_args={"connect_timeout": connect_timeout},
    # )

    _Session = scoped_session(
        sessionmaker(bind=_engine, autoflush=False, autocommit=False, future=True)
    )

    last_error = None

    for attempt in range(1, attempts + 1):
        try:
            with _engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            last_error = None
            break
        except OperationalError as exc:  # pragma: no cover - operational branch
            last_error = exc
            logging.warning(
                "Database connection failed (attempt %s/%s): %s",
                attempt,
                attempts,
                exc,
            )
            if attempt < attempts:
                time.sleep(delay_seconds)

    return _engine, _Session, last_error

def get_session():
    if _Session is None:
        raise RuntimeError("Database session has not been initialised.")
    return _Session()

def get_engine():
    return _engine

def remove_session():
    if _Session is not None:
        _Session.remove()