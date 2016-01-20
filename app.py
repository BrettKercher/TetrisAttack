from flask import Flask, render_template, abort, request, jsonify
from models import db, User
import flask.ext.login as flask_login
import os
from forms import LoginForm

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

db.init_app(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def user_loader(email):
    return User.get_by_email(email)

@app.route('/')
def hello_world():
	return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        return redirect(url_for('index'))
    return render_template('login.html', form=form)

if __name__ == '__main__':
	app.run(host="0.0.0.0", port=8000)