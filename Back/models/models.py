from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass

db = SQLAlchemy()


@dataclass
class User(db.Model):
    __tablename__ = "users"
    id: int
    username: str
    firstname: str
    lastname: str
    github: str
    password: str
    posts: list

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    firstname = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)
    github = db.Column(db.String(20), unique=True, nullable=True)
    password = db.Column(db.String(20), nullable=False)
    posts = db.relationship("Post", backref="users", lazy=True)
    # keep track of user liked posts

    def __repr__(self):
        return f"User('{self.username}', '{self.firstname}', '{self.lastname}', '{self.github}', '{self.password}')"


tags_identifier = db.Table(
    "tags_identifier",
    db.Model.metadata,
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id")),
    db.Column("post_id", db.Integer, db.ForeignKey("posts.id")),
)


@dataclass
class Post(db.Model):
    __tablename__ = "posts"
    id: int
    slug: str
    author: int
    title: str
    excerpt: str
    content: str
    date_posted: str
    tags: list

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(150), unique=True, nullable=False)
    author = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    excerpt = db.Column(db.String(300), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    likes = db.Column(db.Integer, nullable=False, default=0)
    tags = db.relationship("Tag", secondary=tags_identifier, lazy="subquery", backref=db.backref("posts", lazy=True))

    def __repr__(self):
        return f"Post('{self.title}', '{self.author}', '{self.date_posted}')"


@dataclass
class Tag(db.Model):
    __tablename__ = "tags"
    id: int
    name: str

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    def __repr__(self):
        return f"Tag('{self.name}')"
