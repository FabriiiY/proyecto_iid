// ============================================================
//  views/grupos-clase.js — Vistas de Clase del Grupo (Admin + Maestro)
//
//  Comportamiento según rol (window.SAMI.usuario.id_rol):
//    Admin   → renderViewAsignarClaseGrupo (crear) + renderViewVerClasesGrupo (ver/editar/toggle)
//    Maestro → solo renderViewVerClasesGrupo en modo lectura:
//              · Endpoint filtrado por id_docente → solo sus clases activas
//              · Sin columna "Acciones" (sin botón editar ni toggle)
//              · Sin modal de edición
// ============================================================

// La tabla `clase` no tiene nombre propio.
// La etiqueta legible se construye como:
//   "[Materia] — [Tipo] (Doc: [Docente])"
// usando los catálogos de /materias y /docentes.


// ── HELPER: etiqueta legible para una clase ──────────────────
// Recibe el objeto clase y los catálogos ya cargados.
function etiquetaClase(clase, catalogoMaterias, catalogoDocentes) {
    const mat = catalogoMaterias.find(m => m.id_materia === clase.id_materia);
    const doc = catalogoDocentes.find(d => d.id_usuario === clase.id_docente);
    const nombreMat = mat ? mat.nombre          : `Materia #${clase.id_materia}`;
    const nombreDoc = doc ? doc.nombre_completo : `Docente #${clase.id_docente}`;
    const tipo      = clase.tipo_clase === "TEORIA" ? "Teoría" : "Práctica";
    return `${nombreMat} — ${tipo} (${nombreDoc})`;
}


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
                    <!-- BACKEND: GET /clases → { success: true, clases: [{ id_clase, tipo_clase, estado, id_materia, id_docente }] }
                         La etiqueta se construye con /materias y /docentes porque clase no tiene nombre propio. -->
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

    const selGrupo = document.getElementById("cg-grupo");
    const selClase = document.getElementById("cg-clase");

    // Cargar los 3 catálogos necesarios en paralelo
    // BACKEND: GET /materias  → { success, materias:  [{ id_materia, nombre }] }
    // BACKEND: GET /docentes  → { success, docentes:  [{ id_usuario, nombre_completo }] }
    // BACKEND: GET /grupos    → { success, grupos:    [{ id_grupo, nombre_grupo }] }
    // BACKEND: GET /clases    → { success, clases:    [{ id_clase, tipo_clase, estado, id_materia, id_docente }] }
    Promise.all([
        fetch("http://127.0.0.1:5000/grupos/activos").then(r => r.json()),
        fetch("http://127.0.0.1:5000/clases").then(r => r.json()),
        fetch("http://127.0.0.1:5000/materias").then(r => r.json()),
        fetch("http://127.0.0.1:5000/docentes").then(r => r.json())
    ])
    .then(([dGrupos, dClases, dMaterias, dDocentes]) => {

        const catalogoMaterias = (dMaterias.success && dMaterias.materias) ? dMaterias.materias : [];
        const catalogoDocentes = (dDocentes.success && dDocentes.docentes) ? dDocentes.docentes : [];

        // ── Poblar grupos ──────────────────────────────────
        if (dGrupos.success && dGrupos.grupos && dGrupos.grupos.length) {
            selGrupo.innerHTML = `<option value="" disabled selected>Selecciona un grupo...</option>`;
            dGrupos.grupos.forEach(g => {
                const opt = document.createElement("option");
                opt.value       = g.id_grupo;
                opt.textContent = g.nombre_grupo;
                selGrupo.appendChild(opt);
            });
        } else {
            selGrupo.innerHTML = `<option value="" disabled selected>Sin grupos disponibles</option>`;
        }

        // ── Poblar clases (solo ACTIVO) ────────────────────
        const clasesActivas = (dClases.success && dClases.clases)
            ? dClases.clases.filter(c => c.estado === "ACTIVO")
            : [];

        if (clasesActivas.length) {
            selClase.innerHTML = `<option value="" disabled selected>Selecciona una clase...</option>`;
            clasesActivas.forEach(c => {
                const opt = document.createElement("option");
                opt.value       = c.id_clase;
                opt.textContent = etiquetaClase(c, catalogoMaterias, catalogoDocentes);
                selClase.appendChild(opt);
            });
        } else {
            selClase.innerHTML = `<option value="" disabled selected>Sin clases disponibles</option>`;
        }
    })
    .catch(error => {
        console.error(error);
        selGrupo.innerHTML = `<option value="" disabled selected>Error al cargar grupos</option>`;
        selClase.innerHTML = `<option value="" disabled selected>Error al cargar clases</option>`;
    });

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

        // BACKEND: POST /clase-grupo → { success: true }
        // Body: { id_grupo, id_clase }
        fetch("http://127.0.0.1:5000/clase-grupo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_grupo: parseInt(document.getElementById("cg-grupo").value),
                id_clase: parseInt(document.getElementById("cg-clase").value),
            })
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

    const usuarioActivo = window.SAMI?.usuario || {};
    const esAdmin       = window.SAMI?.esAdmin   === true;
    const esMaestro     = window.SAMI?.esMaestro === true;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">table_view</span> Clases por Grupo</h1>
            <p>${esAdmin ? "Consulta, edita o cambia el estado de las asignaciones clase-grupo." : "Consulta las clases asignadas a tus grupos."}</p>
        </div>

        <div class="admin-card">
            <!-- Barra de búsqueda -->
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="cg-search-input"
                    placeholder="Buscar por grupo, materia o docente..."
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
                            <th>Materia</th>
                            <th style="text-align:center;">Tipo</th>
                            <th>Docente</th>
                            <th style="text-align:center;">Estado</th>
                            ${esAdmin ? `<th style="text-align:center;">Acciones</th>` : ""}
                        </tr>
                    </thead>
                    <tbody id="cg-tbody"></tbody>
                </table>
                <div id="cg-empty-msg" class="empty-state">No hay asignaciones registradas.</div>
            </div>
        </div>

        <!-- MODAL EDITAR CLASE-GRUPO (solo Admin) -->
        ${esAdmin ? `
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
        ` : ""}
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody    = document.getElementById("cg-tbody");
    const table    = document.getElementById("cg-table");
    const emptyMsg = document.getElementById("cg-empty-msg");
    const search   = document.getElementById("cg-search-input");
    // Modal solo existe en el DOM si es Admin
    const overlay  = esAdmin ? document.getElementById("cg-modal-overlay") : null;
    const editForm = esAdmin ? document.getElementById("cg-edit-form")      : null;

    let asignaciones    = [];
    let catalogoGrupos  = [];
    let catalogoClases  = [];
    let catalogoMaterias = [];
    let catalogoDocentes = [];

    // ── Badge tipo de clase ───────────────────────────────────
    function badgeTipo(tipo) {
        const esTeo = tipo === "TEORIA";
        return `<span style="
            display:inline-flex; align-items:center; gap:4px;
            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
            background:${esTeo ? "#eef1f9" : "#edfaf3"};
            color:${esTeo ? "var(--azul-sami)" : "#27ae60"};
        ">
            <span class="material-symbols-rounded" style="font-size:0.9rem;">${esTeo ? "menu_book" : "science"}</span>
            ${esTeo ? "Teoría" : "Práctica"}
        </span>`;
    }

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
        return g ? g.nombre_grupo : `Grupo #${id}`;
    }

    function datosClase(id) {
        return catalogoClases.find(x => x.id_clase === id) || null;
    }

    function nombreMateria(id_materia) {
        const m = catalogoMaterias.find(x => x.id_materia === id_materia);
        return m ? m.nombre : `Materia #${id_materia}`;
    }

    function nombreDocente(id_docente) {
        const d = catalogoDocentes.find(x => x.id_usuario === id_docente);
        return d ? d.nombre_completo : `Docente #${id_docente}`;
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
            const esActivo = item.estado === "ACTIVO";
            const clase    = datosClase(item.id_clase);

            const toggleIcon  = esActivo ? "block"           : "check_circle";
            const toggleClass = esActivo ? "btn-icon-danger"  : "btn-icon-success";
            const toggleTitle = esActivo ? "Desactivar"       : "Activar";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${nombreGrupo(item.id_grupo)}</strong></td>
                <td>${clase ? nombreMateria(clase.id_materia) : `Clase #${item.id_clase}`}</td>
                <td style="text-align:center;">${clase ? badgeTipo(clase.tipo_clase) : "—"}</td>
                <td>${clase ? nombreDocente(clase.id_docente) : "—"}</td>
                <td style="text-align:center;">${badgeEstado(esActivo)}</td>
                ${esAdmin ? `
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
                ` : ""}
            `;
            tbody.appendChild(tr);
        });

        // Botones de acción solo disponibles para Admin
        if (esAdmin) {
            tbody.querySelectorAll(".btn-edit-cg").forEach(btn =>
                btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
            );

            tbody.querySelectorAll(".btn-toggle-cg").forEach(btn =>
                btn.addEventListener("click", () => cambiarEstado(asignaciones[parseInt(btn.dataset.idx)]))
            );
        }
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        if (!q) return [...asignaciones];
        return asignaciones.filter(item => {
            const clase = datosClase(item.id_clase);
            return (
                nombreGrupo(item.id_grupo).toLowerCase().includes(q) ||
                (clase && nombreMateria(clase.id_materia).toLowerCase().includes(q)) ||
                (clase && nombreDocente(clase.id_docente).toLowerCase().includes(q))
            );
        });
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Cambiar estado ────────────────────────────────────────
    function cambiarEstado(item) {
        // BACKEND: PUT /clase-grupo/:id/estado → { success: true }
        // Requiere campo `activo` TINYINT(1) en la tabla clase_grupo
        const nuevoEstado = item.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
        fetch(`http://127.0.0.1:5000/clase-grupo/${item.id_clase_grupo}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                item.estado = nuevoEstado;
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

    // ── Modal — abrir / cerrar / guardar (solo Admin) ─────────
    if (esAdmin) {

        function abrirModal(idx) {
            const item = asignaciones[idx];
            document.getElementById("edit-cg-id").value = item.id_clase_grupo;

            // Poblar select de grupos
            const selGrupoEdit = document.getElementById("edit-cg-grupo");
            selGrupoEdit.innerHTML = "";
            catalogoGrupos.forEach(g => {
                const opt = document.createElement("option");
                opt.value       = g.id_grupo;
                opt.textContent = g.nombre_grupo;
                if (g.id_grupo === item.id_grupo) opt.selected = true;
                selGrupoEdit.appendChild(opt);
            });

            // Poblar select de clases con etiqueta legible
            const selClaseEdit = document.getElementById("edit-cg-clase");
            selClaseEdit.innerHTML = "";
            catalogoClases.forEach(c => {
                const opt = document.createElement("option");
                opt.value       = c.id_clase;
                opt.textContent = etiquetaClase(c, catalogoMaterias, catalogoDocentes);
                if (c.id_clase === item.id_clase) opt.selected = true;
                selClaseEdit.appendChild(opt);
            });

            overlay.style.display = "flex";
        }

        function cerrarModal() {
            overlay.style.display = "none";
            editForm.reset();
        }

        document.getElementById("cg-modal-close").addEventListener("click",  cerrarModal);
        document.getElementById("cg-modal-cancel").addEventListener("click", cerrarModal);
        overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

        // ── Modal — guardar cambios ───────────────────────────
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

            // BACKEND: PUT /clase-grupo/:id → { success: true }
            // Body: { id_grupo, id_clase }
            fetch(`http://127.0.0.1:5000/clase-grupo/${idClaseGrupo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_grupo: parseInt(document.getElementById("edit-cg-grupo").value),
                    id_clase: parseInt(document.getElementById("edit-cg-clase").value),
                })
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

    } // fin if (esAdmin)

    // ── Carga inicial ─────────────────────────────────────────
    function cargarCatalogos() {
        return Promise.all([
            // BACKEND: GET /grupos   → { success, grupos:   [{ id_grupo, nombre_grupo }] }
            fetch("http://127.0.0.1:5000/grupos")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoGrupos = d.grupos; })
                .catch(() => {}),

            // BACKEND: GET /clases   → { success, clases:   [{ id_clase, tipo_clase, estado, id_materia, id_docente }] }
            fetch("http://127.0.0.1:5000/clases")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoClases = d.clases; })
                .catch(() => {}),

            // BACKEND: GET /materias → { success, materias: [{ id_materia, nombre }] }
            fetch("http://127.0.0.1:5000/materias")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoMaterias = d.materias; })
                .catch(() => {}),

            // BACKEND: GET /docentes → { success, docentes: [{ id_usuario, nombre_completo }] }
            fetch("http://127.0.0.1:5000/docentes")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoDocentes = d.docentes; })
                .catch(() => {})
        ]);
    }

    function cargarAsignaciones() {
        // Admin:   GET /clase-grupo                           → todas las asignaciones
        // Maestro: GET /clase-grupo?id_docente=X&estado=ACTIVO → solo las suyas y activas
        const url = esMaestro
            ? `http://127.0.0.1:5000/clase-grupo?id_docente=${usuarioActivo.id_usuario}&estado=ACTIVO`
            : "http://127.0.0.1:5000/clase-grupo";

        fetch(url)
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