from flask import Blueprint, request, jsonify
from slugify import slugify

from middleware.authentication import is_authenticated
from models.models import Tag, db, Post, User

posts = Blueprint("posts", __name__)


@posts.route("/", methods=["GET"])
def get_posts():
    posts = Post.query.all()

    all_posts = []
    for post in posts:
        author = User.query.filter_by(id=post.author).first()
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
            "date_posted": post.date_posted,
            "likes": post.likes,
            "tags": post.tags,
        }
        all_posts.append(post_dict)

    return jsonify(all_posts), 200


@posts.route("/<slug>", methods=["GET"])
def get_post_by_slug(slug):
    post = Post.query.filter_by(slug=slug).first()
    return jsonify(post), 200


@posts.route("/<id>/likes", methods=["GET"])
def get_post_likes_by_id(id):
    post = Post.query.filter_by(id=id).first()
    return jsonify(post.likes), 200


@is_authenticated
@posts.route("/<id>/like", methods=["POST"])
def like_post_by_id(id):
    post = Post.query.filter_by(id=id).first()
    post.likes += 1
    db.session.commit()
    db.session.flush()
    return jsonify(post.likes), 200


@is_authenticated
@posts.route("/create", methods=["POST"])
def create_post():
    data = request.get_json()
    slug = slugify(data["title"])

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