// ============================================================
//  views/admin.js — Vistas del Administrador
// ============================================================

// ── HELPERS DE FORMATO ───────────────────────────────────────

/**
 * Formatea un input de teléfono salvadoreño visualmente como XXXX-XXXX.
 * Solo permite dígitos, máx 8. El dato limpio (sin guión) se obtiene con .replace('-','').
 */
function setupTelFormat(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener("input", function () {
        let digits = this.value.replace(/\D/g, "").slice(0, 8);
        this.value = digits.length > 4 ? digits.slice(0, 4) + "-" + digits.slice(4) : digits;
    });
    el.addEventListener("keydown", function (e) {
        // Permitir backspace, delete, tab, flechas
        if ([8, 9, 37, 38, 39, 40, 46].includes(e.keyCode)) return;
        // Bloquear todo lo que no sea dígito
        if (!/^\d$/.test(e.key)) e.preventDefault();
    });
}

/**
 * Formatea un input de DUI salvadoreño visualmente como 00000000-0.
 * Solo permite dígitos, máx 9 (8 + 1 verificador).
 */
function setupDuiFormat(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener("input", function () {
        let digits = this.value.replace(/\D/g, "").slice(0, 9);
        this.value = digits.length > 8 ? digits.slice(0, 8) + "-" + digits.slice(8) : digits;
    });
    el.addEventListener("keydown", function (e) {
        if ([8, 9, 37, 38, 39, 40, 46].includes(e.keyCode)) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
    });
}

/**
 * Convierte a mayúsculas en tiempo real mientras el usuario escribe.
 * setSelectionRange preserva la posición del cursor al reemplazar el valor.
 */
function setupUppercase(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener("input", function () {
        const pos = this.selectionStart;
        this.value = this.value.toUpperCase();
        this.setSelectionRange(pos, pos);
    });
}

/**
 * Permite solo dígitos en un input (para carnet, etc.).
 */
function setupNumericOnly(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener("keydown", function (e) {
        if ([8, 9, 37, 38, 39, 40, 46].includes(e.keyCode)) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
    });
    el.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });
}

