from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime, timedelta
 
asistencias_bp = Blueprint("asistencias", __name__)
 
 
# ─────────────────────────────────────────────
# GET /mis-clases-grupos?id_docente=X
# Clases activas del docente con su grupo, carrera, ciclo y horarios
# ─────────────────────────────────────────────
@asistencias_bp.route("/mis-clases-grupos", methods=["GET"])
def mis_clases_grupos():
 
    conexion = None
    cursor   = None
    id_docente = request.args.get("id_docente")
 
    if not id_docente:
        return jsonify({"success": False, "error": "id_docente es requerido"}), 400
 
    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)
 
        # Clases con grupo asignado
        cursor.execute("""
            SELECT
                c.id_clase,
                c.tipo_clase,
                m.nombre          AS materia_nombre,
                cg.id_clase_grupo,
                cg.id_grupo,
                g.nombre_grupo,
                ca.nombre         AS carrera_nombre,
                ci.nombre         AS nombre_ciclo
            FROM clase c
            JOIN materia     m  ON m.id_materia  = c.id_materia
            JOIN clase_grupo cg ON cg.id_clase   = c.id_clase  AND cg.estado = 'ACTIVO'
            JOIN grupo       g  ON g.id_grupo    = cg.id_grupo
            JOIN carrera     ca ON ca.id_carrera = g.id_carrera
            JOIN ciclo       ci ON ci.id_ciclo   = g.id_ciclo
            WHERE c.id_docente = %s
              AND c.estado     = 'ACTIVO'
            ORDER BY m.nombre ASC
        """, (id_docente,))
 
        clases = cursor.fetchall()
 
        if not clases:
            return jsonify({"success": True, "clases": []})
 
        # Horarios de cada clase
        ids_clase = [cl["id_clase"] for cl in clases]
        formato   = ",".join(["%s"] * len(ids_clase))
 
        cursor.execute(f"""
            SELECT id_horario, id_clase, dia_semana, hora_inicio, hora_fin
            FROM horario
            WHERE id_clase IN ({formato})
              AND estado   = 'ACTIVO'
            ORDER BY FIELD(dia_semana,
                'LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'),
                hora_inicio ASC
        """, ids_clase)
 
        horarios_raw = cursor.fetchall()
 
        # Serializar time a string
        for h in horarios_raw:
            for campo in ("hora_inicio", "hora_fin"):
                if h.get(campo) and not isinstance(h[campo], str):
                    total = int(h[campo].total_seconds())
                    h[campo] = f"{total // 3600:02d}:{(total % 3600) // 60:02d}:00"
 
        # Agrupar horarios por id_clase
        horarios_map = {}
        for h in horarios_raw:
            horarios_map.setdefault(h["id_clase"], []).append(h)
 
        for cl in clases:
            cl["horarios"] = horarios_map.get(cl["id_clase"], [])
 
        return jsonify({"success": True, "clases": clases})
 
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
 
    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()
 
 
# ─────────────────────────────────────────────
# GET /estudiantes-grupo?id_grupo=X
# Estudiantes con inscripción ACTIVA en el grupo
# ─────────────────────────────────────────────
@asistencias_bp.route("/estudiantes-grupo", methods=["GET"])
def estudiantes_grupo():
 
    conexion   = None
    cursor     = None
    id_grupo   = request.args.get("id_grupo")
 
    if not id_grupo:
        return jsonify({"success": False, "error": "id_grupo es requerido"}), 400
 
    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)
 
        cursor.execute("""
            SELECT
                u.id_usuario,
                u.primer_nombre,
                u.segundo_nombre,
                u.primer_apellido,
                u.segundo_apellido,
                u.carnet
            FROM inscripcion i
            JOIN usuario u ON u.id_usuario = i.id_usuario
            WHERE i.id_grupo = %s
              AND i.estado   = 'ACTIVA'
              AND u.estado   = 'ACTIVO'
            ORDER BY u.primer_apellido ASC, u.primer_nombre ASC
        """, (id_grupo,))
 
        estudiantes = cursor.fetchall()
 
        return jsonify({"success": True, "estudiantes": estudiantes})
 
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
 
    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()
 
 
