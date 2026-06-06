from flask import Blueprint, request, jsonify
from database import get_connection

carrera_materia_bp = Blueprint("carrera_materia", __name__)

# ─────────────────────────────────────────────
# GET: todas las asignaciones
# ─────────────────────────────────────────────
@carrera_materia_bp.route("/carrera_materias", methods=["GET"])
def obtener_carrera_materias():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                cm.*,
                c.nombre  AS carrera_nombre,
                m.nombre  AS materia_nombre
            FROM carrera_materia cm
            INNER JOIN carrera c ON cm.id_carrera = c.id_carrera
            INNER JOIN materia  m ON cm.id_materia = m.id_materia
            ORDER BY c.nombre ASC, cm.numero_correlativo ASC
        """)

        registros = cursor.fetchall()

        return jsonify({
            "success": True,
            "carrera_materias": registros
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# POST: crear asignación
# ─────────────────────────────────────────────
@carrera_materia_bp.route("/carrera_materias", methods=["POST"])
def crear_carrera_materia():

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        # Verificar que el correlativo no esté usado en esa carrera
        cursor.execute("""
            SELECT id_carrera_materia FROM carrera_materia
            WHERE id_carrera = %s AND numero_correlativo = %s
        """, (data["id_carrera"], data["numero_correlativo"]))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "error": "Ese número correlativo ya está usado en esta carrera."
            })

        cursor.execute("""
            INSERT INTO carrera_materia
                (id_carrera, id_materia, numero_correlativo, estado)
            VALUES (%s, %s, %s, %s)
        """, (
            data["id_carrera"],
            data["id_materia"],
            data["numero_correlativo"],
            data.get("estado", "ACTIVO")
        ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# PUT: actualizar correlativo o solo estado
# ─────────────────────────────────────────────
@carrera_materia_bp.route("/carrera_materias/<int:id_carrera_materia>", methods=["PUT"])
def actualizar_carrera_materia(id_carrera_materia):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        # SOLO estado
        if len(data) == 1 and "estado" in data:
            cursor.execute("""
                UPDATE carrera_materia
                SET estado = %s
                WHERE id_carrera_materia = %s
            """, (data["estado"], id_carrera_materia))

        else:
    # Verificar que el correlativo no esté usado en esa carrera (excluyendo el registro actual)
            cursor.execute("""
                SELECT id_carrera_materia FROM carrera_materia
                WHERE id_carrera = (
                    SELECT id_carrera FROM carrera_materia
                    WHERE id_carrera_materia = %s
                )
                AND numero_correlativo = %s
                AND id_carrera_materia != %s
            """, (id_carrera_materia, data["numero_correlativo"], id_carrera_materia))

            if cursor.fetchone():
                return jsonify({
                    "success": False,
                    "error": "Ese número correlativo ya está usado en esta carrera."
                })

            cursor.execute("""
                UPDATE carrera_materia
                SET numero_correlativo = %s
                WHERE id_carrera_materia = %s
            """, (data["numero_correlativo"], id_carrera_materia))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()