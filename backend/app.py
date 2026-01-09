from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db
from auth import auth
from employees import employees_bp

app = Flask(__name__)

# ---------- CONFIG ----------
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://root:Gokul%401619@localhost/auth_db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "super-secret-key"

# ---------- INIT ----------
db.init_app(app)
JWTManager(app)

# ✅ CORS FIX (IMPORTANT)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# ---------- BLUEPRINTS ----------
app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(employees_bp, url_prefix="/api")

# ---------- CREATE TABLES ----------
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
