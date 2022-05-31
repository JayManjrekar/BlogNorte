from flask import Blueprint, jsonify, request

from middleware.authentication import is_authenticated
from models.models import db, Tag, Post

tags = Blueprint("tags", __name__)


@tags.route("/", methods=["GET"])
def get_all_tags():
    tags = Tag.query.all()
    all_tags = []
    for tag in tags:
        tag = {"id": tag.id, "name": tag.name, "posts": len(tag.posts)}
        all_tags.append(tag)

    return jsonify(all_tags), 200


@tags.route("/<id>", methods=["GET"])
def get_tag_by_id(id):
    tag = Tag.query.filter_by(id=id).first()
    posts = []

    for post in tag.posts:
        post = {
            "id": post.id,
            "slug": post.slug,
            "title": post.title,
            "excerpt": post.excerpt,
            "date_posted": post.date_posted,
            "likes": post.likes,
        }

        posts.append(post)

    tag = {
        "id": tag.id,
        "name": tag.name,
        "posts": posts,
    }

    return jsonify(tag), 200


# is_admin!!!
@is_authenticated
@tags.route("/create", methods=["POST"])
def create_tag():
    tag = Tag(
        name=request.json["name"],
    )
    db.session.add(tag)
    db.session.commit()
    db.session.flush()
    return jsonify(tag), 201