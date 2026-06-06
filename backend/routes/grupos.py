from flask import Blueprint, request, jsonify
from database import get_connection

grupo_bp = Blueprint("grupo", __name__)

# ─────────────────────────────────────────────
# GET: todos los grupos
# ─────────────────────────────────────────────
@grupo_bp.route("/grupos", methods=["GET"])
def obtener_grupos():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                g.*,
                c.nombre  AS ciclo_nombre,
                ca.nombre AS carrera_nombre
            FROM grupo g
            INNER JOIN ciclo   c  ON g.id_ciclo   = c.id_ciclo
            INNER JOIN carrera ca ON g.id_carrera  = ca.id_carrera
            ORDER BY g.nombre_grupo ASC
        """)

        grupos = cursor.fetchall()

        for g in grupos:
            if g.get("fecha_actualizacion"):
                g["fecha_actualizacion"] = g["fecha_actualizacion"].strftime("%Y-%m-%d %H:%M:%S")

        return jsonify({
            "success": True,
            "grupos": grupos
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# POST: crear grupo
# ─────────────────────────────────────────────
@grupo_bp.route("/grupos", methods=["POST"])
def crear_grupo():

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            INSERT INTO grupo
            (nombre_grupo, limite_estudiantes, id_ciclo, id_carrera, descripcion, estado)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data["nombre_grupo"],
            data["limite_estudiantes"],
            data["id_ciclo"],
            data["id_carrera"],
            data.get("descripcion"),
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
# PUT: actualizar grupo completo o solo estado
# ─────────────────────────────────────────────
@grupo_bp.route("/grupos/<int:id_grupo>", methods=["PUT"])
def actualizar_grupo(id_grupo):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        # SOLO estado (botón activar/desactivar)
        if len(data) == 1 and "estado" in data:
            cursor.execute("""
                UPDATE grupo
                SET estado = %s
                WHERE id_grupo = %s
            """, (data["estado"], id_grupo))

        # Edición completa (modal)
        else:
            cursor.execute("""
                UPDATE grupo
                SET
                    nombre_grupo       = %s,
                    limite_estudiantes = %s,
                    id_ciclo           = %s,
                    id_carrera         = %s,
                    descripcion        = %s
                WHERE id_grupo = %s
            """, (
                data["nombre_grupo"],
                data["limite_estudiantes"],
                data["id_ciclo"],
                data["id_carrera"],
                data.get("descripcion"),
                id_grupo
            ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()