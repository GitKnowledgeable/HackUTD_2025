from threading import Lock

from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from routes import temp

from config import Config
from db import init_db, get_session, get_engine, remove_session
from models import Base, Clinic


_schema_lock = Lock()
_schema_initialized = False


def _attempt_schema_initialization(app):
    global _schema_initialized

    if _schema_initialized:
        return

    engine = get_engine()
    if engine is None:
        return

    with _schema_lock:
        if _schema_initialized:
            return

        try:
            # Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            _schema_initialized = True
            app.logger.info("Database schema initialised.")
        except OperationalError as exc:  # pragma: no cover - operational branch
            app.logger.warning("Unable to initialise database schema: %s", exc)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    print("testing")
    # DB
    engine, _, init_error = init_db(app.config["SQLALCHEMY_DATABASE_URI"])

    if init_error is None:
        _attempt_schema_initialization(app)
    else:
        app.logger.warning("Database not reachable yet: %s", init_error)

    # CORS
    CORS(app, origins=[app.config["CORS_ORIGINS"]])

    temp(app)

    @app.before_request
    def ensure_schema():
        if request.path in {"/healthz", "/health"}:
            return
        _attempt_schema_initialization(app)

    @app.get("/health")
    def health():
        return {"status": "ok"}, 200

    @app.get("/healthz")
    def healthz():
        return {"status": "ok"}, 200

    # @app.teardown_appcontext
    # def dispose_session(_):
    #     remove_session()

    # # dummy endpoints
    # @app.get("/api/v1/clinics")
    # def list_clinics():
    #     try:
    #         session = get_session()
    #     except RuntimeError:
    #         return jsonify({"error": "database unavailable"}), 503

    #     try:
    #         rows = session.query(Clinic).order_by(Clinic.id.desc()).all()
    #     except SQLAlchemyError as exc:
    #         app.logger.error("Error querying clinics: %s", exc)
    #         return jsonify({"error": "database unavailable"}), 503

    #     return jsonify([
    #         {"id": c.id, "name": c.name, "city": c.city, "state": c.state}
    #         for c in rows
    #     ])

    # @app.post("/api/v1/clinics")
    # def add_clinic():
    #     data = request.get_json(force=True)
    #     try:
    #         session = get_session()
    #     except RuntimeError:
    #         return jsonify({"error": "database unavailable"}), 503

    #     clinic = Clinic(
    #         name=data["name"],
    #         city=data.get("city"),
    #         state=data.get("state"),
    #     )

    #     try:
    #         session.add(clinic)
    #         session.commit()
    #     except SQLAlchemyError as exc:
    #         session.rollback()
    #         app.logger.error("Error saving clinic: %s", exc)
    #         return jsonify({"error": "database unavailable"}), 503

    #     return {"id": clinic.id}, 201

    return app

app = create_app()
