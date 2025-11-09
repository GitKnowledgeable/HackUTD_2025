from flask import Blueprint, jsonify, request
from sqlalchemy.exc import OperationalError, SQLAlchemyError

from db import get_session, remove_session
from models import Car


search_bp = Blueprint("search", __name__)


@search_bp.get("/")
def get_cars_with_filters():
    """GET with many optional filters.

    Supported query parameters (all optional):
      - model, trim, drivetrain, color, interior_color, interior_material  (string, partial case-insensitive)
      - dealership_id (int, exact)
      - year, year_min, year_max (int)
      - price_min, price_max (float)
      - mileage_min, mileage_max (int)
      - horsepower_min, horsepower_max (int)

    Examples:
      /?model=civic&price_max=15000&year_min=2015
      /?trim=lx&dealership_id=3
    """

    try:
        session = get_session()
    except RuntimeError:
        return jsonify({"error": "database unavailable"}), 503

    try:
        # Helpers for parsing numeric params
        def _get_int(name):
            v = request.args.get(name)
            return None if v is None else int(v)

        def _get_float(name):
            v = request.args.get(name)
            return None if v is None else float(v)

        # String filters (partial, case-insensitive)
        s_model = request.args.get("model")
        s_trim = request.args.get("trim")
        s_drivetrain = request.args.get("drivetrain")
        s_color = request.args.get("color")
        s_interior_color = request.args.get("interior_color")
        s_interior_material = request.args.get("interior_material")

        # Exact/int filters
        dealership_id = request.args.get("dealership_id")
        if dealership_id is not None:
            try:
                dealership_id = int(dealership_id)
            except ValueError:
                return jsonify({"error": "invalid dealership_id parameter"}), 400

        # Numeric ranges
        try:
            year = _get_int("year")
            year_min = _get_int("year_min")
            year_max = _get_int("year_max")

            price_min = _get_float("price_min")
            price_max = _get_float("price_max")

            mileage_min = _get_int("mileage_min")
            mileage_max = _get_int("mileage_max")

            horsepower_min = _get_int("horsepower_min")
            horsepower_max = _get_int("horsepower_max")
        except ValueError as ve:
            return jsonify({"error": "invalid numeric parameter", "detail": str(ve)}), 400

        # Build query
        query = session.query(Car)

        # Year
        if year is not None:
            query = query.filter(Car.year == year)
        if year_min is not None:
            query = query.filter(Car.year >= year_min)
        if year_max is not None:
            query = query.filter(Car.year <= year_max)

        # Price
        if price_min is not None:
            query = query.filter(Car.price >= price_min)
        if price_max is not None:
            query = query.filter(Car.price <= price_max)

        # Mileage
        if mileage_min is not None:
            query = query.filter(Car.mileage >= mileage_min)
        if mileage_max is not None:
            query = query.filter(Car.mileage <= mileage_max)

        # Horsepower
        if horsepower_min is not None:
            query = query.filter(Car.horsepower >= horsepower_min)
        if horsepower_max is not None:
            query = query.filter(Car.horsepower <= horsepower_max)

        # Dealership id
        if dealership_id is not None:
            query = query.filter(Car.dealership_id == dealership_id)

        # String partial matches (case-insensitive)
        if s_model:
            query = query.filter(Car.model.ilike(f"%{s_model}%"))
        if s_trim:
            query = query.filter(Car.trim.ilike(f"%{s_trim}%"))
        if s_drivetrain:
            query = query.filter(Car.drivetrain.ilike(f"%{s_drivetrain}%"))
        if s_color:
            query = query.filter(Car.color.ilike(f"%{s_color}%"))
        if s_interior_color:
            query = query.filter(Car.interior_color.ilike(f"%{s_interior_color}%"))
        if s_interior_material:
            query = query.filter(Car.interior_material.ilike(f"%{s_interior_material}%"))

        cars = query.all()

        # Convert to JSON-serializable dicts
        result = []
        for c in cars:
            # Only include attributes that exist on the model to avoid runtime errors
            item = {
                "id": getattr(c, "id", None),
                "model": getattr(c, "model", None),
                "year": getattr(c, "year", None),
                "price": getattr(c, "price", None),
                "trim": getattr(c, "trim", None),
                "mileage": getattr(c, "mileage", None),
                "drivetrain": getattr(c, "drivetrain", None),
                "horsepower": getattr(c, "horsepower", None),
                "color": getattr(c, "color", None),
                "interior_color": getattr(c, "interior_color", None),
                "interior_material": getattr(c, "interior_material", None),
                "dealership_id": getattr(c, "dealership_id", None),
            }
            # Optionally include additional attributes if present
            if hasattr(c, "range_miles"):
                item["range_miles"] = c.range_miles
            if hasattr(c, "gas_mileage"):
                item["gas_mileage"] = c.gas_mileage

            result.append(item)

        return jsonify(result)
    except OperationalError:
        return jsonify({"error": "database unavailable"}), 503
    except SQLAlchemyError as exc:
        return jsonify({"error": "database error", "detail": str(exc)}), 500
    finally:
        try:
            remove_session()
        except Exception:
            pass