// ── VISTA: ADMINISTRACIÓN DE USUARIOS ────────────────────────
function renderViewAdminUsuarios(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">manage_accounts</span> Administración de Usuarios</h1>
            <p>Registra un nuevo usuario en el sistema con todos sus datos.</p>
        </div>

        <div class="admin-card" style="max-width:960px;">
            <h3><span class="material-symbols-rounded">badge</span> Nuevo Usuario</h3>

            <form id="add-user-form" novalidate>

                <!-- ── FOTO DE PERFIL ── -->
                <div class="form-group" style="align-items:flex-start; margin-bottom:24px;">
                    <label>Foto de Perfil <span class="opt">(opcional)</span></label>
                    <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap; margin-top:6px;">
                        <div id="foto-preview-wrap" style="
                            width:90px; height:90px; border-radius:50%;
                            background:var(--azul-sami); color:white;
                            display:flex; align-items:center; justify-content:center;
                            font-size:2rem; font-weight:700; overflow:hidden;
                            border:2px solid var(--borde); cursor:pointer;
                            flex-shrink:0;"
                            title="Haz clic para seleccionar foto" id="foto-preview-circle">
                            <span class="material-symbols-rounded" style="font-size:2.2rem;">person</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <button type="button" class="btn-primary" id="btn-elegir-foto" style="width:auto; padding:10px 20px;">
                                <span class="material-symbols-rounded">upload</span> Elegir Foto
                            </button>
                            <button type="button" class="btn-secondary" id="btn-quitar-foto-form" style="display:none;">
                                <span class="material-symbols-rounded">delete</span> Quitar Foto
                            </button>
                            <small style="color:#aaa; font-size:0.78rem;">JPG o PNG · Máx 2 MB</small>
                        </div>
                    </div>
                    <input type="file" id="u-foto-input" accept="image/jpeg,image/png" style="display:none;" />
                </div>

                <!-- ── NOMBRES ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Primer Nombre <span class="req">*</span></label>
                        <input type="text" id="u-primer-nombre" placeholder="Ej. JUAN" required autocomplete="off" class="input-uppercase" />
                    </div>
                    <div class="form-group">
                        <label>Segundo Nombre <span class="req">*</span></label>
                        <input type="text" id="u-segundo-nombre" placeholder="Ej. CARLOS" required autocomplete="off" class="input-uppercase" />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Primer Apellido <span class="req">*</span></label>
                        <input type="text" id="u-primer-apellido" placeholder="Ej. PÉREZ" required autocomplete="off" class="input-uppercase" />
                    </div>
                    <div class="form-group">
                        <label>Segundo Apellido <span class="req">*</span></label>
                        <input type="text" id="u-segundo-apellido" placeholder="Ej. GONZÁLEZ" required autocomplete="off" class="input-uppercase" />
                    </div>
                </div>

                <!-- ── NACIMIENTO Y GÉNERO ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Nacimiento <span class="req">*</span></label>
                        <input type="date" id="u-fecha-nac" required />
                    </div>
                    <div class="form-group">
                        <label>Género <span class="req">*</span></label>
                        <select id="u-genero" required class="form-select">
                            <option value="" disabled selected>Selecciona...</option>
                            <option value="MASCULINO">Masculino</option>
                            <option value="FEMENINO">Femenino</option>
                        </select>
                    </div>
                </div>

                <!-- ── CORREOS ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Correo Personal <span class="req">*</span></label>
                        <input type="email" id="u-correo-personal" placeholder="ejemplo@gmail.com" required autocomplete="off" class="form-input-full" />
                    </div>
                    <div class="form-group">
                        <label>Correo Institucional <span class="req">*</span></label>
                        <input type="email" id="u-correo-institucional" placeholder="usuario@itca.edu.sv" required autocomplete="off" class="form-input-full" />
                    </div>
                </div>

                <!-- ── TELÉFONOS ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Teléfono Móvil <span class="req">*</span></label>
                        <input type="text" id="u-tel-movil" placeholder="7777-8888" required autocomplete="off" maxlength="9" inputmode="numeric" />
                    </div>
                    <div class="form-group">
                        <label>Teléfono Fijo <span class="opt">(opcional)</span></label>
                        <input type="text" id="u-tel-fijo" placeholder="2222-3333" autocomplete="off" maxlength="9" inputmode="numeric" />
                    </div>
                </div>

                <!-- ── DIRECCIÓN ── -->
                <div class="form-group">
                    <label>Dirección <span class="req">*</span></label>
                    <input type="text" id="u-direccion" placeholder="Ej. Colonia X, Calle Y, Casa Z" required autocomplete="off" class="form-input-full" />
                </div>

                <!-- ── DUI ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo de DUI <span class="req">*</span></label>
                        <select id="u-dui-tipo" required class="form-select">
                            <option value="" disabled selected>Selecciona...</option>
                            <option value="PERSONAL">Personal</option>
                            <option value="RESPONSABLE">Del Responsable</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Número de DUI <span class="req">*</span></label>
                        <input type="text" id="u-dui" placeholder="00000000-0" required autocomplete="off" maxlength="10" inputmode="numeric" />
                    </div>
                </div>

                <!-- ── CARNETS ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Carnet <span class="req">*</span></label>
                        <input type="text" id="u-carnet" placeholder="Ej. 20231234" required autocomplete="off" inputmode="numeric" />
                    </div>
                    <div class="form-group">
                        <label>Carnet de Minoridad <span class="opt">(opcional)</span></label>
                        <input type="text" id="u-carnet-minoridad" placeholder="Ej. 654321" autocomplete="off" inputmode="numeric" />
                    </div>
                </div>

                <!-- ── CONTRASEÑA Y ROL ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Contraseña <span class="req">*</span></label>
                        <input type="password" id="u-password" placeholder="Crea una contraseña segura" required class="form-input-full" />
                    </div>
                    <div class="form-group">
                        <label>Rol <span class="req">*</span></label>
                        <select id="u-rol" required class="form-select">
                            <option value="" disabled selected>Selecciona un rol...</option>
                            <option value="1">ADMINISTRADOR</option>
                            <option value="2">MAESTRO</option>
                            <option value="3">ESTUDIANTE</option>
                        </select>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:15px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Usuario
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Formatos de inputs ───────────────────────────────────
    setupUppercase("u-primer-nombre");
    setupUppercase("u-segundo-nombre");
    setupUppercase("u-primer-apellido");
    setupUppercase("u-segundo-apellido");
    setupTelFormat("u-tel-movil");
    setupTelFormat("u-tel-fijo");
    setupDuiFormat("u-dui");
    setupNumericOnly("u-carnet");
    setupNumericOnly("u-carnet-minoridad");

    // ── Lógica de foto de perfil ─────────────────────────────
    let fotoBase64 = null;

    const fotoInput      = document.getElementById("u-foto-input");
    const btnElegirFoto  = document.getElementById("btn-elegir-foto");
    const btnQuitarFoto  = document.getElementById("btn-quitar-foto-form");
    const fotoCircle     = document.getElementById("foto-preview-circle");

    fotoCircle.addEventListener("click", () => fotoInput.click());
    btnElegirFoto.addEventListener("click", () => fotoInput.click());

    fotoInput.addEventListener("change", () => {
        const file = fotoInput.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("La imagen no puede superar los 2 MB.");
            fotoInput.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            fotoBase64 = e.target.result;
            fotoCircle.innerHTML = `<img src="${fotoBase64}" alt="Foto" style="width:100%;height:100%;object-fit:cover;" />`;
            btnQuitarFoto.style.display = "";
        };
        reader.readAsDataURL(file);
    });

    btnQuitarFoto.addEventListener("click", () => {
        fotoBase64 = null;
        fotoInput.value = "";
        fotoCircle.innerHTML = `<span class="material-symbols-rounded" style="font-size:2.2rem;">person</span>`;
        btnQuitarFoto.style.display = "none";
    });

    // ── Envío del formulario ─────────────────────────────────
    const form = document.getElementById("add-user-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        // Validación manual de campos requeridos
        const requeridos = [
            "u-primer-nombre", "u-segundo-nombre",
            "u-primer-apellido", "u-segundo-apellido",
            "u-fecha-nac", "u-genero",
            "u-correo-personal", "u-correo-institucional",
            "u-tel-movil", "u-direccion",
            "u-dui-tipo", "u-dui",
            "u-carnet", "u-password", "u-rol"
        ];
        let valido = true;
        requeridos.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.trim()) {
                el.style.borderColor = "#e74c3c";
                valido = false;
                el.addEventListener("input", () => el.style.borderColor = "", { once: true });
            }
        });
        if (!valido) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        // Limpiar teléfonos (quitar guión visual)
        const telMovilRaw = document.getElementById("u-tel-movil").value.replace("-", "").trim();
        const telFijoRaw  = document.getElementById("u-tel-fijo").value.replace("-", "").trim();
        // Limpiar DUI (quitar guión visual)
        const duiRaw = document.getElementById("u-dui").value.replace("-", "").trim();

        const nuevo = {
            primer_nombre:       document.getElementById("u-primer-nombre").value.trim(),
            segundo_nombre:      document.getElementById("u-segundo-nombre").value.trim(),
            primer_apellido:     document.getElementById("u-primer-apellido").value.trim(),
            segundo_apellido:    document.getElementById("u-segundo-apellido").value.trim(),
            fecha_nacimiento:    document.getElementById("u-fecha-nac").value,
            sexo:                document.getElementById("u-genero").value,
            correo_personal:     document.getElementById("u-correo-personal").value.trim(),
            correo_institucional:document.getElementById("u-correo-institucional").value.trim(),
            telefono_movil:      telMovilRaw,
            telefono_fijo:       telFijoRaw,
            direccion:           document.getElementById("u-direccion").value.trim(),
            dui_tipo:            document.getElementById("u-dui-tipo").value,
            dui:                 duiRaw,
            carnet:              document.getElementById("u-carnet").value.trim(),
            carnet_minoridad:    document.getElementById("u-carnet-minoridad").value.trim(),
            password:            document.getElementById("u-password").value,
            id_rol:              parseInt(document.getElementById("u-rol").value),
            foto_perfil:         fotoBase64 || null
        };

        fetch("http://127.0.0.1:5000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevo)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                fotoBase64 = null;
                fotoCircle.innerHTML = `<span class="material-symbols-rounded" style="font-size:2.2rem;">person</span>`;
                btnQuitarFoto.style.display = "none";
                alert("Usuario registrado correctamente");
            } else {
                alert(data.error || data.mensaje);
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor");
        });
    });
}


