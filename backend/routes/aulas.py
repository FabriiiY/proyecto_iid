from flask import Blueprint, request, jsonify
from database import get_connection

aulas_bp = Blueprint("aulas", __name__)

@aulas_bp.route("/aulas", methods=["GET"])
def obtener_aulas():

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM aula
            ORDER BY codigo_aula
        """)

        aulas = cursor.fetchall()

        return jsonify({
            "success": True,
            "aulas": aulas
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:

        cursor.close()
        conexion.close()

@aulas_bp.route("/aulas", methods=["POST"])
def crear_aula():

    data = request.get_json()
    conexion = None
    cursor = None

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            INSERT INTO aula
            (
                codigo_aula,
                edificio,
                nivel,
                descripcion,
                capacidad
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """,
        (
            data["codigo_aula"],
            data["edificio"],
            data["nivel"],
            data.get("descripcion"),
            data["capacidad"]
        ))

        conexion.commit()

        return jsonify({
            "success": True
        })

    except Exception as e:
        error = str(e)

        if "codigo_aula" in error.lower():
            mensaje = "El código de aula ya está registrado."
        else:
            mensaje = "Ocurrió un error al registrar el aula."

        return jsonify({
            "success": False,
            "mensaje": mensaje
        })

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()
        
@aulas_bp.route("/aulas/activas", methods=["GET"])
def obtener_aulas_activas():

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT id_aula, codigo_aula, edificio, nivel, capacidad
            FROM aula
            WHERE estado = 'ACTIVO'
            ORDER BY edificio, codigo_aula
        """)

        aulas = cursor.fetchall()

        return jsonify({"success": True, "aulas": aulas})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        cursor.close()
        conexion.close()
        
@aulas_bp.route("/aulas/<int:id_aula>", methods=["PUT"])
def actualizar_aula(id_aula):

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        if "estado" in data:

            cursor.execute("""
                UPDATE aula
                SET estado = %s
                WHERE id_aula = %s
            """,
            (
                data["estado"],
                id_aula
            ))

        else:

            cursor.execute("""
                UPDATE aula
                SET
                    codigo_aula = %s,
                    edificio = %s,
                    nivel = %s,
                    descripcion = %s,
                    capacidad = %s
                WHERE id_aula = %s
            """,
            (
                data["codigo_aula"],
                data["edificio"],
                data["nivel"],
                data.get("descripcion"),
                data["capacidad"],
                id_aula
            ))

        conexion.commit()

        return jsonify({
            "success": True
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:

        cursor.close()
        conexion.close()

