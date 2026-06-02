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
                            <option value="MASCULINO">Masculino</option>
                            <option value="FEMENINO">Femenino</option>
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

    const form = document.getElementById("add-user-form");
    form.addEventListener("submit", e => {
        e.preventDefault();

        const nuevo = {
            primer_nombre: document.getElementById("u-primer-nombre").value.trim(),
            segundo_nombre: document.getElementById("u-segundo-nombre").value.trim(),

            primer_apellido: document.getElementById("u-primer-apellido").value.trim(),
            segundo_apellido: document.getElementById("u-segundo-apellido").value.trim(),

            fecha_nacimiento: document.getElementById("u-fecha-nac").value,

            sexo: document.getElementById("u-genero").value,

            correo_personal: document.getElementById("u-correo-personal").value.trim(),

            correo_institucional: document.getElementById("u-correo-institucional").value.trim(),

            telefono_movil: document.getElementById("u-tel-movil").value.trim(),

            telefono_fijo: document.getElementById("u-tel-fijo").value.trim(),

            direccion: document.getElementById("u-direccion").value.trim(),

            dui: document.getElementById("u-dui").value.trim(),

            carnet: document.getElementById("u-carnet").value.trim(),

            carnet_minoridad: document.getElementById("u-carnet-minoridad").value.trim(),

            password: document.getElementById("u-password").value,

            id_rol: parseInt(document.getElementById("u-rol").value)
        };


        // TODO: reemplazar con fetch() POST /usuarios
        fetch("http://127.0.0.1:5000/usuarios", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevo)
})
.then(res => res.json())
.then(data => {

    if(data.success){

        form.reset();

        alert("Usuario registrado correctamente");

    }else{

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

    // Modal
    function abrirModal(idx) {
        const u = usuarios[idx];
        document.getElementById("edit-index").value             = idx;
        document.getElementById("edit-primer-nombre").value     = u.primer_nombre || "";
        document.getElementById("edit-segundo-nombre").value    = u.segundo_nombre || "";
        document.getElementById("edit-primer-apellido").value   = u.primer_apellido || "";
        document.getElementById("edit-segundo-apellido").value  = u.segundo_apellido || "";
        document.getElementById("edit-correo-personal").value   = u.correo_personal || "";
        document.getElementById("edit-correo-institucional").value = u.correo_institucional || "";
        document.getElementById("edit-tel-movil").value         = u.telefono_movil || "";
        document.getElementById("edit-carnet").value            = u.carnet || "";
        document.getElementById("edit-rol").value               = u.id_rol || 3;
        document.getElementById("edit-direccion").value         = u.direccion || "";
        overlay.style.display = "flex";
    }

    function cerrarModal() { overlay.style.display = "none"; }

    document.getElementById("modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    editForm.addEventListener("submit", e => {

    e.preventDefault();

    const idx = parseInt(
        document.getElementById("edit-index").value
    );

    const usuario = usuarios[idx];

    console.log(usuario);
    console.log(usuario.id_usuario);

    const datos = {

        primer_nombre: document.getElementById("edit-primer-nombre").value.trim(),

        segundo_nombre: document.getElementById("edit-segundo-nombre").value.trim(),

        primer_apellido: document.getElementById("edit-primer-apellido").value.trim(),

        segundo_apellido: document.getElementById("edit-segundo-apellido").value.trim(),

        correo_personal: document.getElementById("edit-correo-personal").value.trim(),

        correo_institucional: document.getElementById("edit-correo-institucional").value.trim(),

        telefono_movil: document.getElementById("edit-tel-movil").value.trim(),

        carnet: document.getElementById("edit-carnet").value.trim(),

        direccion: document.getElementById("edit-direccion").value.trim(),

        id_rol: parseInt(
            document.getElementById("edit-rol").value
        )

    };

    fetch(`http://127.0.0.1:5000/usuarios/${usuario.id_usuario}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(datos)

    })

    .then(res => res.json())

    .then(data => {

        if(data.success){

            alert("Usuario actualizado correctamente");

            cerrarModal();

            location.reload();

        }else{

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