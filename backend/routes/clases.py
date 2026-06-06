from flask import Blueprint, request, jsonify
from database import get_connection

clase_bp = Blueprint("clase", __name__)

# ─────────────────────────────────────────────
# GET: todas las clases
# ─────────────────────────────────────────────
@clase_bp.route("/clases", methods=["GET"])
def obtener_clases():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                cl.*,
                m.nombre AS materia_nombre,
                CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS docente_nombre
            FROM clase cl
            INNER JOIN materia m  ON cl.id_materia = m.id_materia
            INNER JOIN usuario u  ON cl.id_docente = u.id_usuario
            ORDER BY m.nombre ASC
        """)

        clases = cursor.fetchall()

        return jsonify({
            "success": True,
            "clases": clases
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# POST: crear clase
# ─────────────────────────────────────────────
@clase_bp.route("/clases", methods=["POST"])
def crear_clase():

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        # Verificar si ya existe la misma combinación materia + docente + tipo
        cursor.execute("""
            SELECT id_clase FROM clase
            WHERE id_materia = %s
              AND id_docente  = %s
              AND tipo_clase  = %s
        """, (
            data["id_materia"],
            data["id_docente"],
            data["tipo_clase"]
        ))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "error": "Ya existe una clase con esa materia, docente y tipo."
            })

        # Si no existe, insertar
        cursor.execute("""
            INSERT INTO clase (id_materia, id_docente, tipo_clase, estado)
            VALUES (%s, %s, %s, %s)
        """, (
            data["id_materia"],
            data["id_docente"],
            data["tipo_clase"],
            data.get("estado", "ACTIVO")
        ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()

@clase_bp.route("/clases/activas", methods=["GET"])
def obtener_clases_activas():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                cl.*,
                m.nombre AS materia_nombre,
                CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS docente_nombre
            FROM clase cl
            INNER JOIN materia m ON cl.id_materia = m.id_materia
            INNER JOIN usuario u ON cl.id_docente = u.id_usuario
            WHERE cl.estado = 'ACTIVO'
            ORDER BY m.nombre ASC
        """)

        clases = cursor.fetchall()

        return jsonify({"success": True, "clases": clases})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# PUT: actualizar clase o solo estado
# ─────────────────────────────────────────────
@clase_bp.route("/clases/<int:id_clase>", methods=["PUT"])
def actualizar_clase(id_clase):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        # SOLO estado (botón activar/desactivar)
        if len(data) == 1 and "estado" in data:
            cursor.execute("""
                UPDATE clase SET estado = %s WHERE id_clase = %s
            """, (data["estado"], id_clase))

        # Edición completa (modal)
        else:
            # Verificar duplicado excluyendo el registro actual
            cursor.execute("""
                SELECT id_clase FROM clase
                WHERE id_materia = (SELECT id_materia FROM clase WHERE id_clase = %s)
                  AND id_docente  = %s
                  AND tipo_clase  = %s
                  AND id_clase   != %s
            """, (id_clase, data["id_docente"], data["tipo_clase"], id_clase))

            if cursor.fetchone():
                return jsonify({
                    "success": False,
                    "error": "Ya existe una clase con esa materia, docente y tipo."
                })

            cursor.execute("""
                UPDATE clase
                SET id_docente = %s,
                    tipo_clase = %s
                WHERE id_clase = %s
            """, (
                data["id_docente"],
                data["tipo_clase"],
                id_clase
            ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()

# ─────────────────────────────────────────────
# GET: docentes activos (para el select)
# ─────────────────────────────────────────────
@clase_bp.route("/docentes", methods=["GET"])
def obtener_docentes():

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
            WHERE id_rol = 2
              AND estado = 'ACTIVO'
            ORDER BY primer_apellido ASC
        """)

        docentes = cursor.fetchall()

        return jsonify({
            "success": True,
            "docentes": docentes
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()