from flask_sqlalchemy import SQLAlchemy
import flask.ext.login as flask_login

db = SQLAlchemy()

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True)
	email = db.Column(db.String(120), unique=True)
	password = db.Column(db.String)
	password = db.Column(db.String)
	authenticated = db.Column(db.Boolean, default=False)
	active = db.Column(db.Boolean, default=False)

	def __init__(self, username, email, password):
		self.username = username
		self.email = email
		self.password = password
		self.active = True
		self.authenticated = True

	def __repr__(self):
		return '<User %r>' % self.username

	def is_active(self):
		return self.active

	def get_id(self):
		return self.email

	def is_authenticated(self):
		return self.authenticated

	def is_anonymous(self):
		return False

	@staticmethod
	def get_by_email(email):
		return User.query.filter_by(email=email).first()

	@staticmethod
	def get_by_name(name):
		return User.query.filter_by(username=name).first()