// ============================================================
//  views/admin.js — Vistas del Administrador
// ============================================================

// ── VISTA: ADMINISTRACIÓN DE USUARIOS ────────────────────────
function renderViewAdminUsuarios(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">manage_accounts</span> Administración de Usuarios</h1>
            <p>Registra un nuevo usuario en el sistema con todos sus datos.</p>
        </div>

        <div class="admin-card" style="max-width:900px;">
            <h3><span class="material-symbols-rounded">badge</span> Nuevo Usuario</h3>

            <form id="add-user-form">

                <div class="form-row">
                    <div class="form-group">
                        <label>Primer Nombre <span class="req">*</span></label>
                        <input type="text" id="u-primer-nombre" placeholder="Ej. Juan" required autocomplete="off" />
                    </div>
                    <div class="form-group">
                        <label>Segundo Nombre <span class="opt">(opcional)</span></label>
                        <input type="text" id="u-segundo-nombre" placeholder="Ej. Carlos" autocomplete="off" />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Primer Apellido <span class="req">*</span></label>
                        <input type="text" id="u-primer-apellido" placeholder="Ej. Pérez" required autocomplete="off" />
                    </div>
                    <div class="form-group">
                        <label>Segundo Apellido <span class="opt">(opcional)</span></label>
                        <input type="text" id="u-segundo-apellido" placeholder="Ej. González" autocomplete="off" />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Nacimiento <span class="req">*</span></label>
                        <input type="date" id="u-fecha-nac" required />
                    </div>
                    <div class="form-group">
                        <label>Género <span class="req">*</span></label>
                        <select id="u-genero" required class="form-select">
                            <option value="" disabled selected>Selecciona...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="O">Otro</option>
                        </select>
                    </div>
                </div>

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

                <div class="form-row">
                    <div class="form-group">
                        <label>Teléfono Móvil <span class="req">*</span></label>
                        <input type="tel" id="u-tel-movil" placeholder="Ej. 7777-8888" required autocomplete="off" />
                    </div>
                    <div class="form-group">
                        <label>Teléfono Fijo <span class="opt">(opcional)</span></label>
                        <input type="tel" id="u-tel-fijo" placeholder="Ej. 2222-3333" autocomplete="off" />
                    </div>
                </div>

                <div class="form-group">
                    <label>Dirección <span class="req">*</span></label>
                    <input type="text" id="u-direccion" placeholder="Ej. Colonia X, Calle Y, Casa Z" required autocomplete="off" class="form-input-full" />
                </div>

                <div class="form-row form-row-3">
                    <div class="form-group">
                        <label>DUI <span class="req">*</span></label>
                        <input type="text" id="u-dui" placeholder="00000000-0" required autocomplete="off" />
                    </div>
                    <div class="form-group">
                        <label>Carnet <span class="req">*</span></label>
                        <input type="text" id="u-carnet" placeholder="Ej. 123456" required autocomplete="off" />
                    </div>
                    <div class="form-group">
                        <label>Carnet de Minoridad <span class="opt">(opcional)</span></label>
                        <input type="text" id="u-carnet-minoridad" placeholder="Ej. 654321" autocomplete="off" />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Contraseña <span class="req">*</span></label>
                        <input type="password" id="u-password" placeholder="Crea una contraseña segura" required class="form-input-full" />
                    </div>
                    <div class="form-group">
                        <label>Rol <span class="req">*</span></label>
                        <select id="u-rol" required class="form-select">
                            <option value="" disabled selected>Selecciona un rol...</option>
                            <option value="1">Admin</option>
                            <option value="2">Maestro</option>
                            <option value="3">Estudiante</option>
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

    const form = document.getElementById("add-user-form");
    form.addEventListener("submit", e => {
        e.preventDefault();

        const nuevo = {
            primerNombre:        document.getElementById("u-primer-nombre").value.trim(),
            segundoNombre:       document.getElementById("u-segundo-nombre").value.trim(),
            primerApellido:      document.getElementById("u-primer-apellido").value.trim(),
            segundoApellido:     document.getElementById("u-segundo-apellido").value.trim(),
            fechaNacimiento:     document.getElementById("u-fecha-nac").value,
            genero:              document.getElementById("u-genero").value,
            correoPersonal:      document.getElementById("u-correo-personal").value.trim(),
            correoInstitucional: document.getElementById("u-correo-institucional").value.trim(),
            telMovil:            document.getElementById("u-tel-movil").value.trim(),
            telFijo:             document.getElementById("u-tel-fijo").value.trim(),
            direccion:           document.getElementById("u-direccion").value.trim(),
            dui:                 document.getElementById("u-dui").value.trim(),
            carnet:              document.getElementById("u-carnet").value.trim(),
            carnetMinoridad:     document.getElementById("u-carnet-minoridad").value.trim(),
            rol:                 parseInt(document.getElementById("u-rol").value),
            activo:              true
        };

        // TODO: reemplazar con fetch() POST /usuarios
        const lista = JSON.parse(localStorage.getItem("sami_usuarios_v2")) || [];
        lista.push(nuevo);
        localStorage.setItem("sami_usuarios_v2", JSON.stringify(lista));

        form.reset();
        const btn = form.querySelector(".btn-primary");
        btn.innerHTML = `<span class="material-symbols-rounded">check_circle</span> ¡Usuario Guardado!`;
        btn.style.background = "#4CAF50";
        setTimeout(() => {
            btn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar Usuario`;
            btn.style.background = "";
        }, 2500);
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

        <!-- MODAL -->
        <div id="modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Usuario</h3>
                    <button id="modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <form id="edit-form">
                    <input type="hidden" id="edit-index" />
                    <div class="form-row">
                        <div class="form-group">
                            <label>Primer Nombre</label>
                            <input type="text" id="edit-primer-nombre" required autocomplete="off" />
                        </div>
                        <div class="form-group">
                            <label>Segundo Nombre</label>
                            <input type="text" id="edit-segundo-nombre" autocomplete="off" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Primer Apellido</label>
                            <input type="text" id="edit-primer-apellido" required autocomplete="off" />
                        </div>
                        <div class="form-group">
                            <label>Segundo Apellido</label>
                            <input type="text" id="edit-segundo-apellido" autocomplete="off" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Correo Personal</label>
                            <input type="email" id="edit-correo-personal" required autocomplete="off" class="form-input-full" />
                        </div>
                        <div class="form-group">
                            <label>Correo Institucional</label>
                            <input type="email" id="edit-correo-institucional" required autocomplete="off" class="form-input-full" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Teléfono Móvil</label>
                            <input type="tel" id="edit-tel-movil" autocomplete="off" />
                        </div>
                        <div class="form-group">
                            <label>Carnet</label>
                            <input type="text" id="edit-carnet" autocomplete="off" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Rol</label>
                            <select id="edit-rol" class="form-select">
                                <option value="1">Admin</option>
                                <option value="2">Maestro</option>
                                <option value="3">Estudiante</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Dirección</label>
                            <input type="text" id="edit-direccion" autocomplete="off" class="form-input-full" />
                        </div>
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:15px;">
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
    let usuarios = JSON.parse(localStorage.getItem("sami_usuarios_v2")) || [];

    function nombreCompleto(u) {
        return [u.primerNombre, u.segundoNombre, u.primerApellido, u.segundoApellido]
            .filter(Boolean).join(" ");
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
                <td>${u.correoInstitucional}</td>
                <td>${u.carnet}</td>
                <td><span class="subject-tag">${ROLES[u.rol] || "—"}</span></td>
                <td style="text-align:center;">
                    <span class="status-badge ${u.activo ? "attended" : "pending"}">
                        ${u.activo ? "Activo" : "Inactivo"}
                    </span>
                </td>
                <td style="text-align:center;">
                    <div style="display:flex;gap:6px;justify-content:center;">
                        <button class="btn-icon btn-edit" data-idx="${idx}" title="Editar">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${u.activo ? "btn-icon-danger" : "btn-icon-success"} btn-toggle" data-idx="${idx}" title="${u.activo ? "Deshabilitar" : "Habilitar"}">
                            <span class="material-symbols-rounded">${u.activo ? "block" : "check_circle"}</span>
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
                usuarios[i].activo = !usuarios[i].activo;
                localStorage.setItem("sami_usuarios_v2", JSON.stringify(usuarios));
                renderTabla(filtrar());
            });
        });
    }

    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q ? usuarios.filter(u =>
            nombreCompleto(u).toLowerCase().includes(q) ||
            u.correoInstitucional.toLowerCase().includes(q) ||
            u.carnet.toLowerCase().includes(q)
        ) : [...usuarios];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // Modal
    function abrirModal(idx) {
        const u = usuarios[idx];
        document.getElementById("edit-index").value             = idx;
        document.getElementById("edit-primer-nombre").value     = u.primerNombre || "";
        document.getElementById("edit-segundo-nombre").value    = u.segundoNombre || "";
        document.getElementById("edit-primer-apellido").value   = u.primerApellido || "";
        document.getElementById("edit-segundo-apellido").value  = u.segundoApellido || "";
        document.getElementById("edit-correo-personal").value   = u.correoPersonal || "";
        document.getElementById("edit-correo-institucional").value = u.correoInstitucional || "";
        document.getElementById("edit-tel-movil").value         = u.telMovil || "";
        document.getElementById("edit-carnet").value            = u.carnet || "";
        document.getElementById("edit-rol").value               = u.rol || 3;
        document.getElementById("edit-direccion").value         = u.direccion || "";
        overlay.style.display = "flex";
    }

    function cerrarModal() { overlay.style.display = "none"; }

    document.getElementById("modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    editForm.addEventListener("submit", e => {
        e.preventDefault();
        const idx = parseInt(document.getElementById("edit-index").value);
        usuarios[idx] = {
            ...usuarios[idx],
            primerNombre:        document.getElementById("edit-primer-nombre").value.trim(),
            segundoNombre:       document.getElementById("edit-segundo-nombre").value.trim(),
            primerApellido:      document.getElementById("edit-primer-apellido").value.trim(),
            segundoApellido:     document.getElementById("edit-segundo-apellido").value.trim(),
            correoPersonal:      document.getElementById("edit-correo-personal").value.trim(),
            correoInstitucional: document.getElementById("edit-correo-institucional").value.trim(),
            telMovil:            document.getElementById("edit-tel-movil").value.trim(),
            carnet:              document.getElementById("edit-carnet").value.trim(),
            rol:                 parseInt(document.getElementById("edit-rol").value),
            direccion:           document.getElementById("edit-direccion").value.trim()
        };
        localStorage.setItem("sami_usuarios_v2", JSON.stringify(usuarios));
        cerrarModal();
        renderTabla(filtrar());
    });

    renderTabla(usuarios);
}