from flask import Blueprint, request, jsonify
from database import get_connection

inscripciones_bp = Blueprint("inscripciones", __name__)

# ─────────────────────────────────────────────
# GET: todas las inscripciones
# ─────────────────────────────────────────────
@inscripciones_bp.route("/inscripciones", methods=["GET"])
def obtener_inscripciones():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                i.*,
                CONCAT(u.primer_nombre, ' ', u.primer_apellido)  AS estudiante_nombre,
                CONCAT(ur.primer_nombre, ' ', ur.primer_apellido) AS registrador_nombre,
                g.nombre_grupo
            FROM inscripcion i
            INNER JOIN usuario u  ON i.id_usuario          = u.id_usuario
            INNER JOIN usuario ur ON i.id_usuario_registro = ur.id_usuario
            INNER JOIN grupo   g  ON i.id_grupo            = g.id_grupo
            ORDER BY i.fecha_inscripcion DESC
        """)

        inscripciones = cursor.fetchall()

        for ins in inscripciones:
            if ins.get("fecha_inscripcion") and not isinstance(ins["fecha_inscripcion"], str):
                ins["fecha_inscripcion"] = ins["fecha_inscripcion"].strftime("%Y-%m-%d %H:%M:%S")
            if ins.get("fecha_actualizacion") and not isinstance(ins["fecha_actualizacion"], str):
                ins["fecha_actualizacion"] = ins["fecha_actualizacion"].strftime("%Y-%m-%d %H:%M:%S")

        return jsonify({"success": True, "inscripciones": inscripciones})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# POST: crear inscripción
# ─────────────────────────────────────────────
@inscripciones_bp.route("/inscripciones", methods=["POST"])
def crear_inscripcion():

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        # Verificar que el estudiante no esté ya inscrito en ese grupo
        cursor.execute("""
            SELECT id_inscripcion FROM inscripcion
            WHERE id_usuario = %s AND id_grupo = %s
        """, (data["id_usuario"], data["id_grupo"]))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "error": "El estudiante ya está inscrito en ese grupo."
            })

        cursor.execute("""
            INSERT INTO inscripcion
                (id_usuario, id_grupo, id_usuario_registro, fecha_inscripcion, observacion, estado)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data["id_usuario"],
            data["id_grupo"],
            data["id_usuario_registro"],
            data["fecha_inscripcion"],
            data.get("observacion"),
            data.get("estado", "ACTIVA")
        ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# PUT: actualizar inscripción
# ─────────────────────────────────────────────
@inscripciones_bp.route("/inscripciones/<int:id_inscripcion>", methods=["PUT"])
def actualizar_inscripcion(id_inscripcion):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            UPDATE inscripcion
            SET
                id_usuario_registro = %s,
                estado              = %s,
                fecha_inscripcion   = %s,
                observacion         = %s
            WHERE id_inscripcion = %s
        """, (
            data["id_usuario_registro"],
            data["estado"],
            data["fecha_inscripcion"],
            data.get("observacion"),
            id_inscripcion
        ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# GET: estudiantes activos (para select)
# ─────────────────────────────────────────────
@inscripciones_bp.route("/estudiantes", methods=["GET"])
def obtener_estudiantes():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id_usuario,
                CONCAT(primer_nombre, ' ', primer_apellido) AS nombre_completo
            FROM usuario
            WHERE id_rol = 3
              AND estado = 'ACTIVO'
            ORDER BY primer_apellido ASC
        """)

        estudiantes = cursor.fetchall()

        return jsonify({"success": True, "estudiantes": estudiantes})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# GET: admins activos (para select de registrador)
# ─────────────────────────────────────────────
@inscripciones_bp.route("/admins", methods=["GET"])
def obtener_admins():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id_usuario,
                CONCAT(primer_nombre, ' ', primer_apellido) AS nombre_completo
            FROM usuario
            WHERE id_rol = 1
              AND estado = 'ACTIVO'
            ORDER BY primer_apellido ASC
        """)

        admins = cursor.fetchall()

        return jsonify({"success": True, "admins": admins})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()