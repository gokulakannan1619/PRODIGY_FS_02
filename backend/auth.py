from flask import Blueprint, request, jsonify
from models import User, db
from flask_jwt_extended import create_access_token, jwt_required
import bcrypt

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed_pw = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())
    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_pw
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully"})

@auth.route("/login", methods=["POST"])
def login():
    user = User.query.filter_by(email=request.json["email"]).first()
    if user and bcrypt.checkpw(
        request.json["password"].encode(), user.password.encode()
    ):
        token = create_access_token(identity=str(user.id))

    return jsonify(access_token=token)
    return jsonify({"msg": "Invalid credentials"}), 401

@auth.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    return jsonify({"msg": "Protected route accessed"})
