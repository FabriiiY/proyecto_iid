from flask import Blueprint, request, jsonify
from database import get_connection

tipos_ciclo_bp = Blueprint("tipos_ciclo", __name__)

@tipos_ciclo_bp.route("/tipos-ciclo", methods=["GET"])
def obtener_tipos_ciclo():

    conexion = None
    cursor = None
    
    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM tipo_ciclo
            ORDER BY nombre
        """)

        tipos = cursor.fetchall()

        return jsonify({
            "success": True,
            "tipos": tipos
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
        
@tipos_ciclo_bp.route("/tipos-ciclo", methods=["POST"])
def crear_tipo_ciclo():
    
    conexion = None
    cursor = None

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            INSERT INTO tipo_ciclo
            (
                nombre,
                descripcion
            )
            VALUES
            (
                %s,
                %s
            )
        """,
        (
            data["nombre"],
            data.get("descripcion")
        ))

        conexion.commit()

        id_tipo_ciclo = cursor.lastrowid

        cursor.execute("""
            SELECT *
            FROM tipo_ciclo
            WHERE id_tipo_ciclo = %s
        """, (id_tipo_ciclo,))

        tipo = cursor.fetchone()

        return jsonify({
            "success": True,
            "tipo": tipo
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

@tipos_ciclo_bp.route("/tipos-ciclo/<int:id_tipo_ciclo>", methods=["PUT"])
def actualizar_tipo_ciclo(id_tipo_ciclo):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            UPDATE tipo_ciclo
            SET nombre = %s,
                descripcion = %s,
                estado = %s
            WHERE id_tipo_ciclo = %s
        """, (
            data["nombre"],
            data.get("descripcion"),
            data["estado"],
            id_tipo_ciclo
        ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()