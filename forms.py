from models import User
from flask.ext.wtf import Form
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired

class LoginForm(Form):
	email = StringField('Email', validators=[DataRequired()])
	password = PasswordField('Password', validators=[DataRequired()])

	def __init__(self, *args, **kwargs):
		Form.__init__(self, *args, **kwargs)
		self.user = None

	def validate(self):
		rv = Form.validate(self)
		if not rv:
			return False
		user = User.get_by_email(self.email.data)
		if user is None:
			self.email.errors.append('Unknown email')
			return False
		if not user.check_password(self.password.data):
			self.password.errors.append('Invalid password')
			return False
		self.user = user
		return True