# ─────────────────────────────────────────────
# POST /asistencias/lista
# Bulk insert/update de asistencia para toda la clase
#
# Body: {
#   "registros": [{
#     "id_usuario", "id_clase", "id_horario",
#     "fecha", "hora", "estado", "tipo_registro", "observacion"
#   }]
# }
# ─────────────────────────────────────────────
@asistencias_bp.route("/asistencias/lista", methods=["POST"])
def guardar_lista():
 
    conexion = None
    cursor   = None
    data     = request.get_json()
 
    registros = data.get("registros") if data else None
 
    if not registros or not isinstance(registros, list):
        return jsonify({"success": False, "error": "Se requiere una lista de registros"}), 400
 
    # IP del cliente (opcional, puede ser None si está detrás de proxy)
    ip_cliente = request.headers.get("X-Forwarded-For", request.remote_addr)
    ahora      = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
 
    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)
 
        registrados  = 0
        actualizados = 0
        
        # ── Validar que la fecha sea hoy ──────────────────────
        hoy = datetime.now().date()
        for reg in registros:
            fecha_registro = datetime.strptime(reg["fecha"], "%Y-%m-%d").date()
            if fecha_registro != hoy:
                return jsonify({
                    "success": False,
                    "error": "Solo puedes registrar asistencia del día de hoy."
                }), 403
 
        for reg in registros:
            # Verificar si ya existe un registro para (id_usuario, id_horario, fecha)
            cursor.execute("""
                SELECT id_asistencia
                FROM asistencia
                WHERE id_usuario  = %s
                  AND id_horario  = %s
                  AND fecha       = %s
            """, (reg["id_usuario"], reg["id_horario"], reg["fecha"]))
 
            existente = cursor.fetchone()
 
            if existente:
                # Actualizar
                cursor.execute("""
                    UPDATE asistencia
                    SET
                        hora                  = %s,
                        estado                = %s,
                        tipo_registro         = %s,
                        observacion           = %s,
                        fecha_modificacion    = %s,
                        id_usuario_modificador = %s,
                        ip_equipo_registro    = %s
                    WHERE id_asistencia = %s
                """, (
                    reg["hora"],
                    reg["estado"],
                    reg.get("tipo_registro", "MANUAL"),
                    reg.get("observacion"),
                    ahora,
                    reg.get("id_usuario_modificador"),
                    ip_cliente,
                    existente["id_asistencia"]
                ))
                actualizados += 1
 
            else:
                # Insertar
                cursor.execute("""
                    INSERT INTO asistencia
                        (fecha, hora, estado, tipo_registro, observacion,
                        id_usuario, id_horario, ip_equipo_registro, id_usuario_registrador)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    reg["fecha"],
                    reg["hora"],
                    reg["estado"],
                    reg.get("tipo_registro", "MANUAL"),
                    reg.get("observacion"),
                    reg["id_usuario"],
                    reg["id_horario"],
                    ip_cliente,
                    reg.get("id_usuario_registrador") 
                ))
                registrados += 1
 
        conexion.commit()
 
        return jsonify({
            "success":      True,
            "registrados":  registrados,
            "actualizados": actualizados
        })
 
    except Exception as e:
        if conexion:
            conexion.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
 
    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()
 
 
# ─────────────────────────────────────────────
# GET /asistencias?id_clase=X&fecha=YYYY-MM-DD
# Consultar lista ya guardada (útil para ver si el día ya fue pasado)
# ─────────────────────────────────────────────
@asistencias_bp.route("/asistencias", methods=["GET"])
def obtener_asistencias():
 
    conexion  = None
    cursor    = None
    id_clase  = request.args.get("id_clase")
    fecha     = request.args.get("fecha")
 
    if not id_clase or not fecha:
        return jsonify({"success": False, "error": "id_clase y fecha son requeridos"}), 400
 
    try:
        conexion = get_connection()
        cursor   = conexion.cursor(dictionary=True)
 
        cursor.execute("""
            SELECT
                a.id_asistencia,
                a.fecha,
                a.hora,
                a.estado,
                a.tipo_registro,
                a.observacion,
                a.fecha_modificacion,
                a.ip_equipo_registro,
                a.id_usuario,
                CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS estudiante_nombre,
                u.carnet,
                a.id_horario,
                h.dia_semana,
                h.hora_inicio,
                h.hora_fin
            FROM asistencia a
            JOIN usuario u ON u.id_usuario = a.id_usuario
            JOIN horario  h ON h.id_horario = a.id_horario
            WHERE h.id_clase = %s
              AND a.fecha    = %s
            ORDER BY u.primer_apellido ASC, u.primer_nombre ASC
        """, (id_clase, fecha))
 
        asistencias = cursor.fetchall()
 
        # Serializar campos de tiempo
        for row in asistencias:
            for campo in ("hora", "hora_inicio", "hora_fin"):
                if row.get(campo) and not isinstance(row[campo], str):
                    total = int(row[campo].total_seconds())
                    row[campo] = f"{total // 3600:02d}:{(total % 3600) // 60:02d}:00"
            if row.get("fecha") and not isinstance(row["fecha"], str):
                row["fecha"] = row["fecha"].strftime("%Y-%m-%d")
            if row.get("fecha_modificacion") and not isinstance(row["fecha_modificacion"], str):
                row["fecha_modificacion"] = row["fecha_modificacion"].strftime("%Y-%m-%d %H:%M:%S")
 
        return jsonify({"success": True, "asistencias": asistencias})
 
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
 
    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()