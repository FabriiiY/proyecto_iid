from flask import Blueprint, request, jsonify
from database import get_connection

ciclo_bp = Blueprint("ciclo", __name__)

@ciclo_bp.route("/ciclos", methods=["GET"])
def obtener_ciclos():

    conexion = None
    cursor = None

    try:

        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                c.*,
                p.anio,
                tc.nombre AS tipo_ciclo_nombre
            FROM ciclo c
            INNER JOIN periodo_lectivo p
                ON c.id_periodo = p.id_periodo
            INNER JOIN tipo_ciclo tc
                ON c.id_tipo_ciclo = tc.id_tipo_ciclo
            ORDER BY c.fecha_inicio DESC
        """)

        ciclos = cursor.fetchall()
        for ciclo in ciclos:

            if ciclo["fecha_inicio"]:
                ciclo["fecha_inicio"] = ciclo["fecha_inicio"].strftime("%Y-%m-%d")

            if ciclo["fecha_fin"]:
                ciclo["fecha_fin"] = ciclo["fecha_fin"].strftime("%Y-%m-%d")

        return jsonify({
            "success": True,
            "ciclos": ciclos
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
        
@ciclo_bp.route("/ciclos", methods=["POST"])
def crear_ciclo():
    
    conexion = None
    cursor = None

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("""
            INSERT INTO ciclo
            (
                nombre,
                numero_ciclo,
                fecha_inicio,
                fecha_fin,
                id_periodo,
                id_tipo_ciclo
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """,
        (
            data["nombre"],
            data["numero_ciclo"],
            data["fecha_inicio"],
            data["fecha_fin"],
            data["id_periodo"],
            data["id_tipo_ciclo"]
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
        
@ciclo_bp.route("/ciclos/<int:id_ciclo>", methods=["PUT"])
def actualizar_ciclo(id_ciclo):
    
    conexion = None
    cursor = None

    data = request.get_json()

    try:

        conexion = get_connection()
        cursor = conexion.cursor()

        if len(data) == 1 and "estado" in data:

            cursor.execute("""
                UPDATE ciclo
                SET estado = %s
                WHERE id_ciclo = %s
            """,
            (
                data["estado"],
                id_ciclo
            ))

        else:
            print("ENTRÓ A UPDATE COMPLETO")

            cursor.execute("""
                UPDATE ciclo
                SET
                    nombre = %s,
                    numero_ciclo = %s,
                    fecha_inicio = %s,
                    fecha_fin = %s,
                    id_periodo = %s,
                    id_tipo_ciclo = %s,
                    estado = %s
                WHERE id_ciclo = %s
            """,
            (
                data["nombre"],
                data["numero_ciclo"],
                data["fecha_inicio"],
                data["fecha_fin"],
                data["id_periodo"],
                data["id_tipo_ciclo"],
                data["estado"],
                id_ciclo
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