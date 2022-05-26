from flask import Blueprint, jsonify

from middleware.authentication import is_authenticated
from models.models import db, User

users = Blueprint("users", __name__)


@users.route("/<id>", methods=["GET"])
def get_user_by_id(id):
    user = User.query.filter_by(id=id).first()
    print(user)

    user = {
        "id": user.id,
        "username": user.username,
    }

    return jsonify(user), 200


@users.route("/<id>/posts", methods=["GET"])
def get_posts_by_user_id(id):
    user = User.query.filter_by(id=id).first()
    return jsonify(user.posts), 200