// ── VISTA: USUARIOS REGISTRADOS ──────────────────────────────
function renderViewAdminRegistrados(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">group</span> Usuarios Registrados</h1>
            <p>Consulta, edita o cambia el estado de los usuarios del sistema.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input type="text" id="search-input" placeholder="Buscar por nombre, correo o carnet..." class="search-input" autocomplete="off" />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="users-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre Completo</th>
                            <th>Correo Institucional</th>
                            <th>Carnet</th>
                            <th>Rol</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="users-tbody"></tbody>
                </table>
                <div id="empty-msg" class="empty-state">No hay usuarios registrados.</div>
            </div>
        </div>

        <!-- MODAL EDITAR USUARIO -->
        <div id="modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:740px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Usuario</h3>
                    <button id="modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <form id="edit-form" novalidate>
                    <input type="hidden" id="edit-index" />

                    <!-- FOTO DE PERFIL -->
                    <div class="form-group" style="margin-bottom:20px;">
                        <label>Foto de Perfil</label>
                        <div class="foto-upload-wrapper">
                            <div class="foto-preview" id="edit-foto-preview">
                                <span class="material-symbols-rounded" style="font-size:2.5rem;color:#ccc;">account_circle</span>
                            </div>
                            <div class="foto-upload-info">
                                <button type="button" class="btn-secondary" id="btn-edit-foto-upload">
                                    <span class="material-symbols-rounded">upload</span> Cambiar Foto
                                </button>
                                <span id="edit-foto-nombre" style="font-size:0.82rem;color:#999;margin-top:4px;display:block;">
                                    Sin cambios
                                </span>
                                <span style="font-size:0.78rem;color:#bbb;">JPG, PNG o WEBP · máx 2 MB</span>
                            </div>
                            <input type="file" id="edit-foto-input" accept="image/jpeg,image/png,image/webp" style="display:none;" />
                        </div>
                    </div>

                    <!-- NOMBRES -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Primer Nombre <span class="req">*</span></label>
                            <input type="text" id="edit-primer-nombre" required autocomplete="off" class="input-uppercase" />
                        </div>
                        <div class="form-group">
                            <label>Segundo Nombre <span class="req">*</span></label>
                            <input type="text" id="edit-segundo-nombre" required autocomplete="off" class="input-uppercase" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Primer Apellido <span class="req">*</span></label>
                            <input type="text" id="edit-primer-apellido" required autocomplete="off" class="input-uppercase" />
                        </div>
                        <div class="form-group">
                            <label>Segundo Apellido <span class="req">*</span></label>
                            <input type="text" id="edit-segundo-apellido" required autocomplete="off" class="input-uppercase" />
                        </div>
                    </div>

                    <!-- NACIMIENTO Y GÉNERO -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Fecha de Nacimiento <span class="req">*</span></label>
                            <input type="date" id="edit-fecha-nac" required />
                        </div>
                        <div class="form-group">
                            <label>Género <span class="req">*</span></label>
                            <select id="edit-genero" required class="form-select">
                                <option value="" disabled>Selecciona...</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMENINO">Femenino</option>
                            </select>
                        </div>
                    </div>

                    <!-- CORREOS -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Correo Personal <span class="req">*</span></label>
                            <input type="email" id="edit-correo-personal" required autocomplete="off" class="form-input-full" />
                        </div>
                        <div class="form-group">
                            <label>Correo Institucional <span class="req">*</span></label>
                            <input type="email" id="edit-correo-institucional" required autocomplete="off" class="form-input-full" />
                        </div>
                    </div>

                    <!-- TELÉFONOS -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Teléfono Móvil <span class="req">*</span></label>
                            <input type="text" id="edit-tel-movil" required autocomplete="off" maxlength="9" inputmode="numeric" />
                        </div>
                        <div class="form-group">
                            <label>Teléfono Fijo <span class="opt">(opcional)</span></label>
                            <input type="text" id="edit-tel-fijo" autocomplete="off" maxlength="9" inputmode="numeric" />
                        </div>
                    </div>

                    <!-- DIRECCIÓN -->
                    <div class="form-group">
                        <label>Dirección <span class="req">*</span></label>
                        <input type="text" id="edit-direccion" required autocomplete="off" class="form-input-full" />
                    </div>

                    <!-- DUI -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tipo de DUI <span class="req">*</span></label>
                            <select id="edit-dui-tipo" required class="form-select">
                                <option value="" disabled>Selecciona...</option>
                                <option value="PERSONAL">Personal</option>
                                <option value="RESPONSABLE">Del Responsable</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Número de DUI <span class="req">*</span></label>
                            <input type="text" id="edit-dui" required autocomplete="off" maxlength="10" inputmode="numeric" />
                        </div>
                    </div>

                    <!-- CARNETS -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Carnet <span class="req">*</span></label>
                            <input type="text" id="edit-carnet" required autocomplete="off" inputmode="numeric" />
                        </div>
                        <div class="form-group">
                            <label>Carnet de Minoridad <span class="opt">(opcional)</span></label>
                            <input type="text" id="edit-carnet-minoridad" autocomplete="off" inputmode="numeric" />
                        </div>
                    </div>

                    <!-- CONTRASEÑA Y ROL -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Contraseña <span class="opt">(dejar vacío para no cambiar)</span></label>
                            <div style="position:relative;">
                                <input type="password" id="edit-password" autocomplete="new-password"
                                    placeholder="Nueva contraseña..."
                                    class="form-input-full"
                                    style="padding-right:44px; width:100%;" />
                                <button type="button" id="edit-toggle-pass" tabindex="-1" style="
                                    position:absolute; right:10px; top:50%; transform:translateY(-50%);
                                    background:none; border:none; cursor:pointer; color:#888; padding:4px;
                                    display:flex; align-items:center;" title="Ver/ocultar contraseña">
                                    <span class="material-symbols-rounded" style="font-size:1.2rem;">visibility</span>
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Rol <span class="req">*</span></label>
                            <select id="edit-rol" required class="form-select">
                                <option value="1">Administrador</option>
                                <option value="2">Maestro</option>
                                <option value="3">Estudiante</option>
                            </select>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const ROLES   = { 1: "Admin", 2: "Maestro", 3: "Estudiante" };
    const tbody   = document.getElementById("users-tbody");
    const table   = document.getElementById("users-table");
    const emptyMsg= document.getElementById("empty-msg");
    const search  = document.getElementById("search-input");
    const overlay = document.getElementById("modal-overlay");
    const editForm= document.getElementById("edit-form");

    // TODO: reemplazar con fetch() GET /usuarios
    let usuarios = [];

    function nombreCompleto(u) {

    return [

        u.primer_nombre,
        u.segundo_nombre,
        u.primer_apellido,
        u.segundo_apellido

    ]
    .filter(Boolean)
    .join(" ");

}

    function renderTabla(lista) {
        tbody.innerHTML = "";
        if (lista.length === 0) {
            emptyMsg.style.display = "block";
            table.style.display    = "none";
            return;
        }
        emptyMsg.style.display = "none";
        table.style.display    = "table";

        lista.forEach(u => {
            const idx = usuarios.indexOf(u);
            const tr  = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${nombreCompleto(u)}</strong></td>
                <td>${u.correo_institucional}</td>
                <td>${u.carnet}</td>
                <td><span class="subject-tag">${ROLES[u.id_rol] || "—"}</span></td>
                <td style="text-align:center;">
                    <span class="status-badge ${u.estado === "ACTIVO" ? "attended" : "pending"}">
                        ${u.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                    </span>
                </td>
                <td style="text-align:center;">
                    <div style="display:flex;gap:6px;justify-content:center;">
                        <button class="btn-icon btn-edit" data-idx="${idx}" title="Editar">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${u.estado === "ACTIVO" ? "btn-icon-danger" : "btn-icon-success"} btn-toggle" data-idx="${idx}" title="${u.estado === "ACTIVO" ? "Deshabilitar" : "Habilitar"}">
                            <span class="material-symbols-rounded">${u.estado === "ACTIVO" ? "block" : "check_circle"}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)));
        });
        tbody.querySelectorAll(".btn-toggle").forEach(btn => {

    btn.addEventListener("click", () => {

        const i = parseInt(btn.dataset.idx);

        const usuario = usuarios[i];

        const nuevoEstado =
            usuario.estado === "ACTIVO"
            ? "INACTIVO"
            : "ACTIVO";

        fetch(
            `http://127.0.0.1:5000/usuarios/${usuario.id_usuario}/estado`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    estado: nuevoEstado
                })
            }
        )

        .then(res => res.json())

        .then(data => {

            if(data.success){

                usuario.estado = nuevoEstado;

                renderTabla(filtrar());

            }else{

                alert(data.mensaje);

            }

        })

        .catch(error => {

            console.error(error);

            alert("Error al cambiar estado");

        });

    });

});
    }

    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q ? usuarios.filter(u =>
            nombreCompleto(u).toLowerCase().includes(q) ||
            u.correo_institucional.toLowerCase().includes(q)||
            u.carnet.toLowerCase().includes(q)
        ) : [...usuarios];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // Modal — abrir y poblar todos los campos
    function abrirModal(idx) {
        const u = usuarios[idx];
        document.getElementById("edit-index").value                = idx;
        document.getElementById("edit-primer-nombre").value        = u.primer_nombre || "";
        document.getElementById("edit-segundo-nombre").value       = u.segundo_nombre || "";
        document.getElementById("edit-primer-apellido").value      = u.primer_apellido || "";
        document.getElementById("edit-segundo-apellido").value     = u.segundo_apellido || "";
        document.getElementById("edit-fecha-nac").value            = u.fecha_nacimiento || "";
        document.getElementById("edit-genero").value               = u.sexo || "";
        document.getElementById("edit-correo-personal").value      = u.correo_personal || "";
        document.getElementById("edit-correo-institucional").value = u.correo_institucional || "";
        // Teléfonos: formatear visualmente con guión si llegan sin él
        const fmtTel = v => v && v.length === 8 ? v.slice(0,4) + "-" + v.slice(4) : (v || "");
        document.getElementById("edit-tel-movil").value            = fmtTel(u.telefono_movil);
        document.getElementById("edit-tel-fijo").value             = fmtTel(u.telefono_fijo);
        document.getElementById("edit-direccion").value            = u.direccion || "";
        document.getElementById("edit-dui-tipo").value             = u.dui_tipo || "";
        // DUI: formatear con guión si llega limpio (9 dígitos)
        const rawDui = u.dui || "";
        document.getElementById("edit-dui").value = rawDui.length === 9
            ? rawDui.slice(0,8) + "-" + rawDui.slice(8)
            : rawDui;
        document.getElementById("edit-carnet").value               = u.carnet || "";
        document.getElementById("edit-carnet-minoridad").value     = u.carnet_minoridad || "";
        document.getElementById("edit-password").value             = "";
        document.getElementById("edit-rol").value                  = u.id_rol || 3;

        // Resetear ojito al abrir
        const passInput  = document.getElementById("edit-password");
        const toggleBtn  = document.getElementById("edit-toggle-pass");
        passInput.type   = "password";
        toggleBtn.querySelector(".material-symbols-rounded").textContent = "visibility";

        // Foto: mostrar la actual o el ícono por defecto
        const editFotoPreview = document.getElementById("edit-foto-preview");
        editFotoPreview._nuevaFoto = null; // resetear foto pendiente
        if (u.foto_perfil) {
            editFotoPreview.innerHTML = `<img src="${u.foto_perfil}" alt="Foto" style="width:80px;height:80px;border-radius:50%;object-fit:cover;" />`;
        } else {
            editFotoPreview.innerHTML = `<span class="material-symbols-rounded" style="font-size:2.5rem;color:#ccc;">account_circle</span>`;
        }
        document.getElementById("edit-foto-nombre").textContent = "Sin cambios";

        overlay.style.display = "flex";

        // Activar formatos en los inputs del modal
        setupUppercase("edit-primer-nombre");
        setupUppercase("edit-segundo-nombre");
        setupUppercase("edit-primer-apellido");
        setupUppercase("edit-segundo-apellido");
        setupTelFormat("edit-tel-movil");
        setupTelFormat("edit-tel-fijo");
        setupDuiFormat("edit-dui");
        setupNumericOnly("edit-carnet");
        setupNumericOnly("edit-carnet-minoridad");

        // Toggle de visibilidad de contraseña
        toggleBtn.onclick = () => {
            const esPassword = passInput.type === "password";
            passInput.type = esPassword ? "text" : "password";
            toggleBtn.querySelector(".material-symbols-rounded").textContent =
                esPassword ? "visibility_off" : "visibility";
        };

        // Foto: botón subir y leer archivo
        const btnEditFoto  = document.getElementById("btn-edit-foto-upload");
        const editFotoInput = document.getElementById("edit-foto-input");
        const editFotoNombre = document.getElementById("edit-foto-nombre");

        // Clonar para eliminar listeners anteriores
        const btnEditFotoClone = btnEditFoto.cloneNode(true);
        btnEditFoto.parentNode.replaceChild(btnEditFotoClone, btnEditFoto);
        const editFotoInputClone = editFotoInput.cloneNode(true);
        editFotoInput.parentNode.replaceChild(editFotoInputClone, editFotoInput);

        btnEditFotoClone.addEventListener("click", () => editFotoInputClone.click());

        editFotoInputClone.addEventListener("change", () => {
            const file = editFotoInputClone.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                alert("La imagen no puede superar los 2 MB.");
                editFotoInputClone.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                const dataUrl = e.target.result;
                fotoPreviewEl.innerHTML = `<img src="${dataUrl}" alt="Nueva foto" style="width:80px;height:80px;border-radius:50%;object-fit:cover;" />`;
                fotoPreviewEl._nuevaFoto = dataUrl;
                editFotoNombre.textContent = file.name;
            };
            reader.readAsDataURL(file);
        });
    }

    function cerrarModal() { overlay.style.display = "none"; }

    document.getElementById("modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const idx     = parseInt(document.getElementById("edit-index").value);
        const usuario = usuarios[idx];

        // Validación de campos requeridos en el modal
        const requeridos = [
            "edit-primer-nombre", "edit-segundo-nombre",
            "edit-primer-apellido", "edit-segundo-apellido",
            "edit-fecha-nac", "edit-genero",
            "edit-correo-personal", "edit-correo-institucional",
            "edit-tel-movil", "edit-direccion",
            "edit-dui-tipo", "edit-dui",
            "edit-carnet", "edit-rol"
        ];
        let valido = true;
        requeridos.forEach(id => {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                if (el) {
                    el.style.borderColor = "#e74c3c";
                    el.addEventListener("input", () => el.style.borderColor = "", { once: true });
                }
                valido = false;
            }
        });
        if (!valido) { alert("Por favor completa todos los campos obligatorios."); return; }

        const datos = {
            primer_nombre:        document.getElementById("edit-primer-nombre").value.trim(),
            segundo_nombre:       document.getElementById("edit-segundo-nombre").value.trim(),
            primer_apellido:      document.getElementById("edit-primer-apellido").value.trim(),
            segundo_apellido:     document.getElementById("edit-segundo-apellido").value.trim(),
            fecha_nacimiento:     document.getElementById("edit-fecha-nac").value,
            sexo:                 document.getElementById("edit-genero").value,
            correo_personal:      document.getElementById("edit-correo-personal").value.trim(),
            correo_institucional: document.getElementById("edit-correo-institucional").value.trim(),
            telefono_movil:       document.getElementById("edit-tel-movil").value.replace("-", "").trim(),
            telefono_fijo:        document.getElementById("edit-tel-fijo").value.replace("-", "").trim(),
            direccion:            document.getElementById("edit-direccion").value.trim(),
            dui_tipo:             document.getElementById("edit-dui-tipo").value,
            dui:                  document.getElementById("edit-dui").value.replace("-", "").trim(),
            carnet:               document.getElementById("edit-carnet").value.trim(),
            carnet_minoridad:     document.getElementById("edit-carnet-minoridad").value.trim(),
            id_rol:               parseInt(document.getElementById("edit-rol").value)
        };

        // Incluir foto si el admin subió una nueva
        const fotoPreviewEl = document.getElementById("edit-foto-preview");
        if (fotoPreviewEl && fotoPreviewEl._nuevaFoto) {
            datos.foto_perfil = fotoPreviewEl._nuevaFoto;
        }

        // Solo incluir contraseña si el admin escribió algo
        const nuevaPass = document.getElementById("edit-password").value;
        if (nuevaPass.trim()) datos.password = nuevaPass;

        fetch(`http://127.0.0.1:5000/usuarios/${usuario.id_usuario}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Usuario actualizado correctamente");
                cerrarModal();
                location.reload();
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al actualizar usuario");
        });
    });

    fetch("http://127.0.0.1:5000/usuarios")
    .then(res => res.json())
    .then(data => {

        if(data.success){

            usuarios = data.usuarios;

            renderTabla(usuarios);

        }

    })
    .catch(error => {

        console.error(error);

        alert("Error al cargar usuarios");

    });
}