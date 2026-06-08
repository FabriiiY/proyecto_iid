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
        #ANTES
        #msg  = Message(
            #subject="Activa tu cuenta SAMI",
            #sender="noreply@sami.edu.sv",
            #recipients=[usuario["correo_institucional"]]
        #)
        msg = Message(
            subject="Activa tu cuenta SAMI",
            sender="cuentadeadmin03@gmail.com",
            recipients=[usuario["correo_institucional"]]
        )
        
        msg.html = f"""
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0; padding:0; background:#f0f4f8; font-family:'Segoe UI', Arial, sans-serif;">

                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8; padding:40px 0;">
                    <tr>
                        <td align="center">
                            <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                                
                                <!-- HEADER -->
                                <tr>
                                    <td style="background:linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding:36px 40px; text-align:center;">
                                        <h1 style="margin:0; color:#ffffff; font-size:1.8rem; font-weight:800; letter-spacing:-0.5px;">
                                            SAMI
                                        </h1>
                                        <p style="margin:6px 0 0; color:#bfdbfe; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase;">
                                            Sistema de Asistencia y Marcación Inteligente
                                        </p>
                                    </td>
                                </tr>

                                <!-- BODY -->
                                <tr>
                                    <td style="padding:40px 40px 32px;">
                                        
                                        <!-- Ícono -->
                                        <div style="text-align:center; margin-bottom:24px;">
                                            <div style="
                                                display:inline-block;
                                                background:#eff6ff;
                                                border-radius:50%;
                                                width:64px; height:64px;
                                                line-height:64px;
                                                font-size:2rem;
                                                text-align:center;
                                            ">👋</div>
                                        </div>

                                        <h2 style="margin:0 0 8px; color:#1e293b; font-size:1.4rem; font-weight:700; text-align:center;">
                                            ¡Bienvenido/a, {usuario['primer_nombre']}!
                                        </h2>
                                        <p style="margin:0 0 24px; color:#64748b; font-size:0.95rem; text-align:center; line-height:1.6;">
                                            Tu cuenta en <strong>SAMI</strong> ha sido creada exitosamente.<br>
                                            Para activarla y establecer tu contraseña, haz clic en el botón.
                                        </p>

                                        <!-- Botón -->
                                        <div style="text-align:center; margin:32px 0;">
                                            <a href="{link}" style="
                                                display:inline-block;
                                                padding:14px 36px;
                                                background:linear-gradient(135deg, #1e40af, #2563eb);
                                                color:#ffffff;
                                                text-decoration:none;
                                                font-weight:700;
                                                font-size:1rem;
                                                border-radius:10px;
                                                letter-spacing:0.02em;
                                                box-shadow:0 4px 12px rgba(37,99,235,0.35);
                                            ">
                                                🔐 Activar mi cuenta
                                            </a>
                                        </div>

                                        <!-- Advertencia -->
                                        <div style="
                                            background:#fef9ec;
                                            border-left:4px solid #f59e0b;
                                            border-radius:8px;
                                            padding:14px 16px;
                                            margin-top:24px;
                                        ">
                                            <p style="margin:0; color:#92400e; font-size:0.85rem; line-height:1.5;">
                                                ⏰ <strong>Este enlace expira en 48 horas.</strong><br>
                                                Si no solicitaste esta cuenta, puedes ignorar este correo con seguridad.
                                            </p>
                                        </div>

                                    </td>
                                </tr>

                                <!-- FOOTER -->
                                <tr>
                                    <td style="background:#f8fafc; padding:20px 40px; border-top:1px solid #e2e8f0; text-align:center;">
                                        <p style="margin:0; color:#94a3b8; font-size:0.78rem; line-height:1.6;">
                                            Este correo fue enviado automáticamente por SAMI.<br>
                                            Por favor no respondas a este mensaje.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>

            </body>
            </html>
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