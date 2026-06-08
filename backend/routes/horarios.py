from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime

horarios_bp = Blueprint("horarios", __name__)

# ─────────────────────────────────────────────
# GET: todos los horarios
# ─────────────────────────────────────────────
@horarios_bp.route("/horarios", methods=["GET"])
def obtener_horarios():

    conexion   = None
    cursor     = None
    id_docente = request.args.get("id_docente")
    estado     = request.args.get("estado")

    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)

        # Construir WHERE dinámico
        condiciones = []
        params      = []

        if id_docente:
            condiciones.append("cl.id_docente = %s")
            params.append(id_docente)
        if estado:
            condiciones.append("h.estado = %s")
            params.append(estado)

        where = ("WHERE " + " AND ".join(condiciones)) if condiciones else ""

        cursor.execute(f"""
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
            {where}
            ORDER BY h.dia_semana, h.hora_inicio
        """, params)

        horarios = cursor.fetchall()

        def fmt_time(t):
            if t is None: return None
            if isinstance(t, str): return t
            total = int(t.total_seconds())
            return f"{total // 3600:02d}:{(total % 3600) // 60:02d}:{total % 60:02d}"

        for h in horarios:
            h["hora_inicio"] = fmt_time(h.get("hora_inicio"))
            h["hora_fin"]    = fmt_time(h.get("hora_fin"))
            for campo in ["fecha_inicio", "fecha_fin"]:
                val = h.get(campo)
                if val is None: h[campo] = None
                elif isinstance(val, str): h[campo] = val[:10]
                else: h[campo] = val.strftime("%Y-%m-%d")
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
        cursor = conexion.cursor(dictionary=True, buffered=True)

        # SOLO estado
        if len(data) == 1 and "estado" in data:
            cursor.execute("""
                UPDATE horario SET estado = %s WHERE id_horario = %s
            """, (data["estado"], id_horario))

        # Edición completa
        else:
            # 1. Verificar que la misma clase no tenga otro horario en ese día y franja
            cursor.execute("""
                SELECT id_horario FROM horario
                WHERE id_clase    = (SELECT id_clase FROM horario WHERE id_horario = %s)
                  AND dia_semana  = %s
                  AND estado      = 'ACTIVO'
                  AND fecha_inicio <= %s
                  AND fecha_fin   >= %s
                  AND hora_inicio <  %s
                  AND hora_fin    >  %s
                  AND id_horario != %s
            """, (
                id_horario, data["dia_semana"],
                data["fecha_fin"], data["fecha_inicio"],
                data["hora_fin"], data["hora_inicio"],
                id_horario
            ))

            if cursor.fetchone():
                return jsonify({
                    "success": False,
                    "error": "Esa clase ya tiene otro horario en ese día y franja horaria."
                })

            # 2. Verificar que el aula no esté ocupada por otra clase
            cursor.execute("""
                SELECT id_horario FROM horario
                WHERE id_aula    = %s
                  AND dia_semana = %s
                  AND estado     = 'ACTIVO'
                  AND fecha_inicio <= %s
                  AND fecha_fin   >= %s
                  AND hora_inicio <  %s
                  AND hora_fin    >  %s
                  AND id_horario != %s
            """, (
                data["id_aula"], data["dia_semana"],
                data["fecha_fin"], data["fecha_inicio"],
                data["hora_fin"], data["hora_inicio"],
                id_horario
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
                WHERE cl.id_docente = (
                    SELECT cl2.id_docente FROM horario h2
                    INNER JOIN clase cl2 ON h2.id_clase = cl2.id_clase
                    WHERE h2.id_horario = %s
                )
                  AND h.dia_semana  = %s
                  AND h.estado      = 'ACTIVO'
                  AND h.fecha_inicio <= %s
                  AND h.fecha_fin   >= %s
                  AND h.hora_inicio <  %s
                  AND h.hora_fin    >  %s
                  AND h.id_horario != %s
            """, (
                id_horario, data["dia_semana"],
                data["fecha_fin"], data["fecha_inicio"],
                data["hora_fin"], data["hora_inicio"],
                id_horario
            ))

            if cursor.fetchone():
                return jsonify({
                    "success": False,
                    "error": "El docente ya tiene otra clase en ese día y franja horaria."
                })

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
        return jsonify({"success": False, "error": str(e)})

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
        
        
        
# ===========================================================================
# PARA ALUMNOS

# ─────────────────────────────────────────────
# GET /mis-horarios-hoy?id_usuario=X&dia=LUNES
# Horarios del estudiante para el día actual
# ─────────────────────────────────────────────
@horarios_bp.route("/mis-horarios-hoy", methods=["GET"])
def mis_horarios_hoy():

    conexion   = None
    cursor     = None
    id_usuario = request.args.get("id_usuario")
    dia        = request.args.get("dia")

    if not id_usuario or not dia:
        return jsonify({"success": False, "error": "id_usuario y dia son requeridos"}), 400

    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                h.id_horario,
                h.hora_inicio,
                h.hora_fin,
                h.minutos_anticipacion,
                h.minutos_tolerancia,
                h.dia_semana,
                c.id_clase,
                c.tipo_clase,
                m.nombre                                        AS materia_nombre,
                CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS docente_nombre,
                a.codigo_aula,
                a.edificio,
                mo.nombre                                       AS modalidad_nombre,
                asi.estado                                      AS estado_asistencia,
                asi.justificacion_aprobada                      AS justificacion_aprobada
            FROM horario h
            JOIN clase       c   ON c.id_clase      = h.id_clase
            JOIN materia     m   ON m.id_materia    = c.id_materia
            JOIN usuario     u   ON u.id_usuario    = c.id_docente
            JOIN aula        a   ON a.id_aula       = h.id_aula
            JOIN modalidad   mo  ON mo.id_modalidad = h.id_modalidad
            JOIN clase_grupo cg  ON cg.id_clase     = c.id_clase AND cg.estado = 'ACTIVO'
            JOIN inscripcion i   ON i.id_grupo      = cg.id_grupo
                                AND i.id_usuario    = %s
                                AND i.estado        = 'ACTIVA'
            LEFT JOIN asistencia asi ON asi.id_horario = h.id_horario
                                    AND asi.id_usuario = %s
                                    AND asi.fecha      = CURDATE()
            WHERE h.dia_semana  = %s
              AND h.fecha_inicio <= CURDATE()
              AND h.fecha_fin    >= CURDATE()
              AND h.estado       = 'ACTIVO'
            ORDER BY h.hora_inicio ASC
        """, (id_usuario, id_usuario, dia))

        horarios = cursor.fetchall()

        # Serializar campos time
        for h in horarios:
            for campo in ("hora_inicio", "hora_fin"):
                if h.get(campo) and not isinstance(h[campo], str):
                    total   = int(h[campo].total_seconds())
                    h[campo] = f"{total // 3600:02d}:{(total % 3600) // 60:02d}:00"

        return jsonify({"success": True, "horarios": horarios})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# POST /asistencias
# El estudiante marca su propia asistencia
# ─────────────────────────────────────────────
@horarios_bp.route("/asistencias", methods=["POST"])
def marcar_asistencia():

    conexion = None
    cursor   = None
    data     = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Se requiere un body JSON"}), 400

    ip_cliente = request.headers.get("X-Forwarded-For", request.remote_addr)

    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)

        # Verificar si ya existe registro para (id_usuario, id_horario, fecha)
        cursor.execute("""
            SELECT id_asistencia
            FROM asistencia
            WHERE id_usuario = %s
              AND id_horario = %s
              AND fecha      = %s
        """, (data["id_usuario"], data["id_horario"], data["fecha"]))

        existente = cursor.fetchone()

        if existente:
            # Ya marcó — actualizar
            cursor.execute("""
                UPDATE asistencia
                SET
                    hora                   = %s,
                    estado                 = %s,
                    tipo_registro          = %s,
                    observacion            = %s,
                    fecha_modificacion     = %s,
                    id_usuario_modificador = %s,
                    ip_equipo_registro     = %s,
                    justificacion_aprobada = %s
                WHERE id_asistencia = %s
            """, (
                data["hora"],
                data["estado"],
                data.get("tipo_registro", "AUTOMATICO"),
                data.get("observacion"),
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                data["id_usuario"],
                ip_cliente,
                "PENDIENTE" if data["estado"] == "JUSTIFICADA" else None,
                existente["id_asistencia"]
            ))
        else:
            # Nuevo registro
            cursor.execute("""
                INSERT INTO asistencia
                    (fecha, hora, estado, tipo_registro, observacion,
                     id_usuario, id_horario, ip_equipo_registro,
                     id_usuario_registrador, justificacion_aprobada)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data["fecha"],
                data["hora"],
                data["estado"],
                data.get("tipo_registro", "AUTOMATICO"),
                data.get("observacion"),
                data["id_usuario"],
                data["id_horario"],
                ip_cliente,
                data["id_usuario"],  # el estudiante se registra a sí mismo
                "PENDIENTE" if data["estado"] == "JUSTIFICADA" else None
            ))

        conexion.commit()
        return jsonify({"success": True})

    except Exception as e:
        import traceback
        traceback.print_exc()
        if conexion:
            conexion.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()
        
        
# que los alunos puedan ver sus horarios

# ─────────────────────────────────────────────
# GET /mis-horarios-completos?id_usuario=X
# Todos los horarios activos del estudiante (todos los días)
# ─────────────────────────────────────────────
@horarios_bp.route("/mis-horarios-completos", methods=["GET"])
def mis_horarios_completos():

    conexion   = None
    cursor     = None
    id_usuario = request.args.get("id_usuario")

    if not id_usuario:
        return jsonify({"success": False, "error": "id_usuario es requerido"}), 400

    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)

        # Datos del estudiante
        cursor.execute("""
            SELECT
                u.primer_nombre, u.primer_apellido, u.carnet,
                g.nombre_grupo  AS grupo_nombre,
                ca.nombre       AS carrera_nombre,
                ci.nombre       AS ciclo_nombre
            FROM usuario u
            JOIN inscripcion i  ON i.id_usuario = u.id_usuario AND i.estado = 'ACTIVA'
            JOIN grupo       g  ON g.id_grupo   = i.id_grupo
            JOIN carrera     ca ON ca.id_carrera = g.id_carrera
            JOIN ciclo       ci ON ci.id_ciclo   = g.id_ciclo
            WHERE u.id_usuario = %s
            LIMIT 1
        """, (id_usuario,))

        estudiante = cursor.fetchone()

        # Horarios activos
        cursor.execute("""
            SELECT
                h.id_horario,
                h.dia_semana,
                h.hora_inicio,
                h.hora_fin,
                h.minutos_anticipacion,
                h.minutos_tolerancia,
                h.fecha_inicio,
                h.fecha_fin,
                c.id_clase,
                c.tipo_clase,
                m.nombre                                        AS materia_nombre,
                CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS docente_nombre,
                a.codigo_aula,
                a.edificio,
                a.nivel,
                mo.nombre                                       AS modalidad_nombre
            FROM horario h
            JOIN clase       c   ON c.id_clase      = h.id_clase
            JOIN materia     m   ON m.id_materia    = c.id_materia
            JOIN usuario     u   ON u.id_usuario    = c.id_docente
            JOIN aula        a   ON a.id_aula       = h.id_aula
            JOIN modalidad   mo  ON mo.id_modalidad = h.id_modalidad
            JOIN clase_grupo cg  ON cg.id_clase     = c.id_clase AND cg.estado = 'ACTIVO'
            JOIN inscripcion i   ON i.id_grupo      = cg.id_grupo
                                AND i.id_usuario    = %s
                                AND i.estado        = 'ACTIVA'
            WHERE h.estado       = 'ACTIVO'
              AND h.fecha_inicio <= CURDATE()
              AND h.fecha_fin    >= CURDATE()
            ORDER BY FIELD(h.dia_semana,
                'LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'),
                h.hora_inicio ASC
        """, (id_usuario,))

        materias = cursor.fetchall()

        # Serializar campos time y date
        for h in materias:
            for campo in ("hora_inicio", "hora_fin"):
                if h.get(campo) and not isinstance(h[campo], str):
                    total    = int(h[campo].total_seconds())
                    h[campo] = f"{total // 3600:02d}:{(total % 3600) // 60:02d}:00"
            for campo in ("fecha_inicio", "fecha_fin"):
                val = h.get(campo)
                if val and not isinstance(val, str):
                    h[campo] = val.strftime("%Y-%m-%d")

        return jsonify({"success": True, "estudiante": estudiante, "materias": materias})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()
        
        
        
# PARA REPORTEEEEEEEEEEEEEEEES ========================================================================

# ─────────────────────────────────────────────
# GET /reporte-asistencia?id_usuario=X&fecha_ini=Y&fecha_fin=Z
# Reporte de asistencia del estudiante por rango de fechas
# ─────────────────────────────────────────────
@horarios_bp.route("/reporte-asistencia", methods=["GET"])
def reporte_asistencia():

    conexion   = None
    cursor     = None
    id_usuario = request.args.get("id_usuario")
    fecha_ini  = request.args.get("fecha_ini")
    fecha_fin  = request.args.get("fecha_fin")

    if not id_usuario or not fecha_ini or not fecha_fin:
        return jsonify({"success": False, "error": "id_usuario, fecha_ini y fecha_fin son requeridos"}), 400

    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)

        # Datos del estudiante
        cursor.execute("""
            SELECT
                CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre_completo,
                u.carnet,
                g.nombre_grupo  AS grupo_nombre,
                ca.nombre       AS carrera_nombre
            FROM usuario u
            JOIN inscripcion i  ON i.id_usuario = u.id_usuario AND i.estado = 'ACTIVA'
            JOIN grupo       g  ON g.id_grupo   = i.id_grupo
            JOIN carrera     ca ON ca.id_carrera = g.id_carrera
            WHERE u.id_usuario = %s
            LIMIT 1
        """, (id_usuario,))

        estudiante = cursor.fetchone()

        # Asistencias en el rango
        cursor.execute("""
            SELECT
                a.id_asistencia,
                a.fecha,
                a.hora,
                a.estado,
                a.observacion,
                c.id_clase,
                c.tipo_clase,
                m.nombre      AS materia_nombre,
                h.hora_inicio,
                h.hora_fin
            FROM asistencia a
            JOIN horario h ON h.id_horario = a.id_horario
            JOIN clase   c ON c.id_clase   = h.id_clase
            JOIN materia m ON m.id_materia = c.id_materia
            WHERE a.id_usuario = %s
              AND a.fecha BETWEEN %s AND %s
            ORDER BY a.fecha DESC, h.hora_inicio ASC
        """, (id_usuario, fecha_ini, fecha_fin))

        asistencias = cursor.fetchall()

        # Serializar
        for row in asistencias:
            if row.get("fecha") and not isinstance(row["fecha"], str):
                row["fecha"] = row["fecha"].strftime("%Y-%m-%d")
            for campo in ("hora", "hora_inicio", "hora_fin"):
                if row.get(campo) and not isinstance(row[campo], str):
                    total = int(row[campo].total_seconds())
                    row[campo] = f"{total // 3600:02d}:{(total % 3600) // 60:02d}:00"

        return jsonify({"success": True, "estudiante": estudiante, "asistencias": asistencias})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()
