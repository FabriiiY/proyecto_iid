// ============================================================
//  views/grupos.js — Vistas de Grupos (Admin)
// ============================================================

// ── VISTA: REGISTRAR GRUPO ────────────────────────────────────
function renderViewRegistrarGrupo(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">group_work</span> Registrar Grupo</h1>
            <p>Ingresa los datos del grupo para agregarlo al sistema.</p>
        </div>

        <div class="admin-card" style="max-width:760px;">
            <h3><span class="material-symbols-rounded">add_circle</span> Nuevo Grupo</h3>

            <form id="add-grupo-form" novalidate>

                <!-- ── NOMBRE Y LÍMITE ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre del Grupo <span class="req">*</span></label>
                        <input
                            type="text"
                            id="g-nombre"
                            placeholder="Ej. G01"
                            required
                            autocomplete="off"
                            maxlength="10"
                            class="input-uppercase"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">Máx. 10 caracteres</small>
                    </div>
                    <div class="form-group">
                        <label>Límite de Estudiantes <span class="req">*</span></label>
                        <input
                            type="number"
                            id="g-limite"
                            placeholder="Ej. 30"
                            required
                            min="1"
                            max="500"
                            inputmode="numeric"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">Capacidad máxima del grupo</small>
                    </div>
                </div>

                <!-- ── CICLO Y CARRERA ── -->
                <div class="form-row">
                    <div class="form-group">
                        <!-- BACKEND: GET /ciclos → { success: true, ciclos: [{ id_ciclo, nombre, numero_ciclo }] }
                             Se recomienda filtrar solo estado = 'ACTIVO' -->
                        <label>Ciclo <span class="req">*</span></label>
                        <select id="g-ciclo" required class="form-select">
                            <option value="" disabled selected>Cargando ciclos...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <!-- BACKEND: GET /carreras → { success: true, carreras: [{ id_carrera, nombre, codigo_carrera }] }
                             Se recomienda filtrar solo estado = 'ACTIVO' -->
                        <label>Carrera <span class="req">*</span></label>
                        <select id="g-carrera" required class="form-select">
                            <option value="" disabled selected>Cargando carreras...</option>
                        </select>
                    </div>
                </div>

                <!-- ── DESCRIPCIÓN ── -->
                <div class="form-group">
                    <label>Descripción <span class="opt">(opcional)</span></label>
                    <input
                        type="text"
                        id="g-descripcion"
                        placeholder="Ej. Grupo diurno de primer ciclo"
                        autocomplete="off"
                        maxlength="255"
                        class="form-input-full"
                    />
                    <small style="color:#aaa; font-size:0.78rem;">Máx. 255 caracteres</small>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:15px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Grupo
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Helper uppercase ──────────────────────────────────────
    setupUppercase("g-nombre");

    // ── Función genérica para cargar un select desde un endpoint ──
    function cargarSelect(selectId, endpoint, campo_id, campo_label, textoError) {
        const select = document.getElementById(selectId);
        fetch(`http://127.0.0.1:5000/${endpoint}`)
            .then(res => res.json())
            .then(data => {
                const key = Object.keys(data).find(k => Array.isArray(data[k]));
                const lista = key ? data[key] : [];
                if (data.success && lista.length > 0) {
                    select.innerHTML = `<option value="" disabled selected>Selecciona una opción...</option>`;
                    lista.forEach(item => {
                        const opt = document.createElement("option");
                        opt.value       = item[campo_id];
                        opt.textContent = item[campo_label];
                        select.appendChild(opt);
                    });
                } else {
                    select.innerHTML = `<option value="" disabled selected>Sin registros disponibles</option>`;
                }
            })
            .catch(() => {
                select.innerHTML = `<option value="" disabled selected>${textoError}</option>`;
            });
    }

    cargarSelect("g-ciclo",   "ciclos/activos",   "id_ciclo",   "nombre", "Error al cargar ciclos");
    cargarSelect("g-carrera", "carreras/activas", "id_carrera", "nombre", "Error al cargar carreras");

    // ── Envío del formulario ──────────────────────────────────
    const form = document.getElementById("add-grupo-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = ["g-nombre", "g-limite", "g-ciclo", "g-carrera"];
        let valido = true;

        requeridos.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.toString().trim()) {
                el.style.borderColor = "#e74c3c";
                valido = false;
                el.addEventListener("input", () => el.style.borderColor = "", { once: true });
            }
        });

        if (!valido) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const nuevo = {
            nombre_grupo:        document.getElementById("g-nombre").value.trim(),
            limite_estudiantes:  parseInt(document.getElementById("g-limite").value),
            id_ciclo:            parseInt(document.getElementById("g-ciclo").value),
            id_carrera:          parseInt(document.getElementById("g-carrera").value),
            descripcion:         document.getElementById("g-descripcion").value.trim() || null,
        };

        fetch("http://127.0.0.1:5000/grupos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevo)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                alert("Grupo registrado correctamente.");
            } else {
                alert(data.error || data.mensaje || "No se pudo registrar el grupo.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });
}


// ── VISTA: VER GRUPOS REGISTRADOS ────────────────────────────
function renderViewVerGrupos(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">group_work</span> Grupos Registrados</h1>
            <p>Consulta, edita o cambia el estado de los grupos del sistema.</p>
        </div>

        <div class="admin-card">
            <!-- Barra de búsqueda -->
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="grupo-search-input"
                    placeholder="Buscar por nombre, carrera o ciclo..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <!-- Tabla -->
            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="grupos-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Carrera</th>
                            <th>Ciclo</th>
                            <th style="text-align:center;">Límite</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="grupos-tbody"></tbody>
                </table>
                <div id="grupos-empty-msg" class="empty-state">No hay grupos registrados.</div>
            </div>
        </div>

        <!-- MODAL EDITAR GRUPO -->
        <div id="grupo-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:640px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Grupo</h3>
                    <button id="grupo-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="grupo-edit-form" novalidate>
                    <input type="hidden" id="edit-grupo-id" />

                    <!-- NOMBRE Y LÍMITE -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nombre del Grupo <span class="req">*</span></label>
                            <input
                                type="text"
                                id="edit-g-nombre"
                                required
                                autocomplete="off"
                                maxlength="10"
                                class="input-uppercase"
                            />
                        </div>
                        <div class="form-group">
                            <label>Límite de Estudiantes <span class="req">*</span></label>
                            <input
                                type="number"
                                id="edit-g-limite"
                                required
                                min="1"
                                max="500"
                                inputmode="numeric"
                            />
                        </div>
                    </div>

                    <!-- CICLO Y CARRERA -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Ciclo <span class="req">*</span></label>
                            <select id="edit-g-ciclo" required class="form-select">
                                <option value="" disabled selected>Cargando...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Carrera <span class="req">*</span></label>
                            <select id="edit-g-carrera" required class="form-select">
                                <option value="" disabled selected>Cargando...</option>
                            </select>
                        </div>
                    </div>

                    <!-- DESCRIPCIÓN -->
                    <div class="form-group">
                        <label>Descripción <span class="opt">(opcional)</span></label>
                        <input
                            type="text"
                            id="edit-g-descripcion"
                            autocomplete="off"
                            maxlength="255"
                            class="form-input-full"
                        />
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="grupo-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody    = document.getElementById("grupos-tbody");
    const table    = document.getElementById("grupos-table");
    const emptyMsg = document.getElementById("grupos-empty-msg");
    const search   = document.getElementById("grupo-search-input");
    const overlay  = document.getElementById("grupo-modal-overlay");
    const editForm = document.getElementById("grupo-edit-form");

    let grupos          = [];
    let catalogoCiclos  = [];
    let catalogoCarreras = [];

    // ── Badge de estado ───────────────────────────────────────
    function badgeEstado(estado) {
        const activo = estado === "ACTIVO";
        return `<span style="
            display:inline-flex; align-items:center; gap:4px;
            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
            background:${activo ? "#e6f9f0" : "#fdecea"};
            color:${activo ? "#1a8a4a" : "#c0392b"};
        ">
            <span class="material-symbols-rounded" style="font-size:0.85rem;">${activo ? "check_circle" : "cancel"}</span>
            ${activo ? "Activo" : "Inactivo"}
        </span>`;
    }

    // ── Resolver nombre desde catálogos ───────────────────────
    function nombreCiclo(id) {
        const c = catalogoCiclos.find(x => x.id_ciclo === id);
        return c ? c.nombre : `ID ${id}`;
    }

    function nombreCarrera(id) {
        const c = catalogoCarreras.find(x => x.id_carrera === id);
        return c ? c.nombre : `ID ${id}`;
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

        lista.forEach(grupo => {
            const idx      = grupos.indexOf(grupo);
            const esActivo = grupo.estado === "ACTIVO";

            const toggleIcon  = esActivo ? "block"          : "check_circle";
            const toggleClass = esActivo ? "btn-icon-danger" : "btn-icon-success";
            const toggleTitle = esActivo ? "Desactivar grupo" : "Activar grupo";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${grupo.nombre_grupo}</strong></td>
                <td>
                    <span class="subject-tag">${nombreCarrera(grupo.id_carrera)}</span>
                </td>
                <td>${nombreCiclo(grupo.id_ciclo)}</td>
                <td style="text-align:center;">${grupo.limite_estudiantes}</td>
                <td style="max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${grupo.descripcion || "<span style='color:#bbb;'>—</span>"}
                </td>
                <td style="text-align:center;">${badgeEstado(grupo.estado)}</td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                        <button class="btn-icon btn-edit-grupo" data-idx="${idx}" title="Editar grupo">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${toggleClass} btn-toggle-grupo" data-idx="${idx}" title="${toggleTitle}">
                            <span class="material-symbols-rounded">${toggleIcon}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Listeners — editar
        tbody.querySelectorAll(".btn-edit-grupo").forEach(btn =>
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
        );

        // Listeners — toggle estado
        tbody.querySelectorAll(".btn-toggle-grupo").forEach(btn =>
            btn.addEventListener("click", () => {
                const grupo       = grupos[parseInt(btn.dataset.idx)];
                const nuevoEstado = grupo.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
                cambiarEstado(grupo, nuevoEstado);
            })
        );
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? grupos.filter(g =>
                g.nombre_grupo.toLowerCase().includes(q)              ||
                nombreCarrera(g.id_carrera).toLowerCase().includes(q) ||
                nombreCiclo(g.id_ciclo).toLowerCase().includes(q)
            )
            : [...grupos];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Cambiar estado ────────────────────────────────────────
    function cambiarEstado(grupo, nuevoEstado) {
        fetch(`http://127.0.0.1:5000/grupos/${grupo.id_grupo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                grupo.estado = nuevoEstado;
                renderTabla(filtrar());
            } else {
                alert(data.error || data.mensaje || "No se pudo cambiar el estado.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    }

    // ── Poblar selects del modal ──────────────────────────────
    function poblarSelectModal(selectId, catalogo, campoId, campoLabel, idSeleccionado) {
        const select = document.getElementById(selectId);
        select.innerHTML = `<option value="" disabled>Selecciona una opción...</option>`;
        catalogo.forEach(item => {
            const opt = document.createElement("option");
            opt.value       = item[campoId];
            opt.textContent = item[campoLabel];
            if (item[campoId] === idSeleccionado) opt.selected = true;
            select.appendChild(opt);
        });
    }

    // ── Modal — abrir y poblar ────────────────────────────────
    function abrirModal(idx) {
        const g = grupos[idx];

        document.getElementById("edit-grupo-id").value      = g.id_grupo;
        document.getElementById("edit-g-nombre").value      = g.nombre_grupo        || "";
        document.getElementById("edit-g-limite").value      = g.limite_estudiantes  ?? "";
        document.getElementById("edit-g-descripcion").value = g.descripcion         || "";

        poblarSelectModal("edit-g-ciclo",   catalogoCiclos,   "id_ciclo",   "nombre", g.id_ciclo);
        poblarSelectModal("edit-g-carrera", catalogoCarreras, "id_carrera", "nombre", g.id_carrera);

        setupUppercase("edit-g-nombre");

        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("grupo-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("grupo-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Modal — guardar cambios ───────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = ["edit-g-nombre", "edit-g-limite", "edit-g-ciclo", "edit-g-carrera"];
        let valido = true;

        requeridos.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.toString().trim()) {
                el.style.borderColor = "#e74c3c";
                valido = false;
                el.addEventListener("input", () => el.style.borderColor = "", { once: true });
            }
        });

        if (!valido) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const idGrupo = document.getElementById("edit-grupo-id").value;

        const datos = {
            nombre_grupo:       document.getElementById("edit-g-nombre").value.trim(),
            limite_estudiantes: parseInt(document.getElementById("edit-g-limite").value),
            id_ciclo:           parseInt(document.getElementById("edit-g-ciclo").value),
            id_carrera:         parseInt(document.getElementById("edit-g-carrera").value),
            descripcion:        document.getElementById("edit-g-descripcion").value.trim() || null,
        };

        fetch(`http://127.0.0.1:5000/grupos/${idGrupo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Grupo actualizado correctamente.");
                cerrarModal();
                cargarGrupos();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar el grupo.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });

    // ── Carga inicial — catálogos en paralelo, luego tabla ────
    // Ambos catálogos se necesitan antes de que el usuario abra el modal.
    function cargarCatalogos() {
        return Promise.all([
            // BACKEND: GET /ciclos → { success: true, ciclos: [{ id_ciclo, nombre }] }
            fetch("http://127.0.0.1:5000/ciclos/activos")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoCiclos = d.ciclos; })
                .catch(() => {}),

            // BACKEND: GET /carreras → { success: true, carreras: [{ id_carrera, nombre }] }
            fetch("http://127.0.0.1:5000/carreras/activas")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoCarreras = d.carreras; })
                .catch(() => {})
        ]);
    }

    function cargarGrupos() {
        // BACKEND: GET /grupos → { success: true, grupos: [...] }
        fetch("http://127.0.0.1:5000/grupos")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    grupos = data.grupos;
                    renderTabla(grupos);
                } else {
                    alert(data.error || data.mensaje || "No se pudieron cargar los grupos.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Error al cargar los grupos.");
            });
    }

    // Primero los catálogos (en paralelo), luego la tabla
    cargarCatalogos().then(cargarGrupos);
}