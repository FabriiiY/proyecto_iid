from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash

from database import get_connection

usuarios_bp = Blueprint("usuarios", __name__)

@usuarios_bp.route("/usuarios", methods=["POST"])
def crear_usuario():

    data = request.get_json()

    try:

        password_hash = generate_password_hash(
            data["password"]
        )

        conexion = get_connection()
        cursor = conexion.cursor()

        sql = """
        INSERT INTO usuario(
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        fecha_nacimiento,
        sexo,
        correo_personal,
        correo_institucional,
        telefono_movil,
        telefono_fijo,
        direccion,
        dui,
        dui_tipo,
        carnet,
        carnet_minoridad,
        foto_perfil,
        password_hash,
        estado,
        fecha_ingreso,
        id_rol
        )
        VALUES(
        %s,%s,%s,%s,
        %s,%s,%s,%s,
        %s,%s,%s,%s,
        %s,%s,%s,%s,
        %s,%s,
        CURDATE(),
        %s
    )
        """

        valores = (
            data["primer_nombre"],
            data.get("segundo_nombre"),
            data["primer_apellido"],
            data.get("segundo_apellido"),

            data["fecha_nacimiento"],
            data["sexo"],

            data["correo_personal"],
            data["correo_institucional"],

            data["telefono_movil"],
            data.get("telefono_fijo") or None,

            data["direccion"],

            data["dui"],

            data["dui_tipo"],

            data["carnet"],

            data.get("carnet_minoridad") or None,

            data.get("foto_perfil"),

            password_hash,

            "ACTIVO",

            data["id_rol"]
        )

        cursor.execute(sql, valores)

        conexion.commit()

        return jsonify({
            "success": True,
            "mensaje": "Usuario registrado correctamente"
        })

    except Exception as e:
        error = str(e)
        
        if "dui" in error.lower():
            mensaje = "El DUI ya existe"
            
        elif "carnet" in error.lower():
            mensaje = "El carnet ya existe"

        elif "correo_institucional" in error.lower():
            mensaje = "El correo institucional ya existe"

        else:
            mensaje = error

        return jsonify({
            "success": False,
            "mensaje": mensaje
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()
            
@usuarios_bp.route("/usuarios", methods=["GET"])
def obtener_usuarios():

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
            fecha_nacimiento,
            sexo,
            correo_personal,
            correo_institucional,
            telefono_movil,
            telefono_fijo,
            direccion,
            dui,
            dui_tipo,
            foto_perfil,
            carnet,
            carnet_minoridad,
            estado,
            fecha_ingreso,
            fecha_actualizacion,
            id_rol
            FROM usuario
            ORDER BY primer_nombre
        """

        cursor.execute(sql)

        usuarios = cursor.fetchall()

        return jsonify({
            "success": True,
            "usuarios": usuarios
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conexion:
            conexion.close()
            
@usuarios_bp.route("/usuarios/<int:id_usuario>", methods=["PUT"])
def actualizar_usuario(id_usuario):

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        sql = """
        UPDATE usuario
        SET
            primer_nombre=%s,
            segundo_nombre=%s,
            primer_apellido=%s,
            segundo_apellido=%s,
            fecha_nacimiento=%s,
            sexo=%s,
            correo_personal=%s,
            correo_institucional=%s,
            telefono_movil=%s,
            telefono_fijo=%s,
            direccion=%s,
            dui=%s,
            dui_tipo=%s,
            carnet=%s,
            carnet_minoridad=%s,
            id_rol=%s
        WHERE id_usuario=%s
        """

        valores = (
            data["primer_nombre"],
            data.get("segundo_nombre"),
            data["primer_apellido"],
            data.get("segundo_apellido"),

            data["fecha_nacimiento"],
            data["sexo"],

            data["correo_personal"],
            data["correo_institucional"],

            data["telefono_movil"],
            data.get("telefono_fijo") or None,

            data["direccion"],

            data["dui"],
            data["dui_tipo"],

            data["carnet"],
            data.get("carnet_minoridad") or None,

            data["id_rol"],

            id_usuario
        )

        cursor.execute(sql, valores)

        conexion.commit()

        return jsonify({
            "success": True,
            "mensaje": "Usuario actualizado correctamente"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "mensaje": str(e)
        }), 500

    finally:

        cursor.close()
        conexion.close()
        
@usuarios_bp.route("/usuarios/<int:id_usuario>/estado", methods=["PUT"])
def cambiar_estado_usuario(id_usuario):

    try:

        data = request.get_json()

        conexion = get_connection()
        cursor = conexion.cursor()

        sql = """
        UPDATE usuario
        SET estado = %s
        WHERE id_usuario = %s
        """

        cursor.execute(
            sql,
            (
                data["estado"],
                id_usuario
            )
        )

        conexion.commit()

        return jsonify({
            "success": True,
            "mensaje": "Estado actualizado"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "mensaje": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conexion:
            conexion.close()
            
