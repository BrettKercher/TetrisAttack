from app import app, db
from models import User

with app.app_context():
	db.drop_all()
	db.create_all()
	#admin = Users('admin', 'admin@example.com', 'password')
	#guest = User('guest', 'guest@example.com')
	#db.session.add(admin)
	#db.session.add(guest)
	db.session.commit()
	print("done")