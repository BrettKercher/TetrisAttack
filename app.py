import flask.ext.login as flask_login
import os

from flask import Flask, render_template, abort, request, jsonify, redirect, url_for, flash
from models import db, bcrypt, User
from forms import LoginForm, RegistrationForm
from flask_login import login_user, logout_user, login_required


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

bcrypt.init_app(app)

db.init_app(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def user_loader(email):
    return User.get_by_email(email)

@app.route('/')
def index():
	form = LoginForm()
	if form.validate_on_submit():
		login_user(form.user)
		next = request.args.get('next')
		return redirect(next or url_for('index'))
	return render_template('index.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		login_user(form.user)
		next = request.args.get('next')
		return redirect(next or url_for('index'))
	return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
	logout_user()
	return redirect(url_for('index'))

@app.route('/registration', methods=['GET', 'POST'])
def registration():
	form = RegistrationForm()
	if form.validate_on_submit():
		User.add_user(form.username.data, form.email.data, form.password.data)
		return redirect(url_for('index'))
	return render_template('registration.html', form=form)

@app.route('/play')
def play():
	return render_template('game.html')

if __name__ == '__main__':
	app.run(host="0.0.0.0", port=8000)