from flask import Flask
from flask_cors import CORS

from models.models import db

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