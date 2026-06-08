import os
from flask import Flask, jsonify
from flask_cors import CORS
#esto es nuevo para correos w
from flask_mail import Mail

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
from routes.clases import clase_bp
from routes.carrera_materia import carrera_materia_bp
from routes.clase_grupo import clase_grupo_bp
from routes.horarios import horarios_bp
from routes.inscripciones import inscripciones_bp
from routes.asistencias import asistencias_bp
#esto es nuevo para correos
from routes.activacion import activacion_bp

app = Flask(__name__)

CORS(app)

# ── Configuración Flask-Mail (Mailtrap) ── CAMBIO A UN SERVIDOR DE CORREO REAL PERO USANDO CORREO DE GMAIL
# ── Configuración Flask-Mail (Gmail producción) ──
app.config["MAIL_SERVER"]   = "smtp.gmail.com"
app.config["MAIL_PORT"]     = 587
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME", "cuentadeadmin03@gmail.com")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD", "tu_contraseña_aqui")
app.config["MAIL_USE_TLS"]  = True
app.config["MAIL_USE_SSL"]  = False

mail = Mail(app)
#termina aca

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
app.register_blueprint(clase_bp)
app.register_blueprint(carrera_materia_bp)
app.register_blueprint(clase_grupo_bp)
app.register_blueprint(horarios_bp)
app.register_blueprint(inscripciones_bp)
app.register_blueprint(activacion_bp)
app.register_blueprint(asistencias_bp)


@app.route("/")
def inicio():
    return jsonify({"mensaje": "Backend SAMI funcionando"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)