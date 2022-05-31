from flask import Response, request, abort
from functools import wraps
import jwt

from models.models import User, Post


def is_authenticated(func):
    @wraps(func)
    def authorize(*args, **kwargs):
        token = request.headers.get("authorization")
        if not token:
            abort(Response("No authorization token", 401))
        try:
            data = jwt.decode(token.split(" ")[1], "TEMP_SECRET_KEY", algorithms=["HS256"])
        except:
            abort(Response("Invalid token signature", 401))
        user = User.query.filter_by(id=data["id"]).first()
        if not user:
            abort(Response("No associated user found", 401))

        return func(*args, **kwargs)

    return authorize


def is_author(func):
    @wraps(func)
    def authorize(*args, **kwargs):
        token = request.headers.get("authorization")
        if not token:
            abort(Response("No authorization token", 401))
        try:
            data = jwt.decode(token.split(" ")[1], "TEMP_SECRET_KEY", algorithms=["HS256"])
        except:
            abort(Response("Invalid token signature", 401))
        user = User.query.filter_by(id=data["id"]).first()

        if not user:
            abort(Response("No associated user found", 401))

        post_id = kwargs["id"]

        post = Post.query.filter_by(id=post_id).first()

        if not post.author == user.id:
            abort(Response("You are not the author of this post", 401))

        return func(*args, **kwargs)

    return authorize