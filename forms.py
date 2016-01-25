from models import User
from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email


class LoginForm(Form):
	email = StringField('Email', validators=[DataRequired(), Email()])
	password = PasswordField('Password', validators=[DataRequired()])
	submit = SubmitField('Log In')

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


class RegistrationForm(Form):
	email = StringField('Email', validators=[DataRequired(), Email()])
	confirm_email = StringField('Confirm Email', validators=[DataRequired(), Email()])
	password = PasswordField('Password', validators=[DataRequired()])
	confirm_password = PasswordField('Confirm Password', validators=[DataRequired()])
	username = StringField('Username', validators=[DataRequired()])
	submit = SubmitField('Submit')

	def __init__(self, *args, **kwargs):
		Form.__init__(self, *args, **kwargs)
		self.user = None

	def validate(self):
		rv = Form.validate(self)
		if not rv:
			return False

		if self.email.data != self.confirm_email.data:
			self.confirm_email.errors.append('Emails do not match')
			return False
		if self.password.data != self.confirm_password.data:
			self.confirm_password.errors.append('Passwords do not match')
			return False

		#self.user = User(self.username.data, self.email.data, self.password.data)
		
		return True