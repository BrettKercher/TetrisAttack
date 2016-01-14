from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username

class Trainers(db.Model):
	__tablename__ = "ALL_TRAINERS"

	ID = db.Column(db.Integer, primary_key=True)
	TRAINER_NAME = db.Column(db.VARCHAR(50))
	TRAINER_GEN = db.Column(db.VARCHAR(50))
	TRAINER_ROUTE_NAME = db.Column(db.VARCHAR(50))
	TRAINER_POKEMON = db.Column(db.VARCHAR(50))
	TRAINER_LEVEL = db.Column(db.VARCHAR(50))

	def __init__(self, name, gen, route, pokemon, level):
		self.TRAINER_NAME = name
		self.TRAINER_GEN = gen
		self.TRAINER_ROUTE = route
		self.TRAINER_POKEMON = pokemon
		self.TRAINER_LEVEL = level