from flask import Blueprint, request, jsonify
from database import get_connection

carrera_bp = Blueprint("carrera", __name__)

# ─────────────────────────────────────────────
# GET: todas las carreras
# ─────────────────────────────────────────────
@carrera_bp.route("/carreras", methods=["GET"])
def obtener_carreras():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                c.*,
                tp.nombre AS tipo_programa_nombre
            FROM carrera c
            INNER JOIN tipo_programa tp
                ON c.id_tipo_programa = tp.id_tipo_programa
            ORDER BY c.nombre ASC
        """)

        carreras = cursor.fetchall()

        for c in carreras:
            if c["fecha_actualizacion"]:
                c["fecha_actualizacion"] = c["fecha_actualizacion"].strftime("%Y-%m-%d %H:%M:%S")

        return jsonify({
            "success": True,
            "carreras": carreras
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


# ─────────────────────────────────────────────
# POST: crear carrera
# ─────────────────────────────────────────────
@carrera_bp.route("/carreras", methods=["POST"])
def crear_carrera():

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            INSERT INTO carrera
            (
                codigo_carrera,
                nombre,
                descripcion,
                estado,
                id_tipo_programa
            )
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data["codigo_carrera"],
            data["nombre"],
            data.get("descripcion"),
            data.get("estado", "ACTIVO"),
            data["id_tipo_programa"]
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
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


# ─────────────────────────────────────────────
# PUT: actualizar carrera completa o solo estado
# ─────────────────────────────────────────────
@carrera_bp.route("/carreras/<int:id_carrera>", methods=["PUT"])
def actualizar_carrera(id_carrera):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        # SOLO estado
        if len(data) == 1 and "estado" in data:

            cursor.execute("""
                UPDATE carrera
                SET estado = %s
                WHERE id_carrera = %s
            """, (
                data["estado"],
                id_carrera
            ))

        else:

            cursor.execute("""
                UPDATE carrera
                SET
                    codigo_carrera = %s,
                    nombre = %s,
                    descripcion = %s,
                    id_tipo_programa = %s
                WHERE id_carrera = %s
            """, (
                data["codigo_carrera"],
                data["nombre"],
                data.get("descripcion"),
                data["id_tipo_programa"],
                id_carrera
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
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()
            
@carrera_bp.route("/carreras/activas", methods=["GET"])
def obtener_carreras_activas():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT c.*, tp.nombre AS tipo_programa_nombre
            FROM carrera c
            INNER JOIN tipo_programa tp
                ON c.id_tipo_programa = tp.id_tipo_programa
            WHERE c.estado = 'ACTIVO'
            ORDER BY c.nombre ASC
        """)

        carreras = cursor.fetchall()

        return jsonify({
            "success": True,
            "carreras": carreras
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()