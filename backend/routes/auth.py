from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from database import get_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():

    data = request.get_json()

    correo = data.get("correo").strip().lower()
    password = data.get("password")

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        sql = """
        SELECT
            id_usuario,
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            correo_institucional,
            password_hash,
            id_rol,
            foto_perfil,
            carnet,
            estado
        FROM usuario
        WHERE correo_institucional = %s
        """

        cursor.execute(sql, (correo,))
        usuario = cursor.fetchone()
        
        if not usuario:
            return jsonify({"success": False, "mensaje": "VERIFICA QUE TU CORREO Y/O CONTRASEÑA SEAN VALIDOS"})

        if usuario["estado"] != "ACTIVO":
            return jsonify({"success": False, "mensaje": "Tu cuenta no está activa. Contacta al administrador."})

        if not check_password_hash(usuario["password_hash"], password):
            return jsonify({"success": False, "mensaje": "VERIFICA QUE TU CORREO Y/O CONTRASEÑA SEAN VALIDOS"})


        return jsonify({
        "success": True,
        "usuario": {
            "id": usuario["id_usuario"],

            "nombre": usuario["primer_nombre"],
            "apellido": usuario["primer_apellido"],

            "primer_nombre": usuario["primer_nombre"],
            "segundo_nombre": usuario["segundo_nombre"],

            "primer_apellido": usuario["primer_apellido"],
            "segundo_apellido": usuario["segundo_apellido"],

            "correo": usuario["correo_institucional"],

            "rol": usuario["id_rol"],

            "foto_perfil": usuario["foto_perfil"],
            "carnet": usuario["carnet"],
            "estado": usuario["estado"]
            }
        })

    except Exception as e:
        import traceback
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500
        