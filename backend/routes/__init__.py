from .search import search_bp


def temp(app):
    """Register API blueprints on the Flask app.

    The project currently exposes the `search` blueprint under /api/search.
    """
    app.register_blueprint(search_bp, url_prefix="/api/search")