from flask import request, abort
from functools import wraps
import jwt
from models.models import User


def is_authenticated(func):
    @wraps(func)
    def authorize(*args, **kwargs):
        token = request.headers.get("authorization")
        if not token:
            abort(401)
        try:
            print(token.split(" ")[1])
            data = jwt.decode(token.split(" ")[1], "TEMP_SECRET_KEY", algorithms=["HS256"])
        except:
            abort(401)
        user = User.query.filter_by(id=data["id"]).first()
        if not user:
            abort(401)

        return func(*args, **kwargs)

    return authorize

def is_author(func):
    @wraps(func)
    def authorize(*args, **kwargs):
        token = request.headers.get("authorization")
        if not token:
            abort(401)
        try:
            print(token.split(" ")[1])
            data = jwt.decode(token.split(" ")[1], "TEMP_SECRET_KEY", algorithms=["HS256"])
        except:
            abort(401)
        user = User.query.filter_by(id=data["id"]).first()

        if not user:
            abort(401)

        data = request.get_json()
        post_id = data["post_id"]

        post = user.posts.filter_by(id=post_id).first()

        if not post:
            abort(401)

        return func(*args, **kwargs)

    return authorize