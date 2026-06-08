// ============================================================
//  views/clases.js — Vistas de Clases (Admin)
// ============================================================

// ── VISTA: REGISTRAR CLASE ────────────────────────────────────
function renderViewRegistrarClase(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">cast_for_education</span> Registrar Clase</h1>
            <p>Vincula una materia con un docente y define el tipo de clase.</p>
        </div>

        <div class="admin-card" style="max-width:760px;">
            <h3><span class="material-symbols-rounded">add_circle</span> Nueva Clase</h3>

            <form id="add-clase-form" novalidate>

                <!-- ── MATERIA ── -->
                <div class="form-group">
                    <!-- BACKEND: GET /materias → { success: true, materias: [{ id_materia, nombre }] }
                         Filtrar solo estado = 'ACTIVA' -->
                    <label>Materia <span class="req">*</span></label>
                    <select id="cl-materia" required class="form-select">
                        <option value="" disabled selected>Cargando materias...</option>
                    </select>
                </div>

                <!-- ── DOCENTE ── -->
                <div class="form-group">
                    <!-- BACKEND: GET /docentes → { success: true, docentes: [{ id_usuario, nombre_completo }] }
                         Usuarios con id_rol = 2 (DOCENTE) y estado = 'ACTIVO' -->
                    <label>Docente <span class="req">*</span></label>
                    <select id="cl-docente" required class="form-select">
                        <option value="" disabled selected>Cargando docentes...</option>
                    </select>
                </div>

                <!-- ── TIPO DE CLASE ── -->
                <div class="form-group">
                    <label>Tipo de Clase <span class="req">*</span></label>
                    <div class="radio-group" style="display:flex; gap:24px; margin-top:8px;">
                        <label class="radio-option" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                            <input type="radio" name="cl-tipo" id="cl-tipo-teoria" value="TEORIA" required />
                            <span class="material-symbols-rounded" style="font-size:1.2rem; color:var(--azul-sami);">menu_book</span>
                            Teoría
                        </label>
                        <label class="radio-option" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                            <input type="radio" name="cl-tipo" id="cl-tipo-practica" value="PRACTICA" />
                            <span class="material-symbols-rounded" style="font-size:1.2rem; color:#27ae60;">science</span>
                            Práctica
                        </label>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Clase
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Cargar selects ────────────────────────────────────────
    function cargarSelect(selectId, endpoint, campoId, campoLabel, textoError) {
        const select = document.getElementById(selectId);
        fetch(`https://proyectoiid-production.up.railway.app/${endpoint}`)
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

    cargarSelect("cl-materia", "materias/activas", "id_materia", "nombre",         "Error al cargar materias");
    cargarSelect("cl-docente", "docentes",         "id_usuario", "nombre_completo","Error al cargar docentes");

    // ── Envío del formulario ──────────────────────────────────
    const form = document.getElementById("add-clase-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        // Validar selects
        const camposSelect = ["cl-materia", "cl-docente"];
        let valido = true;

        camposSelect.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value) {
                el.style.borderColor = "#e74c3c";
                valido = false;
                el.addEventListener("change", () => el.style.borderColor = "", { once: true });
            }
        });

        // Validar tipo de clase (radio)
        const tipoSeleccionado = document.querySelector('input[name="cl-tipo"]:checked');
        if (!tipoSeleccionado) {
            document.querySelector(".radio-group").style.outline = "2px solid #e74c3c";
            document.querySelector(".radio-group").style.borderRadius = "6px";
            valido = false;
            document.querySelectorAll('input[name="cl-tipo"]').forEach(r =>
                r.addEventListener("change", () => {
                    document.querySelector(".radio-group").style.outline = "";
                }, { once: true })
            );
        }

        if (!valido) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const nueva = {
            id_materia: parseInt(document.getElementById("cl-materia").value),
            id_docente: parseInt(document.getElementById("cl-docente").value),
            tipo_clase: tipoSeleccionado.value,
        };

        fetch("https://proyectoiid-production.up.railway.app/clases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nueva)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                alert("Clase registrada correctamente.");
            } else {
                alert(data.error || data.mensaje || "No se pudo registrar la clase.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });
}


// ── VISTA: VER CLASES REGISTRADAS ────────────────────────────
function renderViewVerClases(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">cast_for_education</span> Clases Registradas</h1>
            <p>Consulta, edita o cambia el estado de las clases del sistema.</p>
        </div>

        <div class="admin-card">
            <!-- Barra de búsqueda -->
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="clase-search-input"
                    placeholder="Buscar por materia, docente o tipo..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <!-- Tabla -->
            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="clases-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Docente</th>
                            <th style="text-align:center;">Tipo</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="clases-tbody"></tbody>
                </table>
                <div id="clases-empty-msg" class="empty-state">No hay clases registradas.</div>
            </div>
        </div>

        <!-- MODAL EDITAR CLASE -->
        <div id="clase-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:560px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Clase</h3>
                    <button id="clase-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="clase-edit-form" novalidate>
                    <input type="hidden" id="edit-clase-id" />

                    <!-- MATERIA (informativa, no editable) -->
                    <div class="form-group">
                        <label>Materia</label>
                        <input
                            type="text"
                            id="edit-cl-materia-label"
                            class="form-input-full"
                            disabled
                            style="background:#f5f5f5; color:#888; cursor:not-allowed;"
                        />
                    </div>

                    <!-- DOCENTE -->
                    <div class="form-group">
                        <label>Docente <span class="req">*</span></label>
                        <select id="edit-cl-docente" required class="form-select">
                            <option value="" disabled selected>Cargando...</option>
                        </select>
                    </div>

                    <!-- TIPO DE CLASE -->
                    <div class="form-group">
                        <label>Tipo de Clase <span class="req">*</span></label>
                        <div class="radio-group" id="edit-radio-group" style="display:flex; gap:24px; margin-top:8px;">
                            <label class="radio-option" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                                <input type="radio" name="edit-cl-tipo" id="edit-cl-tipo-teoria" value="TEORIA" />
                                <span class="material-symbols-rounded" style="font-size:1.2rem; color:var(--azul-sami);">menu_book</span>
                                Teoría
                            </label>
                            <label class="radio-option" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                                <input type="radio" name="edit-cl-tipo" id="edit-cl-tipo-practica" value="PRACTICA" />
                                <span class="material-symbols-rounded" style="font-size:1.2rem; color:#27ae60;">science</span>
                                Práctica
                            </label>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="clase-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody    = document.getElementById("clases-tbody");
    const table    = document.getElementById("clases-table");
    const emptyMsg = document.getElementById("clases-empty-msg");
    const search   = document.getElementById("clase-search-input");
    const overlay  = document.getElementById("clase-modal-overlay");
    const editForm = document.getElementById("clase-edit-form");

    let clases          = [];
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
    function badgeEstado(estado) {
        const activo = estado === "ACTIVO";
        return `<span style="
            display:inline-flex; align-items:center; gap:4px;
            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
            background:${activo ? "#e6f9f0" : "#fdecea"};
            color:${activo ? "#1a8a4a" : "#c0392b"};
        ">
            <span class="material-symbols-rounded" style="font-size:0.85rem;">${activo ? "check_circle" : "cancel"}</span>
            ${activo ? "Activa" : "Inactiva"}
        </span>`;
    }

    // ── Resolver nombres desde catálogos ──────────────────────
    function nombreMateria(id) {
        const m = catalogoMaterias.find(x => x.id_materia === id);
        return m ? m.nombre : `ID ${id}`;
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

        lista.forEach(clase => {
            const idx      = clases.indexOf(clase);
            const esActiva = clase.estado === "ACTIVO";

            const toggleIcon  = esActiva ? "block"          : "check_circle";
            const toggleClass = esActiva ? "btn-icon-danger" : "btn-icon-success";
            const toggleTitle = esActiva ? "Desactivar clase" : "Activar clase";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${nombreMateria(clase.id_materia)}</td>
                <td>${nombreDocente(clase.id_docente)}</td>
                <td style="text-align:center;">${badgeTipo(clase.tipo_clase)}</td>
                <td style="text-align:center;">${badgeEstado(clase.estado)}</td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                        <button class="btn-icon btn-edit-clase" data-idx="${idx}" title="Editar clase">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${toggleClass} btn-toggle-clase" data-idx="${idx}" title="${toggleTitle}">
                            <span class="material-symbols-rounded">${toggleIcon}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Listeners — editar
        tbody.querySelectorAll(".btn-edit-clase").forEach(btn =>
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
        );

        // Listeners — toggle estado
        tbody.querySelectorAll(".btn-toggle-clase").forEach(btn =>
            btn.addEventListener("click", () => {
                const clase       = clases[parseInt(btn.dataset.idx)];
                const nuevoEstado = clase.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
                cambiarEstado(clase, nuevoEstado);
            })
        );
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? clases.filter(c =>
                nombreMateria(c.id_materia).toLowerCase().includes(q)  ||
                nombreDocente(c.id_docente).toLowerCase().includes(q)  ||
                c.tipo_clase.toLowerCase().includes(q)
            )
            : [...clases];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Cambiar estado ────────────────────────────────────────
    function cambiarEstado(clase, nuevoEstado) {
        fetch(`https://proyectoiid-production.up.railway.app/clases/${clase.id_clase}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                clase.estado = nuevoEstado;
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

    // ── Poblar select de docentes en el modal ─────────────────
    function poblarDocentesModal(idSeleccionado) {
        const select = document.getElementById("edit-cl-docente");
        select.innerHTML = `<option value="" disabled>Selecciona un docente...</option>`;
        catalogoDocentes.forEach(d => {
            const opt = document.createElement("option");
            opt.value       = d.id_usuario;
            opt.textContent = d.nombre_completo;
            if (d.id_usuario === idSeleccionado) opt.selected = true;
            select.appendChild(opt);
        });
    }

    // ── Modal — abrir ─────────────────────────────────────────
    function abrirModal(idx) {
        const clase = clases[idx];

        document.getElementById("edit-clase-id").value         = clase.id_clase;
        document.getElementById("edit-cl-materia-label").value = nombreMateria(clase.id_materia);

        poblarDocentesModal(clase.id_docente);

        // Pre-seleccionar tipo
        const radios = document.querySelectorAll('input[name="edit-cl-tipo"]');
        radios.forEach(r => { r.checked = r.value === clase.tipo_clase; });

        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("clase-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("clase-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Modal — guardar cambios ───────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        let valido = true;

        const docenteEl = document.getElementById("edit-cl-docente");
        if (!docenteEl.value) {
            docenteEl.style.borderColor = "#e74c3c";
            valido = false;
            docenteEl.addEventListener("change", () => docenteEl.style.borderColor = "", { once: true });
        }

        const tipoSeleccionado = document.querySelector('input[name="edit-cl-tipo"]:checked');
        if (!tipoSeleccionado) {
            const rg = document.getElementById("edit-radio-group");
            rg.style.outline = "2px solid #e74c3c";
            rg.style.borderRadius = "6px";
            valido = false;
            document.querySelectorAll('input[name="edit-cl-tipo"]').forEach(r =>
                r.addEventListener("change", () => { rg.style.outline = ""; }, { once: true })
            );
        }

        if (!valido) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const idClase = document.getElementById("edit-clase-id").value;

        const datos = {
            id_docente: parseInt(docenteEl.value),
            tipo_clase: tipoSeleccionado.value,
        };

        fetch(`https://proyectoiid-production.up.railway.app/clases/${idClase}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            if (data.success) {
                alert("Clase actualizada correctamente.");
                cerrarModal();
                cargarClases();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar la clase.");
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
            // BACKEND: GET /materias → { success: true, materias: [{ id_materia, nombre }] }
            fetch("https://proyectoiid-production.up.railway.app/materias/activas")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoMaterias = d.materias; })
                .catch(() => {}),

            // BACKEND: GET /docentes → { success: true, docentes: [{ id_usuario, nombre_completo }] }
            // Usuarios con id_rol = 2 y estado = 'ACTIVO'
            // nombre_completo = primer_nombre + " " + primer_apellido (construido en el backend)
            fetch("https://proyectoiid-production.up.railway.app/docentes")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoDocentes = d.docentes; })
                .catch(() => {})
        ]);
    }

    function cargarClases() {
        // BACKEND: GET /clases → { success: true, clases: [...] }
        fetch("https://proyectoiid-production.up.railway.app/clases")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    clases = data.clases;
                    renderTabla(clases);
                } else {
                    alert(data.error || data.mensaje || "No se pudieron cargar las clases.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Error al cargar las clases.");
            });
    }

    // Catálogos en paralelo, luego tabla
    cargarCatalogos().then(cargarClases);
}