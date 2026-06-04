from flask import Flask, jsonify
from flask_cors import CORS

from routes.auth import auth_bp
from routes.usuarios import usuarios_bp
from routes.modalidades import modalidades_bp
from routes.tipos_programa import tipo_programa_bp

from routes.materias import materias_bp


app = Flask(__name__)

CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(materias_bp)
app.register_blueprint(modalidades_bp)
app.register_blueprint(tipo_programa_bp)

@app.route("/")
def inicio():
    return jsonify({
        "mensaje": "Backend SAMI funcionando"
    })

if __name__ == "__main__":
    app.run(debug=True)