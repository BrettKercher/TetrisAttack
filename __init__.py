from flask import Flask, render_template, abort, request, jsonify
from models import db
import flask.ext.login as flask_login


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

db.init_app(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

@app.route('/')
def hello_world():
	return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)