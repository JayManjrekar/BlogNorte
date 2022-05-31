from flask import Flask
from flask_cors import CORS

from Back.models.models import db

from routes.auth import auth
from routes.posts import posts
from routes.users import users
from routes.tags import tags

app = Flask(__name__)


app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "sqlite:///database.db"  # needs to be hosted db for prod (https://supabase.com/)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
CORS(app, resources={r"/*": {"origins": "*"}})

db.init_app(app)

app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(posts, url_prefix="/posts")
app.register_blueprint(users, url_prefix="/users")
app.register_blueprint(tags, url_prefix="/tags")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)