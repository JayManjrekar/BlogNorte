from flask import Blueprint, request, jsonify, make_response
import bcrypt
import jwt
from middleware.authentication import is_authenticated

from models.models import db, User

auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["POST"])
def register():
    # form validation??
    data = request.get_json()
    username, password, firstname, lastname = (
        data["username"],
        data["password"],
        data["firstname"],
        data["lastname"],
    )

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"field": "username", "message": "Username already exists"}), 422

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user = User(username=username, password=hashed_password, firstname=firstname, lastname=lastname)

    db.session.add(user)
    db.session.commit()
    db.session.flush()

    return jsonify({"message": "User created successfully"}), 201


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username, password = data["username"], data["password"]

    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"field": "username", "message": "User does not exist"}), 422

    if bcrypt.checkpw(password.encode("utf-8"), user.password):
        token = jwt.encode({"id": user.id, "username": user.username}, "TEMP_SECRET_KEY", algorithm="HS256")

        res = make_response(
            {
                "message": "User logged in successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "firstname": user.firstname,
                    "lastname": user.lastname,
                    "github": user.github,
                },
                "token": token,
            }
        )

        res.set_cookie(
            "token",
            token,
            httponly=True,
            samesite="Strict",
            max_age=36000000,
            secure=False,
        )

        return res, 200
    else:
        return jsonify({"field": "password", "message": "Incorrect password"}), 422


@auth.route("/logout", methods=["GET"])
@is_authenticated
def logout():
    res = make_response({"message": "User logged out successfully"})
    res.set_cookie("token", "", httponly=True, samesite="Strict", max_age=0, secure=False)
    return res, 200


@auth.route("/user", methods=["GET"])
def get_user():
    token = request.headers.get("authorization")
    if not token:
        return jsonify({"message": "No token provided"}), 400
    try:
        data = jwt.decode(token.split(" ")[1], "TEMP_SECRET_KEY", algorithms=["HS256"])
    except:
        return jsonify({"message": "Invalid token"}), 400
    user = User.query.filter_by(id=data["id"]).first()
    if not user:
        return jsonify({"message": "User does not exist"}), 400
    return (
        jsonify(
            {
                "id": user.id,
                "username": user.username,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "github": user.github,
            }
        ),
        200,
    )