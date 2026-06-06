from flask import Blueprint, request, jsonify
from database import get_connection

materias_bp = Blueprint("materias", __name__)


@materias_bp.route("/materias", methods=["POST"])
def crear_materia():

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        sql = """
        INSERT INTO materia(
            nombre,
            horas_teoricas,
            horas_practicas,
            unidades_valorativas,
            descripcion,
            estado
        )
        VALUES(
            %s,%s,%s,%s,%s,%s
        )
        """

        valores = (
            data["nombre"],
            data["horas_teoricas"],
            data["horas_practicas"],
            data["unidades_valorativas"],
            data.get("descripcion"),
            data["estado"]
        )

        cursor.execute(sql, valores)

        conexion.commit()

        return jsonify({
            "success": True,
            "mensaje": "Materia registrada correctamente"
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
            
            
@materias_bp.route("/materias", methods=["GET"])
def obtener_materias():

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        sql = """
        SELECT *
        FROM materia
        ORDER BY nombre
        """

        cursor.execute(sql)

        materias = cursor.fetchall()

        return jsonify({
            "success": True,
            "materias": materias
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

# ─────────────────────────────────────────────
# GET: materias activas (para selects)
# DEBE ir ANTES de /materias/<int:id_materia>
# ─────────────────────────────────────────────
@materias_bp.route("/materias/activas", methods=["GET"])
def obtener_materias_activas():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT id_materia, nombre
            FROM materia
            WHERE estado = 'ACTIVA'
            ORDER BY nombre ASC
        """)

        materias = cursor.fetchall()

        return jsonify({
            "success": True,
            "materias": materias
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


@materias_bp.route("/materias/<int:id_materia>", methods=["PUT"])
def actualizar_materia(id_materia):

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        sql = """
        UPDATE materia
        SET
            nombre = %s,
            horas_teoricas = %s,
            horas_practicas = %s,
            unidades_valorativas = %s,
            descripcion = %s,
            estado = %s
        WHERE id_materia = %s
        """

        cursor.execute(
            sql,
            (
                data["nombre"],
                data["horas_teoricas"],
                data["horas_practicas"],
                data["unidades_valorativas"],
                data["descripcion"],
                data["estado"],
                id_materia
            )
        )

        conexion.commit()

        return jsonify({
            "success": True,
            "mensaje": "Materia actualizada correctamente"
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


@materias_bp.route("/materias/<int:id_materia>/estado", methods=["PUT"])
def cambiar_estado_materia(id_materia):

    try:

        data = request.get_json()

        conexion = get_connection()
        cursor = conexion.cursor()

        sql = """
        UPDATE materia
        SET estado = %s
        WHERE id_materia = %s
        """

        cursor.execute(
            sql,
            (
                data["estado"],
                id_materia
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
