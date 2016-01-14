from app import app, db
from models import User

with app.app_context():
	db.create_all()
	admin = User('admin', 'admin@example.com')
	guest = User('guest', 'guest@example.com')
	db.session.add(admin)
	db.session.add(guest)
	db.session.commit()
	print("done")