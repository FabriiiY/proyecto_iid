from flask import Blueprint, request, jsonify
from database import get_connection

horarios_bp = Blueprint("horarios", __name__)

# ─────────────────────────────────────────────
# GET: todos los horarios
# ─────────────────────────────────────────────
@horarios_bp.route("/horarios", methods=["GET"])
def obtener_horarios():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                h.*,
                a.codigo_aula,
                a.edificio,
                m.nombre      AS modalidad_nombre,
                mat.nombre    AS materia_nombre,
                cl.tipo_clase,
                CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS docente_nombre
            FROM horario h
            INNER JOIN aula      a   ON h.id_aula      = a.id_aula
            INNER JOIN modalidad m   ON h.id_modalidad = m.id_modalidad
            INNER JOIN clase     cl  ON h.id_clase     = cl.id_clase
            INNER JOIN materia   mat ON cl.id_materia  = mat.id_materia
            INNER JOIN usuario   u   ON cl.id_docente  = u.id_usuario
            ORDER BY h.dia_semana, h.hora_inicio
        """)

        horarios = cursor.fetchall()

        for h in horarios:
            
            def fmt_time(t):
                if t is None:
                    return None
                if isinstance(t, str):
                    return t
                total    = int(t.total_seconds())
                horas    = total // 3600
                minutos  = (total % 3600) // 60
                segundos = total % 60
                return f"{horas:02d}:{minutos:02d}:{segundos:02d}"
            
            for h in horarios:
                h["hora_inicio"] = fmt_time(h.get("hora_inicio"))
                h["hora_fin"]    = fmt_time(h.get("hora_fin"))

                for campo in ["fecha_inicio", "fecha_fin"]:
                    val = h.get(campo)
                    if val is None:
                        h[campo] = None
                    elif isinstance(val, str):
                        h[campo] = val[:10]
                    else:
                        h[campo] = val.strftime("%Y-%m-%d")

                if h.get("fecha_actualizacion") and not isinstance(h["fecha_actualizacion"], str):
                    h["fecha_actualizacion"] = h["fecha_actualizacion"].strftime("%Y-%m-%d %H:%M:%S")
                
            return jsonify({"success": True, "horarios": horarios})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# POST: crear horario
# ─────────────────────────────────────────────
@horarios_bp.route("/horarios", methods=["POST"])
def crear_horario():

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()
        
        # 1. Verificar conflicto de la misma clase en ese día y franja
        cursor.execute("""
            SELECT id_horario FROM horario
            WHERE id_clase   = %s
            AND dia_semana = %s
            AND estado     = 'ACTIVO'
            AND fecha_inicio <= %s
            AND fecha_fin  >= %s
            AND hora_inicio <  %s
            AND hora_fin   >  %s
        """, (
            data["id_clase"],
            data["dia_semana"],
            data["fecha_fin"],
            data["fecha_inicio"],
            data["hora_fin"],
            data["hora_inicio"]
        ))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "error": "Esa clase ya tiene un horario asignado en ese día y franja horaria."
            })

        # 2. Verificar que el aula no esté ocupada por otra clase en ese mismo rango
        cursor.execute("""
            SELECT id_horario FROM horario
            WHERE id_aula    = %s
            AND dia_semana = %s
            AND estado     = 'ACTIVO'
            AND fecha_inicio <= %s
            AND fecha_fin  >= %s
            AND hora_inicio <  %s
            AND hora_fin   >  %s
        """, (
            data["id_aula"],
            data["dia_semana"],
            data["fecha_fin"],
            data["fecha_inicio"],
            data["hora_fin"],
            data["hora_inicio"]
        ))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "error": "El aula ya está ocupada por otra clase en ese día y franja horaria."
            })
            
        # 3. Verificar que el docente no tenga otra clase en ese mismo rango
        cursor.execute("""
            SELECT h.id_horario FROM horario h
            INNER JOIN clase cl ON h.id_clase = cl.id_clase
            WHERE cl.id_docente = (SELECT id_docente FROM clase WHERE id_clase = %s)
            AND h.dia_semana  = %s
            AND h.estado      = 'ACTIVO'
            AND h.fecha_inicio <= %s
            AND h.fecha_fin   >= %s
            AND h.hora_inicio <  %s
            AND h.hora_fin    >  %s
            AND h.id_clase   != %s
        """, (
            data["id_clase"],
            data["dia_semana"],
            data["fecha_fin"],
            data["fecha_inicio"],
            data["hora_fin"],
            data["hora_inicio"],
            data["id_clase"]
        ))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "error": "El docente ya tiene otra clase asignada en ese día y franja horaria."
            })

        cursor.execute("""
            INSERT INTO horario (
                id_clase, id_aula, id_modalidad,
                dia_semana, hora_inicio, hora_fin,
                fecha_inicio, fecha_fin,
                minutos_anticipacion, minutos_tolerancia,
                estado
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data["id_clase"],
            data["id_aula"],
            data["id_modalidad"],
            data["dia_semana"],
            data["hora_inicio"],
            data["hora_fin"],
            data["fecha_inicio"],
            data["fecha_fin"],
            data.get("minutos_anticipacion", 10),
            data.get("minutos_tolerancia", 10),
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
# PUT: actualizar horario o solo estado
# ─────────────────────────────────────────────
@horarios_bp.route("/horarios/<int:id_horario>", methods=["PUT"])
def actualizar_horario(id_horario):

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        # SOLO estado
        if len(data) == 1 and "estado" in data:
            cursor.execute("""
                UPDATE horario SET estado = %s WHERE id_horario = %s
            """, (data["estado"], id_horario))

        # Edición completa
        else:
            cursor.execute("""
                UPDATE horario
                SET
                    id_aula              = %s,
                    id_modalidad         = %s,
                    dia_semana           = %s,
                    hora_inicio          = %s,
                    hora_fin             = %s,
                    fecha_inicio         = %s,
                    fecha_fin            = %s,
                    minutos_anticipacion = %s,
                    minutos_tolerancia   = %s
                WHERE id_horario = %s
            """, (
                data["id_aula"],
                data["id_modalidad"],
                data["dia_semana"],
                data["hora_inicio"],
                data["hora_fin"],
                data["fecha_inicio"],
                data["fecha_fin"],
                data["minutos_anticipacion"],
                data["minutos_tolerancia"],
                id_horario
            ))

        conexion.commit()

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# GET: aulas activas (para select)
# ─────────────────────────────────────────────
@horarios_bp.route("/aulas", methods=["GET"])
def obtener_aulas():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT id_aula, codigo_aula, edificio, nivel, capacidad
            FROM aula
            WHERE estado = 'ACTIVO'
            ORDER BY edificio, codigo_aula
        """)

        aulas = cursor.fetchall()

        return jsonify({"success": True, "aulas": aulas})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# GET: modalidades activas (para select)
# ─────────────────────────────────────────────
@horarios_bp.route("/modalidades", methods=["GET"])
def obtener_modalidades():

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT id_modalidad, nombre, descripcion
            FROM modalidad
            WHERE estado = 'ACTIVO'
            ORDER BY nombre
        """)

        modalidades = cursor.fetchall()

        return jsonify({"success": True, "modalidades": modalidades})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()