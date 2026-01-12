# backend/app.py

from flask import Flask, send_from_directory
from flask_cors import CORS
from models import db

from routes.auth import auth_bp
from routes.candidate import candidate_bp
from routes.admin import admin_bp
from routes.hr import hr_bp
from routes.employee import employee_bp
from routes.leaves import leaves_bp

import os

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")

# -----------------------
# Configuration
# -----------------------

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite:///" + os.path.join(BASE_DIR, "instance", "database.db")
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "dev-secret-key"

db.init_app(app)
CORS(app, supports_credentials=True)

# -----------------------
# Register Blueprints
# -----------------------
app.register_blueprint(auth_bp)
app.register_blueprint(candidate_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(hr_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(leaves_bp)

# -----------------------
# Serve React SPA
# -----------------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


# -----------------------
# Run Server
# -----------------------
if __name__ == "__main__":
    app.run(debug=True)
