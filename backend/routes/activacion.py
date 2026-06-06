from flask import Blueprint, request, jsonify, current_app
from flask_mail import Mail, Message
from database import get_connection
import secrets
from datetime import datetime, timedelta

activacion_bp = Blueprint("activacion", __name__)

# ─────────────────────────────────────────────
# POST: enviar correo de activación
# ─────────────────────────────────────────────
@activacion_bp.route("/usuarios/<int:id_usuario>/enviar-activacion", methods=["POST"])
def enviar_activacion(id_usuario):

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT id_usuario, primer_nombre, correo_institucional
            FROM usuario
            WHERE id_usuario = %s
        """, (id_usuario,))

        usuario = cursor.fetchone()

        if not usuario:
            return jsonify({"success": False, "error": "Usuario no encontrado."})

        if not usuario["correo_institucional"]:
            return jsonify({"success": False, "error": "El usuario no tiene correo institucional."})

        # Invalidar tokens anteriores
        cursor.execute("""
            UPDATE token_activacion
            SET usado = 1
            WHERE id_usuario = %s AND usado = 0
        """, (id_usuario,))

        # Generar nuevo token
        token        = secrets.token_urlsafe(48)
        fecha_expira = datetime.now() + timedelta(hours=48)

        cursor.execute("""
            INSERT INTO token_activacion (id_usuario, token, fecha_expira)
            VALUES (%s, %s, %s)
        """, (id_usuario, token, fecha_expira))

        conexion.commit()

        link = f"http://127.0.0.1:5500/frontend/html/activar-cuenta.html?token={token}"

        mail = Mail(current_app)
        msg  = Message(
            subject="Activa tu cuenta SAMI",
            sender="noreply@sami.edu.sv",
            recipients=[usuario["correo_institucional"]]
        )
        msg.html = f"""
            <div style="font-family:sans-serif; max-width:500px; margin:auto;">
                <h2>Bienvenido/a a SAMI, {usuario['primer_nombre']}</h2>
                <p>Tu cuenta ha sido creada. Para activarla y establecer tu contraseña haz clic aquí:</p>
                <a href="{link}" style="
                    display:inline-block; padding:12px 28px;
                    background:#2563eb; color:#fff;
                    border-radius:8px; text-decoration:none; font-weight:600;
                ">Activar mi cuenta</a>
                <p style="color:#999; font-size:0.85rem; margin-top:20px;">
                    Este enlace expira en 48 horas. Si no solicitaste esto, ignora este correo.
                </p>
            </div>
        """
        mail.send(msg)

        return jsonify({"success": True, "mensaje": "Correo de activación enviado."})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# GET: verificar si un token es válido
# ─────────────────────────────────────────────
@activacion_bp.route("/activar/verificar", methods=["GET"])
def verificar_token():

    token = request.args.get("token")

    if not token:
        return jsonify({"success": False, "error": "Token no proporcionado."})

    conexion = None
    cursor = None

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT t.id_usuario, u.primer_nombre
            FROM token_activacion t
            INNER JOIN usuario u ON t.id_usuario = u.id_usuario
            WHERE t.token       = %s
              AND t.usado       = 0
              AND t.fecha_expira > NOW()
        """, (token,))

        registro = cursor.fetchone()

        if not registro:
            return jsonify({"success": False, "error": "El enlace no es válido o ya expiró."})

        return jsonify({
            "success":       True,
            "primer_nombre": registro["primer_nombre"]
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()


# ─────────────────────────────────────────────
# POST: activar cuenta y establecer contraseña
# ─────────────────────────────────────────────
@activacion_bp.route("/activar", methods=["POST"])
def activar_cuenta():

    conexion = None
    cursor = None
    data = request.get_json()

    try:
        conexion = get_connection()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT t.*, u.estado
            FROM token_activacion t
            INNER JOIN usuario u ON t.id_usuario = u.id_usuario
            WHERE t.token       = %s
              AND t.usado       = 0
              AND t.fecha_expira > NOW()
        """, (data["token"],))

        registro = cursor.fetchone()

        if not registro:
            return jsonify({
                "success": False,
                "error": "El enlace no es válido o ya expiró."
            })

        from werkzeug.security import generate_password_hash
        password_hash = generate_password_hash(data["password"])

        cursor.execute("""
            UPDATE usuario
            SET estado        = 'ACTIVO',
                password_hash = %s
            WHERE id_usuario = %s
        """, (password_hash, registro["id_usuario"]))

        cursor.execute("""
            UPDATE token_activacion
            SET usado = 1
            WHERE token = %s
        """, (data["token"],))

        conexion.commit()

        return jsonify({"success": True, "mensaje": "Cuenta activada correctamente."})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:   cursor.close()
        if conexion: conexion.close()