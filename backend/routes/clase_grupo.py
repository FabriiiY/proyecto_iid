from flask import Blueprint, request, jsonify
from database import get_connection

clase_grupo_bp = Blueprint("clase_grupo", __name__)

# ─────────────────────────────────────────────
# GET: todas las asignaciones clase-grupo
# ─────────────────────────────────────────────
@clase_grupo_bp.route("/clase-grupo", methods=["GET"])
def obtener_clase_grupos():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                cg.*,
                g.nombre_grupo,
                m.nombre  AS materia_nombre,
                CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS docente_nombre
            FROM clase_grupo cg
            INNER JOIN grupo   g  ON cg.id_grupo = g.id_grupo
            INNER JOIN clase   cl ON cg.id_clase = cl.id_clase
            INNER JOIN materia m  ON cl.id_materia = m.id_materia
            INNER JOIN usuario u  ON cl.id_docente = u.id_usuario
            ORDER BY g.nombre_grupo ASC
        """)

        registros = cursor.fetchall()

        return jsonify({
            "success": True,
            "clase_grupos": registros
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# POST: crear asignación
# ─────────────────────────────────────────────
@clase_grupo_bp.route("/clase-grupo", methods=["POST"])
def crear_clase_grupo():

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        # Verificar duplicado
        cursor.execute("""
            SELECT id_clase_grupo FROM clase_grupo
            WHERE id_grupo = %s AND id_clase = %s
        """, (data["id_grupo"], data["id_clase"]))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "error": "Esa clase ya está asignada a ese grupo."
            })

        cursor.execute("""
            INSERT INTO clase_grupo (id_grupo, id_clase, estado)
                VALUES (%s, %s, %s)
        """, (
            data["id_grupo"],
            data["id_clase"],
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
# PUT: actualizar asignación completa
# ─────────────────────────────────────────────
@clase_grupo_bp.route("/clase-grupo/<int:id_clase_grupo>", methods=["PUT"])
def actualizar_clase_grupo(id_clase_grupo):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        # Verificar duplicado excluyendo el registro actual
        cursor.execute("""
            SELECT id_clase_grupo FROM clase_grupo
            WHERE id_grupo = %s
              AND id_clase = %s
              AND id_clase_grupo != %s
        """, (data["id_grupo"], data["id_clase"], id_clase_grupo))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "error": "Esa clase ya está asignada a ese grupo."
            })

        cursor.execute("""
            UPDATE clase_grupo
            SET id_grupo = %s,
                id_clase = %s
            WHERE id_clase_grupo = %s
        """, (
            data["id_grupo"],
            data["id_clase"],
            id_clase_grupo
        ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# PUT: cambiar estado (activo/inactivo)
# ─────────────────────────────────────────────
@clase_grupo_bp.route("/clase-grupo/<int:id_clase_grupo>/estado", methods=["PUT"])
def cambiar_estado_clase_grupo(id_clase_grupo):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            UPDATE clase_grupo
            SET estado = %s
            WHERE id_clase_grupo = %s
        """, (data["estado"], id_clase_grupo))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()