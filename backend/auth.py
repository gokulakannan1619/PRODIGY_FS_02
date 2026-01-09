from flask import Blueprint, request, jsonify
from models import User, db
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt
)
import bcrypt

auth = Blueprint("auth", __name__)

# ================= REGISTER =================
@auth.route("/register", methods=["POST"])
def register():
    data = request.json

    # ✅ validation
    if not all(k in data for k in ("name", "email", "password")):
        return jsonify({"msg": "Missing fields"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already exists"}), 409

    hashed_pw = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    )

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_pw.decode("utf-8"),
        role=data.get("role", "user")  # default role
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201


# ================= LOGIN =================
@auth.route("/login", methods=["POST"])
def login():
    data = request.json

    if not all(k in data for k in ("email", "password")):
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        return jsonify({"msg": "Invalid credentials"}), 401

    if not bcrypt.checkpw(
        data["password"].encode("utf-8"),
        user.password.encode("utf-8")
    ):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify(access_token=token), 200


# ================= DASHBOARD =================
@auth.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    return jsonify({"msg": "Protected route accessed"}), 200


# ================= ADMIN CHECK =================
@auth.route("/admin-check", methods=["GET"])
@jwt_required()
def admin_only():
    claims = get_jwt()

    # ✅ safe role access
    if claims.get("role") != "admin":
        return jsonify({"msg": "Admins only"}), 403

    return jsonify({"msg": "Welcome Admin"}), 200
