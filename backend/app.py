from flask import Flask, jsonify
from flask_cors import CORS

from routes.auth import auth_bp
from routes.usuarios import usuarios_bp
from routes.modalidades import modalidades_bp
from routes.tipos_programa import tipo_programa_bp
from routes.periodos import periodos_bp
from routes.tipos_ciclo import tipos_ciclo_bp
from routes.aulas import aulas_bp
from routes.ciclos import ciclo_bp
from routes.materias import materias_bp
from routes.carrera import carrera_bp
from routes.grupos import grupo_bp


app = Flask(__name__)

CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(materias_bp)
app.register_blueprint(modalidades_bp)
app.register_blueprint(tipo_programa_bp)
app.register_blueprint(periodos_bp)
app.register_blueprint(tipos_ciclo_bp)
app.register_blueprint(aulas_bp)
app.register_blueprint(ciclo_bp)
app.register_blueprint(carrera_bp)
app.register_blueprint(grupo_bp)


@app.route("/")
def inicio():
    return jsonify({
        "mensaje": "Backend SAMI funcionando"
    })

if __name__ == "__main__":
    app.run(debug=True)