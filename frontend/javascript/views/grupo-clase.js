// ============================================================
//  views/grupos-clase.js — Vistas de Clase del Grupo (Admin)
// ============================================================


// ── VISTA: ASIGNAR CLASE A GRUPO ─────────────────────────────
function renderViewAsignarClaseGrupo(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">link</span> Clase del Grupo</h1>
            <p>Asocia una clase existente a un grupo registrado en el sistema.</p>
        </div>

        <div class="admin-card" style="max-width:640px;">
            <h3><span class="material-symbols-rounded">add_link</span> Nueva Asignación</h3>

            <form id="add-clase-grupo-form" novalidate>

                <!-- ── GRUPO ── -->
                <div class="form-group">
                    <!-- BACKEND: GET /grupos → { success: true, grupos: [{ id_grupo, nombre_grupo }] } -->
                    <label>Grupo <span class="req">*</span></label>
                    <select id="cg-grupo" required class="form-select">
                        <option value="" disabled selected>Cargando grupos...</option>
                    </select>
                </div>

                <!-- ── CLASE ── -->
                <div class="form-group" style="margin-top:16px;">
                    <!-- BACKEND: GET /clases → { success: true, clases: [{ id_clase, nombre_clase }] }
                         Filtrar solo estado = 'ACTIVO' -->
                    <label>Clase <span class="req">*</span></label>
                    <select id="cg-clase" required class="form-select">
                        <option value="" disabled selected>Cargando clases...</option>
                    </select>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:24px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Asignación
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Cargar selects ────────────────────────────────────────
    function cargarSelect(selectId, endpoint, campoId, campoLabel, textoError) {
        const select = document.getElementById(selectId);
        fetch(`http://127.0.0.1:5000/${endpoint}`)
            .then(res => res.json())
            .then(data => {
                const key   = Object.keys(data).find(k => Array.isArray(data[k]));
                const lista = key ? data[key] : [];
                if (data.success && lista.length > 0) {
                    select.innerHTML = `<option value="" disabled selected>Selecciona una opción...</option>`;
                    lista.forEach(item => {
                        const opt = document.createElement("option");
                        opt.value       = item[campoId];
                        opt.textContent = item[campoLabel];
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

    cargarSelect("cg-grupo", "grupos", "id_grupo", "nombre_grupo", "Error al cargar grupos");
    cargarSelect("cg-clase", "clases", "id_clase", "nombre_clase",  "Error al cargar clases");

    // ── Envío del formulario ──────────────────────────────────
    const form = document.getElementById("add-clase-grupo-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const camposSelect = ["cg-grupo", "cg-clase"];
        let valido = true;

        camposSelect.forEach(id => {
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

        const nueva = {
            // BACKEND: POST /clase-grupo → { success: true }
            id_grupo: parseInt(document.getElementById("cg-grupo").value),
            id_clase: parseInt(document.getElementById("cg-clase").value),
        };

        fetch("http://127.0.0.1:5000/clase-grupo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nueva)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                alert("Clase asignada al grupo correctamente.");
            } else {
                alert(data.error || data.mensaje || "No se pudo registrar la asignación.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });
}


// ── VISTA: VER CLASES DE GRUPO ────────────────────────────────
function renderViewVerClasesGrupo(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">table_view</span> Clases por Grupo</h1>
            <p>Consulta, edita o cambia el estado de las asignaciones clase-grupo.</p>
        </div>

        <div class="admin-card">
            <!-- Barra de búsqueda -->
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="cg-search-input"
                    placeholder="Buscar por grupo o clase..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <!-- Tabla -->
            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="cg-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Grupo</th>
                            <th>Clase</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="cg-tbody"></tbody>
                </table>
                <div id="cg-empty-msg" class="empty-state">No hay asignaciones registradas.</div>
            </div>
        </div>

        <!-- MODAL EDITAR CLASE-GRUPO -->
        <div id="cg-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:520px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Asignación</h3>
                    <button id="cg-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="cg-edit-form" novalidate>
                    <input type="hidden" id="edit-cg-id" />

                    <!-- GRUPO -->
                    <div class="form-group">
                        <label>Grupo <span class="req">*</span></label>
                        <select id="edit-cg-grupo" required class="form-select">
                            <option value="" disabled selected>Cargando...</option>
                        </select>
                    </div>

                    <!-- CLASE -->
                    <div class="form-group" style="margin-top:16px;">
                        <label>Clase <span class="req">*</span></label>
                        <select id="edit-cg-clase" required class="form-select">
                            <option value="" disabled selected>Cargando...</option>
                        </select>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:24px;">
                        <button type="button" id="cg-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody    = document.getElementById("cg-tbody");
    const table    = document.getElementById("cg-table");
    const emptyMsg = document.getElementById("cg-empty-msg");
    const search   = document.getElementById("cg-search-input");
    const overlay  = document.getElementById("cg-modal-overlay");
    const editForm = document.getElementById("cg-edit-form");

    let asignaciones    = [];
    let catalogoGrupos  = [];
    let catalogoClases  = [];

    // ── Badge estado ──────────────────────────────────────────
    function badgeEstado(activo) {
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

    // ── Resolver nombres desde catálogos ──────────────────────
    function nombreGrupo(id) {
        const g = catalogoGrupos.find(x => x.id_grupo === id);
        return g ? g.nombre_grupo : `ID ${id}`;
    }

    function nombreClase(id) {
        const c = catalogoClases.find(x => x.id_clase === id);
        return c ? c.nombre_clase : `ID ${id}`;
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

        lista.forEach(item => {
            const idx      = asignaciones.indexOf(item);
            const esActivo = !!item.activo;

            const toggleIcon  = esActivo ? "block"           : "check_circle";
            const toggleClass = esActivo ? "btn-icon-danger"  : "btn-icon-success";
            const toggleTitle = esActivo ? "Desactivar"       : "Activar";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${nombreGrupo(item.id_grupo)}</td>
                <td>${nombreClase(item.id_clase)}</td>
                <td style="text-align:center;">${badgeEstado(esActivo)}</td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                        <button class="btn-icon btn-edit-cg" data-idx="${idx}" title="Editar asignación">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${toggleClass} btn-toggle-cg" data-idx="${idx}" title="${toggleTitle}">
                            <span class="material-symbols-rounded">${toggleIcon}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Listeners — editar
        tbody.querySelectorAll(".btn-edit-cg").forEach(btn =>
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
        );

        // Listeners — toggle estado
        tbody.querySelectorAll(".btn-toggle-cg").forEach(btn =>
            btn.addEventListener("click", () => {
                const item = asignaciones[parseInt(btn.dataset.idx)];
                cambiarEstado(item);
            })
        );
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? asignaciones.filter(item =>
                nombreGrupo(item.id_grupo).toLowerCase().includes(q) ||
                nombreClase(item.id_clase).toLowerCase().includes(q)
            )
            : [...asignaciones];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Cambiar estado ────────────────────────────────────────
    function cambiarEstado(item) {
        // BACKEND: PUT /clase-grupo/:id/estado → { success: true }
        // Campo 'activo' (TINYINT 1) se agrega a la tabla clase_grupo
        fetch(`http://127.0.0.1:5000/clase-grupo/${item.id_clase_grupo}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo: item.activo ? 0 : 1 })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                item.activo = item.activo ? 0 : 1;
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

    // ── Modal — abrir ─────────────────────────────────────────
    function abrirModal(idx) {
        const item = asignaciones[idx];

        document.getElementById("edit-cg-id").value = item.id_clase_grupo;

        poblarSelectModal("edit-cg-grupo", catalogoGrupos, "id_grupo", "nombre_grupo", item.id_grupo);
        poblarSelectModal("edit-cg-clase", catalogoClases, "id_clase", "nombre_clase",  item.id_clase);

        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("cg-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("cg-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Modal — guardar cambios ───────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const camposSelect = ["edit-cg-grupo", "edit-cg-clase"];
        let valido = true;

        camposSelect.forEach(id => {
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

        const idClaseGrupo = document.getElementById("edit-cg-id").value;

        const datos = {
            // BACKEND: PUT /clase-grupo/:id → { success: true }
            id_grupo: parseInt(document.getElementById("edit-cg-grupo").value),
            id_clase: parseInt(document.getElementById("edit-cg-clase").value),
        };

        fetch(`http://127.0.0.1:5000/clase-grupo/${idClaseGrupo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Asignación actualizada correctamente.");
                cerrarModal();
                cargarAsignaciones();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar la asignación.");
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
            // BACKEND: GET /grupos → { success: true, grupos: [{ id_grupo, nombre_grupo }] }
            fetch("http://127.0.0.1:5000/grupos")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoGrupos = d.grupos; })
                .catch(() => {}),

            // BACKEND: GET /clases → { success: true, clases: [{ id_clase, nombre_clase }] }
            fetch("http://127.0.0.1:5000/clases")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoClases = d.clases; })
                .catch(() => {})
        ]);
    }

    function cargarAsignaciones() {
        // BACKEND: GET /clase-grupo → { success: true, clase_grupos: [{ id_clase_grupo, id_clase, id_grupo, activo }] }
        fetch("http://127.0.0.1:5000/clase-grupo")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    asignaciones = data.clase_grupos;
                    renderTabla(asignaciones);
                } else {
                    alert(data.error || data.mensaje || "No se pudieron cargar las asignaciones.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Error al cargar las asignaciones.");
            });
    }

    // Catálogos primero, luego tabla
    cargarCatalogos().then(cargarAsignaciones);
}