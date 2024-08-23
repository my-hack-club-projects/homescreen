from flask import Flask, render_template
from modules.music import music
from modules.db import db

app = Flask(__name__)
app.register_blueprint(db)
app.register_blueprint(music)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
