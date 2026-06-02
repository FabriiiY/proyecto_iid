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
            
