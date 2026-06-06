// ============================================================
//  views/inscripciones.js — Inscripciones (Admin)
// ============================================================

// ── VISTA: REGISTRAR INSCRIPCIÓN ──────────────────────────────
function renderViewRegistrarInscripcion(container) {

    // El usuario activo viene de window.SAMI.usuario (seteado en app.js)
    const usuarioActivo = window.SAMI?.usuario || {};

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">how_to_reg</span> Registrar Inscripción</h1>
            <p>Inscribe un estudiante en un grupo y asigna al responsable del registro.</p>
        </div>

        <div class="admin-card" style="max-width:760px;">
            <h3><span class="material-symbols-rounded">add_circle</span> Nueva Inscripción</h3>

            <form id="add-ins-form" novalidate>

                <!-- ── ESTUDIANTE Y GRUPO ── -->
                <div class="form-row">
                    <div class="form-group">
                        <!-- BACKEND: GET /estudiantes → { success: true, estudiantes: [{ id_usuario, nombre_completo, carnet }] }
                             Usuarios con id_rol = 3 (ESTUDIANTE) y estado = 'ACTIVO' -->
                        <label>Estudiante <span class="req">*</span></label>
                        <select id="ins-estudiante" required class="form-select">
                            <option value="" disabled selected>Cargando estudiantes...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <!-- BACKEND: GET /grupos → { success: true, grupos: [{ id_grupo, nombre_grupo }] }
                             Filtrar estado = 'ACTIVO' -->
                        <label>Grupo <span class="req">*</span></label>
                        <select id="ins-grupo" required class="form-select">
                            <option value="" disabled selected>Cargando grupos...</option>
                        </select>
                    </div>
                </div>

                <!-- ── USUARIO DE REGISTRO ── -->
                <div class="form-group">
                    <label>Registrado por <span class="req">*</span></label>
                    <!-- BACKEND: GET /docentes → { success: true, docentes: [{ id_usuario, nombre_completo }] }
                         Usuarios con id_rol = 2 (DOCENTE) y estado = 'ACTIVO'.
                         El select se pre-llena con el usuario activo, pero el admin puede cambiarlo. -->
                    <select id="ins-registrador" required class="form-select">
                        <option value="" disabled selected>Cargando...</option>
                    </select>
                    <small style="color:#aaa; font-size:0.78rem;">
                        Se asigna automáticamente el usuario en sesión. El administrador puede cambiarlo.
                    </small>
                </div>

                <!-- ── FECHA DE INSCRIPCIÓN ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Inscripción <span class="req">*</span></label>
                        <input
                            type="datetime-local"
                            id="ins-fecha"
                            required
                        />
                    </div>
                </div>

                <!-- ── OBSERVACIÓN ── -->
                <div class="form-group">
                    <label>Observación <span class="opt">(opcional)</span></label>
                    <input
                        type="text"
                        id="ins-observacion"
                        placeholder="Ej. Inscripción tardía autorizada por coordinación"
                        autocomplete="off"
                        maxlength="255"
                        class="form-input-full"
                    />
                    <small style="color:#aaa; font-size:0.78rem;">Máx. 255 caracteres</small>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Inscripción
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Pre-llenar fecha con ahora ────────────────────────────
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    document.getElementById("ins-fecha").value = ahora.toISOString().slice(0, 16);

    // ── Helper genérico de select ─────────────────────────────
    function cargarSelect(selectId, endpoint, campoId, campoLabel, textoError, idPreseleccionar) {
        const select = document.getElementById(selectId);
        fetch(`http://127.0.0.1:5000/${endpoint}`)
            .then(res => res.json())
            .then(data => {
                const key   = Object.keys(data).find(k => Array.isArray(data[k]));
                const lista = key ? data[key] : [];
                if (data.success && lista.length > 0) {
                    select.innerHTML = `<option value="" disabled>Selecciona una opción...</option>`;
                    lista.forEach(item => {
                        const opt       = document.createElement("option");
                        opt.value       = item[campoId];
                        opt.textContent = item[campoLabel];
                        if (idPreseleccionar && item[campoId] === idPreseleccionar) opt.selected = true;
                        select.appendChild(opt);
                    });
                    // Si ninguna quedó seleccionada y no hay preselección, poner placeholder
                    if (!select.value) {
                        const ph = document.createElement("option");
                        ph.value    = "";
                        ph.disabled = true;
                        ph.selected = true;
                        ph.textContent = "Selecciona una opción...";
                        select.insertBefore(ph, select.firstChild);
                    }
                } else {
                    select.innerHTML = `<option value="" disabled selected>Sin registros disponibles</option>`;
                }
            })
            .catch(() => {
                select.innerHTML = `<option value="" disabled selected>${textoError}</option>`;
            });
    }

    cargarSelect("ins-estudiante", "estudiantes", "id_usuario", "nombre_completo", "Error al cargar estudiantes", null);
    cargarSelect("ins-grupo",      "grupos",      "id_grupo",   "nombre_grupo",    "Error al cargar grupos",      null);

    // ── Registrador: fusiona admins (rol 1) + docentes (rol 2) ─
    // BACKEND: GET /admins   → { success: true, admins:   [{ id_usuario, nombre_completo }] }
    // BACKEND: GET /docentes → { success: true, docentes: [{ id_usuario, nombre_completo }] }
    const selectRegistrador = document.getElementById("ins-registrador");
    Promise.all([
        fetch("http://127.0.0.1:5000/admins").then(r => r.json()).catch(() => ({ success: false })),
        fetch("http://127.0.0.1:5000/docentes").then(r => r.json()).catch(() => ({ success: false }))
    ]).then(([dataAdmins, dataDocentes]) => {
        const admins   = (dataAdmins.success   ? dataAdmins.admins    : []) || [];
        const docentes = (dataDocentes.success  ? dataDocentes.docentes : []) || [];

        // Fusionar evitando duplicados por id_usuario
        const todos = [...admins];
        docentes.forEach(d => {
            if (!todos.find(a => a.id_usuario === d.id_usuario)) todos.push(d);
        });

        if (todos.length > 0) {
            selectRegistrador.innerHTML = `<option value="" disabled>Selecciona una opción...</option>`;
            todos.forEach(u => {
                const opt       = document.createElement("option");
                opt.value       = u.id_usuario;
                opt.textContent = u.nombre_completo;
                if (u.id_usuario === usuarioActivo.id_usuario) opt.selected = true;
                selectRegistrador.appendChild(opt);
            });
            // Si el usuario activo no quedó seleccionado (no estaba en ninguna lista), dejar placeholder
            if (!selectRegistrador.value) {
                selectRegistrador.options[0].selected = true;
            }
        } else {
            selectRegistrador.innerHTML = `<option value="" disabled selected>Sin usuarios disponibles</option>`;
        }
    });

    // ── Envío del formulario ──────────────────────────────────
    const form = document.getElementById("add-ins-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = ["ins-estudiante", "ins-grupo", "ins-registrador", "ins-fecha"];
        let valido = true;

        requeridos.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value) {
                el.style.borderColor = "#e74c3c";
                valido = false;
                el.addEventListener("change", () => el.style.borderColor = "", { once: true });
                el.addEventListener("input",  () => el.style.borderColor = "", { once: true });
            }
        });

        if (!valido) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const nueva = {
            id_usuario:          parseInt(document.getElementById("ins-estudiante").value),
            id_grupo:            parseInt(document.getElementById("ins-grupo").value),
            id_usuario_registro: parseInt(document.getElementById("ins-registrador").value),
            fecha_inscripcion:   document.getElementById("ins-fecha").value,
            observacion:         document.getElementById("ins-observacion").value.trim() || null,
        };

        fetch("http://127.0.0.1:5000/inscripciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nueva)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                // Restaurar fecha y registrador tras reset
                const ahora2 = new Date();
                ahora2.setMinutes(ahora2.getMinutes() - ahora2.getTimezoneOffset());
                document.getElementById("ins-fecha").value = ahora2.toISOString().slice(0, 16);
                // Re-preseleccionar el registrador activo
                const opts = document.getElementById("ins-registrador").options;
                for (let i = 0; i < opts.length; i++) {
                    if (parseInt(opts[i].value) === usuarioActivo.id_usuario) {
                        opts[i].selected = true;
                        break;
                    }
                }
                alert("Inscripción registrada correctamente.");
            } else {
                // uk_inscripcion_unica: mismo estudiante ya inscrito en ese grupo
                alert(data.error || data.mensaje || "No se pudo registrar la inscripción.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });
}


// ── VISTA: VER INSCRIPCIONES ──────────────────────────────────
function renderViewVerInscripciones(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">list_alt</span> Inscripciones Registradas</h1>
            <p>Consulta, edita o cambia el estado de las inscripciones.</p>
        </div>

        <div class="admin-card">
            <!-- Barra de búsqueda -->
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="ins-search-input"
                    placeholder="Buscar por estudiante, grupo o estado..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <!-- Tabla -->
            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="ins-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th>Grupo</th>
                            <th>Registrado por</th>
                            <th>Fecha</th>
                            <th>Observación</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="ins-tbody"></tbody>
                </table>
                <div id="ins-empty-msg" class="empty-state">No hay inscripciones registradas.</div>
            </div>
        </div>

        <!-- MODAL EDITAR INSCRIPCIÓN -->
        <div id="ins-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:640px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Inscripción</h3>
                    <button id="ins-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="ins-edit-form" novalidate>
                    <input type="hidden" id="edit-ins-id" />

                    <!-- ESTUDIANTE y GRUPO — no editables, solo referencia -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Estudiante</label>
                            <input type="text" id="edit-ins-estudiante-label" class="form-input-full" disabled
                                style="background:#f5f5f5; color:#888; cursor:not-allowed;" />
                        </div>
                        <div class="form-group">
                            <label>Grupo</label>
                            <input type="text" id="edit-ins-grupo-label" class="form-input-full" disabled
                                style="background:#f5f5f5; color:#888; cursor:not-allowed;" />
                        </div>
                    </div>

                    <!-- REGISTRADO POR y ESTADO -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Registrado por <span class="req">*</span></label>
                            <select id="edit-ins-registrador" required class="form-select">
                                <option value="" disabled>Cargando...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Estado <span class="req">*</span></label>
                            <select id="edit-ins-estado" required class="form-select">
                                <option value="ACTIVA">Activa</option>
                                <option value="RETIRADA">Retirada</option>
                                <option value="FINALIZADA">Finalizada</option>
                                <option value="GRADUADA">Graduada</option>
                            </select>
                        </div>
                    </div>

                    <!-- FECHA -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Fecha de Inscripción <span class="req">*</span></label>
                            <input type="datetime-local" id="edit-ins-fecha" required />
                        </div>
                    </div>

                    <!-- OBSERVACIÓN -->
                    <div class="form-group">
                        <label>Observación <span class="opt">(opcional)</span></label>
                        <input type="text" id="edit-ins-observacion" autocomplete="off"
                            maxlength="255" class="form-input-full" />
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="ins-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody    = document.getElementById("ins-tbody");
    const table    = document.getElementById("ins-table");
    const emptyMsg = document.getElementById("ins-empty-msg");
    const search   = document.getElementById("ins-search-input");
    const overlay  = document.getElementById("ins-modal-overlay");
    const editForm = document.getElementById("ins-edit-form");

    let inscripciones       = [];
    let catalogoEstudiantes = [];
    let catalogoGrupos      = [];
    let catalogoDocentes    = [];

    // ── Colores y etiquetas de estado ─────────────────────────
    const estadoConfig = {
        ACTIVA:     { color: "#1a8a4a", bg: "#e6f9f0", icon: "check_circle"    },
        RETIRADA:   { color: "#c0392b", bg: "#fdecea", icon: "cancel"          },
        FINALIZADA: { color: "#7f8c8d", bg: "#f0f0f0", icon: "task_alt"        },
        GRADUADA:   { color: "#8e44ad", bg: "#f5eef8", icon: "workspace_premium"}
    };

    function badgeEstado(estado) {
        const cfg = estadoConfig[estado] || estadoConfig.ACTIVA;
        return `<span style="
            display:inline-flex; align-items:center; gap:4px;
            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
            background:${cfg.bg}; color:${cfg.color};
        ">
            <span class="material-symbols-rounded" style="font-size:0.85rem;">${cfg.icon}</span>
            ${estado.charAt(0) + estado.slice(1).toLowerCase()}
        </span>`;
    }

    // ── Formatear fecha ───────────────────────────────────────
    function formatFecha(dt) {
        if (!dt) return "—";
        const d = new Date(dt);
        return d.toLocaleDateString("es-SV", { day: "2-digit", month: "short", year: "numeric" });
    }

    // ── Resolver nombres ──────────────────────────────────────
    function nombreEstudiante(id) {
        const u = catalogoEstudiantes.find(x => x.id_usuario === id);
        return u ? u.nombre_completo : `ID ${id}`;
    }
    function nombreGrupo(id) {
        const g = catalogoGrupos.find(x => x.id_grupo === id);
        return g ? g.nombre_grupo : `ID ${id}`;
    }
    function nombreDocente(id) {
        const d = catalogoDocentes.find(x => x.id_usuario === id);
        return d ? d.nombre_completo : `ID ${id}`;
    }

    // ── Renderizar tabla ──────────────────────────────────────
    function renderTabla(lista) {
        tbody.innerHTML = "";
        if (lista.length === 0) {
            emptyMsg.style.display = "block";
            table.style.display    = "none";
            return;
        }
        emptyMsg.style.display = "none";
        table.style.display    = "table";

        lista.forEach(ins => {
            const idx = inscripciones.indexOf(ins);
            const tr  = document.createElement("tr");
            tr.innerHTML = `
                <td>${nombreEstudiante(ins.id_usuario)}</td>
                <td>
                    <span class="subject-tag">${nombreGrupo(ins.id_grupo)}</span>
                </td>
                <td style="font-size:0.85rem; color:#666;">${nombreDocente(ins.id_usuario_registro)}</td>
                <td style="font-size:0.85rem;">${formatFecha(ins.fecha_inscripcion)}</td>
                <td style="max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:0.85rem; color:#777;">
                    ${ins.observacion || "<span style='color:#bbb;'>—</span>"}
                </td>
                <td style="text-align:center;">${badgeEstado(ins.estado)}</td>
                <td style="text-align:center;">
                    <button class="btn-icon btn-edit-ins" data-idx="${idx}" title="Editar inscripción">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".btn-edit-ins").forEach(btn =>
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
        );
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? inscripciones.filter(i =>
                nombreEstudiante(i.id_usuario).toLowerCase().includes(q) ||
                nombreGrupo(i.id_grupo).toLowerCase().includes(q)        ||
                i.estado.toLowerCase().includes(q)
            )
            : [...inscripciones];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Poblar select de docentes en modal ────────────────────
    function poblarRegistradorModal(idSel) {
        const select = document.getElementById("edit-ins-registrador");
        select.innerHTML = "";
        catalogoDocentes.forEach(d => {
            const opt = document.createElement("option");
            opt.value       = d.id_usuario;
            opt.textContent = d.nombre_completo;
            if (d.id_usuario === idSel) opt.selected = true;
            select.appendChild(opt);
        });
    }

    // ── Modal — abrir ─────────────────────────────────────────
    function abrirModal(idx) {
        const ins = inscripciones[idx];

        document.getElementById("edit-ins-id").value               = ins.id_inscripcion;
        document.getElementById("edit-ins-estudiante-label").value = nombreEstudiante(ins.id_usuario);
        document.getElementById("edit-ins-grupo-label").value      = nombreGrupo(ins.id_grupo);
        document.getElementById("edit-ins-estado").value           = ins.estado;
        document.getElementById("edit-ins-observacion").value      = ins.observacion || "";

        // Formatear fecha para datetime-local
        if (ins.fecha_inscripcion) {
            const f = new Date(ins.fecha_inscripcion);
            f.setMinutes(f.getMinutes() - f.getTimezoneOffset());
            document.getElementById("edit-ins-fecha").value = f.toISOString().slice(0, 16);
        }

        poblarRegistradorModal(ins.id_usuario_registro);

        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("ins-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("ins-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Modal — guardar cambios ───────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = ["edit-ins-registrador", "edit-ins-estado", "edit-ins-fecha"];
        let valido = true;

        requeridos.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value) {
                el.style.borderColor = "#e74c3c";
                valido = false;
                el.addEventListener("change", () => el.style.borderColor = "", { once: true });
            }
        });

        if (!valido) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const idIns = document.getElementById("edit-ins-id").value;

        const datos = {
            id_usuario_registro: parseInt(document.getElementById("edit-ins-registrador").value),
            estado:              document.getElementById("edit-ins-estado").value,
            fecha_inscripcion:   document.getElementById("edit-ins-fecha").value,
            observacion:         document.getElementById("edit-ins-observacion").value.trim() || null,
        };

        fetch(`http://127.0.0.1:5000/inscripciones/${idIns}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Inscripción actualizada correctamente.");
                cerrarModal();
                cargarInscripciones();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar la inscripción.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });

    // ── Carga inicial ─────────────────────────────────────────
    function cargarCatalogos() {
        return Promise.all([
            // BACKEND: GET /estudiantes → { success: true, estudiantes: [{ id_usuario, nombre_completo }] }
            fetch("http://127.0.0.1:5000/estudiantes")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoEstudiantes = d.estudiantes || []; })
                .catch(() => {}),

            // BACKEND: GET /grupos → { success: true, grupos: [{ id_grupo, nombre_grupo }] }
            fetch("http://127.0.0.1:5000/grupos")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoGrupos = d.grupos || []; })
                .catch(() => {}),

            // Fusionar admins (rol 1) + docentes (rol 2) para resolver el campo "Registrado por"
            // BACKEND: GET /admins   → { success: true, admins:   [{ id_usuario, nombre_completo }] }
            // BACKEND: GET /docentes → { success: true, docentes: [{ id_usuario, nombre_completo }] }
            Promise.all([
                fetch("http://127.0.0.1:5000/admins").then(r => r.json()).catch(() => ({ success: false })),
                fetch("http://127.0.0.1:5000/docentes").then(r => r.json()).catch(() => ({ success: false }))
            ]).then(([da, dd]) => {
                const admins   = (da.success ? da.admins   : []) || [];
                const docentes = (dd.success ? dd.docentes : []) || [];
                const todos    = [...admins];
                docentes.forEach(d => {
                    if (!todos.find(a => a.id_usuario === d.id_usuario)) todos.push(d);
                });
                catalogoDocentes = todos;
            }).catch(() => {})
        ]);
    }

    function cargarInscripciones() {
        // BACKEND: GET /inscripciones → { success: true, inscripciones: [...] }
        fetch("http://127.0.0.1:5000/inscripciones")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    inscripciones = data.inscripciones || [];
                    renderTabla(inscripciones);
                } else {
                    alert(data.error || data.mensaje || "No se pudieron cargar las inscripciones.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Error al cargar las inscripciones.");
            });
    }

    cargarCatalogos().then(cargarInscripciones);
}