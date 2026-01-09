from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Employee

employees_bp = Blueprint("employees", __name__)

# ================= ADMIN CHECK =================
def admin_required():
    claims = get_jwt()
    return claims.get("role") == "admin"


# ================= GET EMPLOYEES (SEARCH + PAGINATION) =================
@employees_bp.route("/employees", methods=["GET"])
@jwt_required()
def get_employees():
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403

    page = request.args.get("page", 1, type=int)
    search = request.args.get("search", "", type=str)

    query = Employee.query

    if search:
        query = query.filter(Employee.name.like(f"%{search}%"))

    pagination = query.paginate(page=page, per_page=5)

    return jsonify({
        "employees": [
            {
                "id": e.id,
                "name": e.name,
                "email": e.email,
                "position": e.position
            } for e in pagination.items
        ],
        "totalPages": pagination.pages
    })


# ================= CREATE EMPLOYEE =================
@employees_bp.route("/employees", methods=["POST"])
@jwt_required()
def create_employee():
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403

    data = request.json

    emp = Employee(
        name=data["name"],
        email=data["email"],
        position=data["position"]
    )

    db.session.add(emp)
    db.session.commit()

    return jsonify({"msg": "Employee created"}), 201


# ================= UPDATE EMPLOYEE =================
@employees_bp.route("/employees/<int:id>", methods=["PUT"])
@jwt_required()
def update_employee(id):
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403

    emp = Employee.query.get_or_404(id)
    data = request.json

    emp.name = data.get("name", emp.name)
    emp.email = data.get("email", emp.email)
    emp.position = data.get("position", emp.position)

    db.session.commit()

    return jsonify({"msg": "Employee updated"})


# ================= DELETE EMPLOYEE =================
@employees_bp.route("/employees/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_employee(id):
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403

    emp = Employee.query.get_or_404(id)
    db.session.delete(emp)
    db.session.commit()

    return jsonify({"msg": "Employee deleted"})


# ================= DASHBOARD STATS =================
@employees_bp.route("/dashboard-stats", methods=["GET"])
@jwt_required()
def dashboard_stats():
    if not admin_required():
        return jsonify({"msg": "Admins only"}), 403

    total = Employee.query.count()

    return jsonify({
        "totalEmployees": total
    })
