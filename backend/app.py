from flask import Flask, jsonify
from flask_cors import CORS

from routes.auth import auth_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(auth_bp)

@app.route("/")
def inicio():
    return jsonify({
        "mensaje": "Backend SAMI funcionando"
    })

if __name__ == "__main__":
    app.run(debug=True)