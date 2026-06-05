from flask import Blueprint, request, jsonify
from database import get_connection

periodos_bp = Blueprint("periodos", __name__)

# =====================================================
# OBTENER TODOS LOS PERIODOS
# =====================================================

@periodos_bp.route("/periodos", methods=["GET"])
def obtener_periodos():
    
    conexion = None
    cursor = None

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM periodo_lectivo
            ORDER BY anio DESC
        """)

        periodos = cursor.fetchall()

        return jsonify({
            "success": True,
            "periodos": periodos
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


# =====================================================
# CREAR PERIODO
# =====================================================

@periodos_bp.route("/periodos", methods=["POST"])
def crear_periodo():
    
    conexion = None
    cursor = None

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            INSERT INTO periodo_lectivo
            (
                nombre,
                descripcion,
                anio,
                fecha_inicio,
                fecha_fin
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """,
        (
            data["nombre"],
            data.get("descripcion"),
            data["anio"],
            data["fecha_inicio"],
            data["fecha_fin"]
        ))

        conexion.commit()

        id_periodo = cursor.lastrowid

        cursor.execute("""
            SELECT *
            FROM periodo_lectivo
            WHERE id_periodo = %s
        """, (id_periodo,))

        periodo = cursor.fetchone()

        return jsonify({
            "success": True,
            "periodo": periodo
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


# =====================================================
# EDITAR PERIODO
# =====================================================

@periodos_bp.route("/periodos/<int:id_periodo>", methods=["PUT"])
def actualizar_periodo(id_periodo):

    conexion = None
    cursor = None
    
    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            UPDATE periodo_lectivo
            SET
                nombre = %s,
                descripcion = %s,
                anio = %s,
                fecha_inicio = %s,
                fecha_fin = %s,
                estado = %s
            WHERE id_periodo = %s
        """,
        (
            data["nombre"],
            data.get("descripcion"),
            data["anio"],
            data["fecha_inicio"],
            data["fecha_fin"],
            data["estado"],
            id_periodo
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


# =====================================================
# CAMBIAR ESTADO
# =====================================================

@periodos_bp.route("/periodos/<int:id_periodo>/estado", methods=["PUT"])
def cambiar_estado_periodo(id_periodo):

    conexion = None
    cursor = None
    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            UPDATE periodo_lectivo
            SET estado = %s
            WHERE id_periodo = %s
        """,
        (
            data["estado"],
            id_periodo
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