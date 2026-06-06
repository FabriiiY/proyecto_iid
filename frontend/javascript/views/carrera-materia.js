// ============================================================
//  views/carrera-materia.js — Materias de la Carrera (Admin)
// ============================================================

// ── VISTA: ASIGNAR MATERIA A CARRERA ─────────────────────────
function renderViewAsignarMateriaCarrera(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">playlist_add</span> Asignar Materia a Carrera</h1>
            <p>Vincula una materia existente a una carrera y define su número correlativo en el plan de estudios.</p>
        </div>

        <div class="admin-card" style="max-width:760px;">
            <h3><span class="material-symbols-rounded">add_circle</span> Nueva Asignación</h3>

            <form id="add-cm-form" novalidate>

                <!-- ── CARRERA Y MATERIA ── -->
                <div class="form-row">
                    <div class="form-group">
                        <!-- BACKEND: GET /carreras → { success: true, carreras: [{ id_carrera, nombre, codigo_carrera }] }
                             Filtrar solo estado = 'ACTIVO' -->
                        <label>Carrera <span class="req">*</span></label>
                        <select id="cm-carrera" required class="form-select">
                            <option value="" disabled selected>Cargando carreras...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <!-- BACKEND: GET /materias → { success: true, materias: [{ id_materia, nombre }] }
                             Filtrar solo estado = 'ACTIVA' -->
                        <label>Materia <span class="req">*</span></label>
                        <select id="cm-materia" required class="form-select">
                            <option value="" disabled selected>Cargando materias...</option>
                        </select>
                    </div>
                </div>

                <!-- ── NÚMERO CORRELATIVO ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Número Correlativo <span class="req">*</span></label>
                        <input
                            type="number"
                            id="cm-correlativo"
                            placeholder="Ej. 1"
                            required
                            min="1"
                            max="999"
                            inputmode="numeric"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">
                            Posición de la materia en el plan de estudios de esa carrera
                        </small>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:15px;">
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

    cargarSelect("cm-carrera", "carreras", "id_carrera", "nombre", "Error al cargar carreras");
    cargarSelect("cm-materia", "materias", "id_materia", "nombre", "Error al cargar materias");

    // ── Envío del formulario ──────────────────────────────────
    const form = document.getElementById("add-cm-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = ["cm-carrera", "cm-materia", "cm-correlativo"];
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

        const nueva = {
            id_carrera:         parseInt(document.getElementById("cm-carrera").value),
            id_materia:         parseInt(document.getElementById("cm-materia").value),
            numero_correlativo: parseInt(document.getElementById("cm-correlativo").value),
        };

        fetch("http://127.0.0.1:5000/carrera_materias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nueva)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                alert("Materia asignada a la carrera correctamente.");
            } else {
                // El backend puede devolver error de duplicado (uk_carrera_materia)
                alert(data.error || data.mensaje || "No se pudo realizar la asignación.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });
}


// ── VISTA: VER MATERIAS DE CARRERAS ──────────────────────────
function renderViewVerMateriasCarrera(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">library_books</span> Materias por Carrera</h1>
            <p>Consulta, edita o cambia el estado de las materias asignadas a cada carrera.</p>
        </div>

        <div class="admin-card">
            <!-- Barra de búsqueda -->
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="cm-search-input"
                    placeholder="Buscar por materia o carrera..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <!-- Tabla -->
            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="cm-table" style="display:none;">
                    <thead>
                        <tr>
                            <th style="text-align:center;">#</th>
                            <th>Materia</th>
                            <th>Carrera</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="cm-tbody"></tbody>
                </table>
                <div id="cm-empty-msg" class="empty-state">No hay materias asignadas a carreras.</div>
            </div>
        </div>

        <!-- MODAL EDITAR ASIGNACIÓN -->
        <div id="cm-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:580px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Asignación</h3>
                    <button id="cm-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="cm-edit-form" novalidate>
                    <input type="hidden" id="edit-cm-id" />

                    <!-- CARRERA Y MATERIA (no editables, solo informativos) -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Carrera</label>
                            <input
                                type="text"
                                id="edit-cm-carrera-label"
                                class="form-input-full"
                                disabled
                                style="background:#f5f5f5; color:#888; cursor:not-allowed;"
                            />
                        </div>
                        <div class="form-group">
                            <label>Materia</label>
                            <input
                                type="text"
                                id="edit-cm-materia-label"
                                class="form-input-full"
                                disabled
                                style="background:#f5f5f5; color:#888; cursor:not-allowed;"
                            />
                        </div>
                    </div>

                    <!-- NÚMERO CORRELATIVO (único campo editable) -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Número Correlativo <span class="req">*</span></label>
                            <input
                                type="number"
                                id="edit-cm-correlativo"
                                required
                                min="1"
                                max="999"
                                inputmode="numeric"
                            />
                            <small style="color:#aaa; font-size:0.78rem;">
                                Posición en el plan de estudios de la carrera
                            </small>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="cm-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody    = document.getElementById("cm-tbody");
    const table    = document.getElementById("cm-table");
    const emptyMsg = document.getElementById("cm-empty-msg");
    const search   = document.getElementById("cm-search-input");
    const overlay  = document.getElementById("cm-modal-overlay");
    const editForm = document.getElementById("cm-edit-form");

    let registros        = [];
    let catalogoCarreras = [];
    let catalogoMaterias = [];

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

    // ── Resolver nombres desde catálogos ──────────────────────
    function nombreCarrera(id) {
        const c = catalogoCarreras.find(x => x.id_carrera === id);
        return c ? c.nombre : `ID ${id}`;
    }

    function nombreMateria(id) {
        const m = catalogoMaterias.find(x => x.id_materia === id);
        return m ? m.nombre : `ID ${id}`;
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

        lista.forEach(reg => {
            const idx      = registros.indexOf(reg);
            const esActivo = reg.estado === "ACTIVO";

            const toggleIcon  = esActivo ? "block"          : "check_circle";
            const toggleClass = esActivo ? "btn-icon-danger" : "btn-icon-success";
            const toggleTitle = esActivo ? "Desactivar asignación" : "Activar asignación";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="text-align:center; font-weight:600; color:var(--azul-sami);">
                    ${reg.numero_correlativo}
                </td>
                <td>${nombreMateria(reg.id_materia)}</td>
                <td>
                    <span class="subject-tag">${nombreCarrera(reg.id_carrera)}</span>
                </td>
                <td style="text-align:center;">${badgeEstado(reg.estado)}</td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                        <button class="btn-icon btn-edit-cm" data-idx="${idx}" title="Editar asignación">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${toggleClass} btn-toggle-cm" data-idx="${idx}" title="${toggleTitle}">
                            <span class="material-symbols-rounded">${toggleIcon}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Listeners — editar
        tbody.querySelectorAll(".btn-edit-cm").forEach(btn =>
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
        );

        // Listeners — toggle estado
        tbody.querySelectorAll(".btn-toggle-cm").forEach(btn =>
            btn.addEventListener("click", () => {
                const reg         = registros[parseInt(btn.dataset.idx)];
                const nuevoEstado = reg.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
                cambiarEstado(reg, nuevoEstado);
            })
        );
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? registros.filter(r =>
                nombreMateria(r.id_materia).toLowerCase().includes(q) ||
                nombreCarrera(r.id_carrera).toLowerCase().includes(q)
            )
            : [...registros];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Cambiar estado ────────────────────────────────────────
    function cambiarEstado(reg, nuevoEstado) {
        fetch(`http://127.0.0.1:5000/carrera_materias/${reg.id_carrera_materia}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                reg.estado = nuevoEstado;
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

    // ── Modal — abrir ─────────────────────────────────────────
    function abrirModal(idx) {
        const reg = registros[idx];

        document.getElementById("edit-cm-id").value            = reg.id_carrera_materia;
        document.getElementById("edit-cm-carrera-label").value = nombreCarrera(reg.id_carrera);
        document.getElementById("edit-cm-materia-label").value = nombreMateria(reg.id_materia);
        document.getElementById("edit-cm-correlativo").value   = reg.numero_correlativo ?? "";

        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("cm-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("cm-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Modal — guardar cambios ───────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const correlativoEl = document.getElementById("edit-cm-correlativo");
        if (!correlativoEl.value.toString().trim()) {
            correlativoEl.style.borderColor = "#e74c3c";
            correlativoEl.addEventListener("input", () => correlativoEl.style.borderColor = "", { once: true });
            alert("El número correlativo es obligatorio.");
            return;
        }

        const idCM = document.getElementById("edit-cm-id").value;

        fetch(`http://127.0.0.1:5000/carrera_materias/${idCM}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                numero_correlativo: parseInt(correlativoEl.value)
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Asignación actualizada correctamente.");
                cerrarModal();
                cargarRegistros();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar la asignación.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });

    // ── Carga inicial — catálogos en paralelo, luego tabla ────
    function cargarCatalogos() {
        return Promise.all([
            // BACKEND: GET /carreras → { success: true, carreras: [{ id_carrera, nombre }] }
            fetch("http://127.0.0.1:5000/carreras")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoCarreras = d.carreras; })
                .catch(() => {}),

            // BACKEND: GET /materias → { success: true, materias: [{ id_materia, nombre }] }
            fetch("http://127.0.0.1:5000/materias")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoMaterias = d.materias; })
                .catch(() => {})
        ]);
    }

    function cargarRegistros() {
        // BACKEND: GET /carrera_materias → { success: true, carrera_materias: [...] }
        fetch("http://127.0.0.1:5000/carrera_materias")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    registros = data.carrera_materias;
                    renderTabla(registros);
                } else {
                    alert(data.error || data.mensaje || "No se pudieron cargar los registros.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Error al cargar los registros.");
            });
    }

    // Catálogos primero (en paralelo), luego la tabla
    cargarCatalogos().then(cargarRegistros);
}