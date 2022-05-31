from time import clock_getres
from flask import Blueprint, request, jsonify
from slugify import slugify
from datetime import datetime

from middleware.authentication import is_authenticated, is_author
from models.models import Tag, db, Post, User

posts = Blueprint("posts", __name__)


@posts.route("/", methods=["GET"])
def get_posts():
    posts = Post.query.all()

    all_posts = []
    for post in posts:
        author = User.query.filter_by(id=post.author).first()
        formatted_date = datetime.strftime(post.date_posted, "%b %d, %Y")
        post_dict = {
            "id": post.id,
            "slug": post.slug,
            "author": {
                "id": author.id,
                "username": author.username,
                "firstname": author.firstname,
                "lastname": author.lastname,
            },
            "title": post.title,
            "excerpt": post.excerpt,
            "date_posted": formatted_date,
            "likes": post.likes,
            "tags": post.tags,
        }
        all_posts.append(post_dict)

    return jsonify(all_posts), 200


@posts.route("/<slug>", methods=["GET"])
def get_post_by_slug(slug):
    post = Post.query.filter_by(slug=slug).first()
    author = User.query.filter_by(id=post.author).first()

    formatted_date = datetime.strftime(post.date_posted, "%b %d, %Y")

    expanded_post = {
        "id": post.id,
        "slug": post.slug,
        "author": {
            "id": author.id,
            "username": author.username,
            "firstname": author.firstname,
            "lastname": author.lastname,
            "github": author.github,
        },
        "title": post.title,
        "excerpt": post.excerpt,
        "content": post.content,
        "date_posted": formatted_date,
        "likes": post.likes,
        "tags": post.tags,
    }

    return jsonify(expanded_post), 200


@posts.route("/<id>/likes", methods=["GET"])
def get_post_likes_by_id(id):
    post = Post.query.filter_by(id=id).first()
    return jsonify(post.likes), 200


@posts.route("/<id>/like", methods=["POST"])
@is_authenticated
def like_post_by_id(id):
    post = Post.query.filter_by(id=id).first()
    post.likes += 1
    db.session.commit()
    db.session.flush()
    return jsonify(post.likes), 200


@posts.route("/delete/<id>", methods=["DELETE"])
@is_author
def delete_post_by_id(id):
    post = Post.query.filter_by(id=id).first()
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted successfully"}), 200


@posts.route("/update/<id>", methods=["PUT"])
@is_author
def update_post_by_id(id):
    data = request.get_json()
    print(data["tags"])

    slug = slug = slugify(data["title"])

    exists = Post.query.filter_by(slug=slug).first()
    if exists:
        return jsonify({"field": "title", "message": "A post with this title already exists"}), 422

    post = Post.query.filter_by(id=id).first()

    tags = []

    for tag in data["tags"]:
        tag = Tag.query.filter_by(id=tag).first()
        tags.append(tag)

    post.title = data["title"]
    post.excerpt = data["excerpt"]
    post.content = data["content"]
    post.tags = tags
    db.session.commit()
    return jsonify({"message": "Post updated successfully"}), 200


@posts.route("/getForUpdate/<id>", methods=["GET"])
@is_author
def get_post_for_update(id):
    post = Post.query.filter_by(id=id).first()

    expanded_post = {
        "id": post.id,
        "slug": post.slug,
        "title": post.title,
        "excerpt": post.excerpt,
        "content": post.content,
        "tags": post.tags,
    }

    return jsonify(expanded_post), 200


@posts.route("/create", methods=["POST"])
@is_authenticated
def create_post():
    data = request.get_json()
    print(data)
    slug = slugify(data["title"])

    exists = Post.query.filter_by(slug=slug).first()
    if exists:
        return jsonify({"field": "title", "message": "A post with this title already exists"}), 422

    tags = []

    for tag in data["tags"]:
        tag = Tag.query.filter_by(id=tag).first()
        tags.append(tag)

    post = Post(
        slug=slug,
        title=request.json["title"],
        excerpt=request.json["excerpt"],
        content=request.json["content"],
        author=request.json["author"],
        tags=tags,
    )
    db.session.add(post)
    db.session.commit()
    db.session.flush()
    return jsonify(post), 201