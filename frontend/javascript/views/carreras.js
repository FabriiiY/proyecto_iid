// ============================================================
//  views/carreras.js — Vistas de Carreras (Admin)
// ============================================================

// ── VISTA: REGISTRAR CARRERA ──────────────────────────────────
function renderViewRegistrarCarrera(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">school</span> Registrar Carrera</h1>
            <p>Ingresa los datos de la carrera para agregarla al sistema.</p>
        </div>

        <div class="admin-card" style="max-width:760px;">
            <h3><span class="material-symbols-rounded">add_circle</span> Nueva Carrera</h3>

            <form id="add-carrera-form" novalidate>

                <!-- ── CÓDIGO Y NOMBRE ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Código de Carrera <span class="req">*</span></label>
                        <input
                            type="text"
                            id="c-codigo"
                            placeholder="Ej. IID"
                            required
                            autocomplete="off"
                            maxlength="10"
                            class="input-uppercase"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">Máx. 10 caracteres</small>
                    </div>
                    <div class="form-group">
                        <!-- SELECT cargado dinámicamente desde GET /tipo_programas -->
                        <!-- BACKEND: exponer GET /tipo_programas que devuelva
                             { success: true, tipo_programas: [{ id_tipo_programa, nombre }] }
                             filtrando solo los que tengan estado = 'ACTIVO' -->
                        <label>Tipo de Programa <span class="req">*</span></label>
                        <select id="c-tipo-programa" required class="form-select">
                            <option value="" disabled selected>Cargando...</option>
                        </select>
                    </div>
                </div>

                <!-- ── NOMBRE DE LA CARRERA ── -->
                <div class="form-group">
                    <label>Nombre de la Carrera <span class="req">*</span></label>
                    <input
                        type="text"
                        id="c-nombre"
                        placeholder="Ej. TÉCNICO EN INGENIERÍA EN INFORMÁTICA INTELIGENTE"
                        required
                        autocomplete="off"
                        maxlength="150"
                        class="form-input-full input-uppercase"
                    />
                    <small style="color:#aaa; font-size:0.78rem;">Máx. 150 caracteres</small>
                </div>

                <!-- ── DESCRIPCIÓN ── -->
                <div class="form-group">
                    <label>Descripción <span class="opt">(opcional)</span></label>
                    <input
                        type="text"
                        id="c-descripcion"
                        placeholder="Ej. Carrera orientada al desarrollo de software industrial"
                        autocomplete="off"
                        maxlength="255"
                        class="form-input-full"
                    />
                    <small style="color:#aaa; font-size:0.78rem;">Máx. 255 caracteres</small>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:15px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Carrera
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Helpers de input ──────────────────────────────────────
    setupUppercase("c-codigo");
    setupUppercase("c-nombre");

    // ── Cargar Tipos de Programa en el select ─────────────────
    // BACKEND: GET /tipo_programas → { success: true, tipo_programas: [...] }
    const selectTipo = document.getElementById("c-tipo-programa");

    fetch("http://127.0.0.1:5000/tipos-programa")
        .then(res => res.json())
        .then(data => {
            selectTipo.innerHTML = `<option value="" disabled selected>Selecciona un tipo...</option>`;
            if (data.success && data.tipos.length > 0) {
                data.tipos.forEach(tp => {
                    const opt = document.createElement("option");
                    opt.value       = tp.id_tipo_programa;
                    opt.textContent = tp.nombre;
                    selectTipo.appendChild(opt);
                });
            } else {
                selectTipo.innerHTML = `<option value="" disabled selected>Sin tipos disponibles</option>`;
            }
        })
        .catch(() => {
            selectTipo.innerHTML = `<option value="" disabled selected>Error al cargar tipos</option>`;
        });

    // ── Envío del formulario ──────────────────────────────────
    const form = document.getElementById("add-carrera-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = ["c-codigo", "c-nombre", "c-tipo-programa"];
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

        const nueva = {
            codigo_carrera:  document.getElementById("c-codigo").value.trim(),
            nombre:          document.getElementById("c-nombre").value.trim(),
            descripcion:     document.getElementById("c-descripcion").value.trim() || null,
            id_tipo_programa: parseInt(document.getElementById("c-tipo-programa").value),
        };

        fetch("http://127.0.0.1:5000/carreras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nueva)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                selectTipo.value = "";
                alert("Carrera registrada correctamente.");
            } else {
                alert(data.error || data.mensaje || "No se pudo registrar la carrera.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });
}


// ── VISTA: VER CARRERAS REGISTRADAS ──────────────────────────
function renderViewVerCarreras(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">school</span> Carreras Registradas</h1>
            <p>Consulta, edita o cambia el estado de las carreras del sistema.</p>
        </div>

        <div class="admin-card">
            <!-- Barra de búsqueda -->
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="carrera-search-input"
                    placeholder="Buscar por código, nombre o tipo de programa..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <!-- Tabla -->
            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="carreras-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Tipo de Programa</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="carreras-tbody"></tbody>
                </table>
                <div id="carreras-empty-msg" class="empty-state">No hay carreras registradas.</div>
            </div>
        </div>

        <!-- MODAL EDITAR CARRERA -->
        <div id="carrera-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:620px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Carrera</h3>
                    <button id="carrera-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="carrera-edit-form" novalidate>
                    <input type="hidden" id="edit-carrera-id" />

                    <!-- CÓDIGO Y TIPO DE PROGRAMA -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Código de Carrera <span class="req">*</span></label>
                            <input
                                type="text"
                                id="edit-c-codigo"
                                required
                                autocomplete="off"
                                maxlength="10"
                                class="input-uppercase"
                            />
                        </div>
                        <div class="form-group">
                            <label>Tipo de Programa <span class="req">*</span></label>
                            <select id="edit-c-tipo-programa" required class="form-select">
                                <option value="" disabled selected>Cargando...</option>
                            </select>
                        </div>
                    </div>

                    <!-- NOMBRE -->
                    <div class="form-group">
                        <label>Nombre de la Carrera <span class="req">*</span></label>
                        <input
                            type="text"
                            id="edit-c-nombre"
                            required
                            autocomplete="off"
                            maxlength="150"
                            class="form-input-full input-uppercase"
                        />
                    </div>

                    <!-- DESCRIPCIÓN -->
                    <div class="form-group">
                        <label>Descripción <span class="opt">(opcional)</span></label>
                        <input
                            type="text"
                            id="edit-c-descripcion"
                            autocomplete="off"
                            maxlength="255"
                            class="form-input-full"
                        />
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="carrera-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody    = document.getElementById("carreras-tbody");
    const table    = document.getElementById("carreras-table");
    const emptyMsg = document.getElementById("carreras-empty-msg");
    const search   = document.getElementById("carrera-search-input");
    const overlay  = document.getElementById("carrera-modal-overlay");
    const editForm = document.getElementById("carrera-edit-form");

    let carreras      = [];
    let tiposProgramaCatalogo = []; // cache para el select del modal

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
            ${activo ? "Activa" : "Inactiva"}
        </span>`;
    }

    // ── Nombre del tipo de programa ───────────────────────────
    function nombreTipo(id) {
        const tp = tiposProgramaCatalogo.find(t => t.id_tipo_programa === id);
        return tp ? tp.nombre : `ID ${id}`;
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

        lista.forEach(carrera => {
            const idx      = carreras.indexOf(carrera);
            const esActiva = carrera.estado === "ACTIVO";

            const toggleIcon  = esActiva ? "block"          : "check_circle";
            const toggleClass = esActiva ? "btn-icon-danger" : "btn-icon-success";
            const toggleTitle = esActiva ? "Desactivar carrera" : "Activar carrera";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${carrera.codigo_carrera}</strong></td>
                <td>${carrera.nombre}</td>
                <td>
                    <span class="subject-tag">${nombreTipo(carrera.id_tipo_programa)}</span>
                </td>
                <td style="max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${carrera.descripcion || "<span style='color:#bbb;'>—</span>"}
                </td>
                <td style="text-align:center;">${badgeEstado(carrera.estado)}</td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                        <button class="btn-icon btn-edit-carrera" data-idx="${idx}" title="Editar carrera">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${toggleClass} btn-toggle-carrera" data-idx="${idx}" title="${toggleTitle}">
                            <span class="material-symbols-rounded">${toggleIcon}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Listeners — editar
        tbody.querySelectorAll(".btn-edit-carrera").forEach(btn =>
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
        );

        // Listeners — activar / desactivar
        tbody.querySelectorAll(".btn-toggle-carrera").forEach(btn =>
            btn.addEventListener("click", () => {
                const carrera     = carreras[parseInt(btn.dataset.idx)];
                const nuevoEstado = carrera.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
                cambiarEstado(carrera, nuevoEstado);
            })
        );
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? carreras.filter(c =>
                c.codigo_carrera.toLowerCase().includes(q) ||
                c.nombre.toLowerCase().includes(q)         ||
                nombreTipo(c.id_tipo_programa).toLowerCase().includes(q)
            )
            : [...carreras];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Cambiar estado ────────────────────────────────────────
    function cambiarEstado(carrera, nuevoEstado) {
        fetch(`http://127.0.0.1:5000/carreras/${carrera.id_carrera}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                carrera.estado = nuevoEstado;
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

    // ── Poblar select del modal con el catálogo ───────────────
    function poblarSelectModal(idSeleccionado) {
        const select = document.getElementById("edit-c-tipo-programa");
        select.innerHTML = `<option value="" disabled>Selecciona un tipo...</option>`;
        tiposProgramaCatalogo.forEach(tp => {
            const opt = document.createElement("option");
            opt.value       = tp.id_tipo_programa;
            opt.textContent = tp.nombre;
            if (tp.id_tipo_programa === idSeleccionado) opt.selected = true;
            select.appendChild(opt);
        });
    }

    // ── Modal — abrir y poblar ────────────────────────────────
    function abrirModal(idx) {
        const c = carreras[idx];

        document.getElementById("edit-carrera-id").value  = c.id_carrera;
        document.getElementById("edit-c-codigo").value    = c.codigo_carrera || "";
        document.getElementById("edit-c-nombre").value    = c.nombre         || "";
        document.getElementById("edit-c-descripcion").value = c.descripcion  || "";

        poblarSelectModal(c.id_tipo_programa);

        setupUppercase("edit-c-codigo");
        setupUppercase("edit-c-nombre");

        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("carrera-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("carrera-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Modal — guardar cambios ───────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = ["edit-c-codigo", "edit-c-nombre", "edit-c-tipo-programa"];
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

        const idCarrera = document.getElementById("edit-carrera-id").value;

        const datos = {
            codigo_carrera:   document.getElementById("edit-c-codigo").value.trim(),
            nombre:           document.getElementById("edit-c-nombre").value.trim(),
            descripcion:      document.getElementById("edit-c-descripcion").value.trim() || null,
            id_tipo_programa: parseInt(document.getElementById("edit-c-tipo-programa").value),
        };

        fetch(`http://127.0.0.1:5000/carreras/${idCarrera}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Carrera actualizada correctamente.");
                cerrarModal();
                cargarCarreras();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar la carrera.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });

    // ── Carga inicial — tipos de programa + carreras ──────────
    // BACKEND: GET /tipo_programas → { success: true, tipo_programas: [{ id_tipo_programa, nombre }] }
    // El select necesita el catálogo antes de que el usuario abra el modal de edición.
    function cargarTiposProgramaYLuego(callback) {
        fetch("http://127.0.0.1:5000/tipos-programa")
            .then(res => res.json())
            .then(data => {
                if (data.success) tiposProgramaCatalogo = data.tipos;
                callback();
            })
            .catch(() => callback()); // si falla el catálogo, igual cargamos la tabla
    }

    function cargarCarreras() {
        fetch("http://127.0.0.1:5000/carreras")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    carreras = data.carreras;
                    renderTabla(carreras);
                } else {
                    alert(data.error || data.mensaje || "No se pudieron cargar las carreras.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Error al cargar las carreras.");
            });
    }

    // Primero el catálogo de tipos, luego la tabla
    cargarTiposProgramaYLuego(cargarCarreras);
}