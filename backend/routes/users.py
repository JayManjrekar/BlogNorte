from flask import Blueprint, jsonify
from datetime import datetime

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
    posts = []

    for post in user.posts:
        formatted_date = datetime.strftime(post.date_posted, "%b %d, %Y")
        post = {
            "id": post.id,
            "slug": post.slug,
            "title": post.title,
            "excerpt": post.excerpt,
            "date_posted": formatted_date,
            "likes": post.likes,
            "tags": post.tags,
        }

        posts.append(post)

    return jsonify(posts), 200