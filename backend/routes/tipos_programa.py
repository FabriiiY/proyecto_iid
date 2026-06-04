from flask import Blueprint, request, jsonify
from database import get_connection

tipo_programa_bp = Blueprint("tipo_programa", __name__)

@tipo_programa_bp.route("/tipos-programa", methods=["GET"])
def obtener_tipo_programa():

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM tipo_programa
            ORDER BY nombre
        """)

        tipo_programa = cursor.fetchall()

        return jsonify({
            "success": True,
            "tipos": tipo_programa
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:

        cursor.close()
        conexion.close()

@tipo_programa_bp.route("/tipos-programa", methods=["POST"])
def crear_tipo_programa():

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        sql = """
        INSERT INTO tipo_programa
        (
            nombre,
            descripcion
        )
        VALUES
        (
            %s,
            %s
        )
        """

        cursor.execute(
            sql,
            (
                data["nombre"],
                data.get("descripcion")
            )
        )

        conexion.commit()

        id_tipo_programa = cursor.lastrowid

        cursor.execute("""
            SELECT *
            FROM tipo_programa
            WHERE id_tipo_programa = %s
        """, (id_tipo_programa,))

        tipo_programa = cursor.fetchone()

        return jsonify({
            "success": True,
            "tipo": tipo_programa
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:

        cursor.close()
        conexion.close()

@tipo_programa_bp.route("/tipos-programa/<int:id_tipo_programa>/estado", methods=["PUT"])
def cambiar_estado_tipo_programa(id_tipo_programa):

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            UPDATE tipo_programa
            SET estado = %s
            WHERE id_tipo_programa = %s
        """,
        (
            data["estado"],
            id_tipo_programa
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