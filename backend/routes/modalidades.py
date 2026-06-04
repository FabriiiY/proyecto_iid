from flask import Blueprint, request, jsonify
from database import get_connection

modalidades_bp = Blueprint("modalidades", __name__)

@modalidades_bp.route("/modalidades", methods=["GET"])
def obtener_modalidades():

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM modalidad
            ORDER BY nombre
        """)

        modalidades = cursor.fetchall()

        return jsonify({
            "success": True,
            "modalidades": modalidades
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:

        cursor.close()
        conexion.close()


@modalidades_bp.route("/modalidades", methods=["POST"])
def crear_modalidad():

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        sql = """
        INSERT INTO modalidad
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

        id_modalidad = cursor.lastrowid

        cursor.execute("""
            SELECT *
            FROM modalidad
            WHERE id_modalidad = %s
        """, (id_modalidad,))

        modalidad = cursor.fetchone()

        return jsonify({
            "success": True,
            "modalidad": modalidad
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:

        cursor.close()
        conexion.close()
        
@modalidades_bp.route("/modalidades/<int:id_modalidad>/estado", methods=["PUT"])
def cambiar_estado_modalidad(id_modalidad):

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            UPDATE modalidad
            SET estado = %s
            WHERE id_modalidad = %s
        """,
        (
            data["estado"],
            id_modalidad
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
        
