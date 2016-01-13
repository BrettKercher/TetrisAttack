from flask import Flask, render_template, abort, request, jsonify
#from models import db
#import flask.ext.login as flask_login
import os


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

#db.init_app(app)

#login_manager = flask_login.LoginManager()
#login_manager.init_app(app)

@app.route('/')
def hello_world():
	return render_template('index.html')

if __name__ == '__main__':
	app.run()