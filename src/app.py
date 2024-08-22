from flask import Flask, render_template
from modules.music import music
from modules.drag import drag

app = Flask(__name__)
app.register_blueprint(music)
app.register_blueprint(drag)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
