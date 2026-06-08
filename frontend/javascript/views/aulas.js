// ============================================================
//  views/aulas.js — Vistas de Aulas (Admin)
// ============================================================

// ── VISTA: REGISTRAR AULA ─────────────────────────────────────
function renderViewRegistrarAula(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">door_front</span> Registrar Aula</h1>
            <p>Ingresa los datos del aula para agregarla al sistema.</p>
        </div>

        <div class="admin-card" style="max-width:760px;">
            <h3><span class="material-symbols-rounded">add_home</span> Nueva Aula</h3>

            <form id="add-aula-form" novalidate>

                <!-- ── CÓDIGO Y EDIFICIO ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Código de Aula <span class="req">*</span></label>
                        <input
                            type="text"
                            id="a-codigo"
                            placeholder="Ej. A-101"
                            required
                            autocomplete="off"
                            maxlength="20"
                            class="input-uppercase"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">Máx. 20 caracteres</small>
                    </div>
                    <div class="form-group">
                        <label>Edificio <span class="req">*</span></label>
                        <input
                            type="text"
                            id="a-edificio"
                            placeholder="Ej. A"
                            required
                            autocomplete="off"
                            maxlength="10"
                            class="input-uppercase"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">Máx. 10 caracteres</small>
                    </div>
                </div>

                <!-- ── NIVEL Y CAPACIDAD ── -->
                <div class="form-row">
                    <div class="form-group">
                        <label>Nivel <span class="req">*</span></label>
                        <input
                            type="number"
                            id="a-nivel"
                            placeholder="Ej. 1"
                            required
                            min="0"
                            max="99"
                            inputmode="numeric"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">Planta baja = 0</small>
                    </div>
                    <div class="form-group">
                        <label>Capacidad <span class="req">*</span></label>
                        <input
                            type="number"
                            id="a-capacidad"
                            placeholder="Ej. 30"
                            required
                            min="1"
                            max="500"
                            inputmode="numeric"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">Número de estudiantes</small>
                    </div>
                </div>

                <!-- ── DESCRIPCIÓN ── -->
                <div class="form-group">
                    <label>Descripción <span class="opt">(opcional)</span></label>
                    <input
                        type="text"
                        id="a-descripcion"
                        placeholder="Ej. Laboratorio de cómputo equipado con 30 PCs"
                        autocomplete="off"
                        maxlength="255"
                        class="form-input-full"
                    />
                    <small style="color:#aaa; font-size:0.78rem;">Máx. 255 caracteres</small>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:15px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Aula
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Helpers de input ─────────────────────────────────────
    setupUppercase("a-codigo");
    setupUppercase("a-edificio");

    // ── Envío del formulario ─────────────────────────────────
    const form = document.getElementById("add-aula-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        // Validación manual de campos requeridos
        const requeridos = ["a-codigo", "a-edificio", "a-nivel", "a-capacidad"];
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
            codigo_aula: document.getElementById("a-codigo").value.trim(),
            edificio:    document.getElementById("a-edificio").value.trim(),
            nivel:       parseInt(document.getElementById("a-nivel").value),
            capacidad:   parseInt(document.getElementById("a-capacidad").value),
            descripcion: document.getElementById("a-descripcion").value.trim() || null,
        };

        fetch("https://proyectoiid-production.up.railway.app/aulas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nueva)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                alert("Aula registrada correctamente.");
            } else {
                alert(data.error || data.mensaje || "No se pudo registrar el aula.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });
}


// ── VISTA: VER AULAS REGISTRADAS ─────────────────────────────
function renderViewVerAulas(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">meeting_room</span> Aulas Registradas</h1>
            <p>Consulta, edita o cambia el estado de las aulas del sistema.</p>
        </div>

        <div class="admin-card">
            <!-- Barra de búsqueda -->
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="aula-search-input"
                    placeholder="Buscar por código, edificio o descripción..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <!-- Tabla -->
            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="aulas-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Edificio</th>
                            <th style="text-align:center;">Nivel</th>
                            <th style="text-align:center;">Capacidad</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="aulas-tbody"></tbody>
                </table>
                <div id="aulas-empty-msg" class="empty-state">No hay aulas registradas.</div>
            </div>
        </div>

        <!-- MODAL EDITAR AULA -->
        <div id="aula-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:620px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Aula</h3>
                    <button id="aula-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="aula-edit-form" novalidate>
                    <input type="hidden" id="edit-aula-id" />

                    <!-- CÓDIGO Y EDIFICIO -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Código de Aula <span class="req">*</span></label>
                            <input
                                type="text"
                                id="edit-a-codigo"
                                required
                                autocomplete="off"
                                maxlength="20"
                                class="input-uppercase"
                            />
                        </div>
                        <div class="form-group">
                            <label>Edificio <span class="req">*</span></label>
                            <input
                                type="text"
                                id="edit-a-edificio"
                                required
                                autocomplete="off"
                                maxlength="10"
                                class="input-uppercase"
                            />
                        </div>
                    </div>

                    <!-- NIVEL Y CAPACIDAD -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nivel <span class="req">*</span></label>
                            <input
                                type="number"
                                id="edit-a-nivel"
                                required
                                min="0"
                                max="99"
                                inputmode="numeric"
                            />
                        </div>
                        <div class="form-group">
                            <label>Capacidad <span class="req">*</span></label>
                            <input
                                type="number"
                                id="edit-a-capacidad"
                                required
                                min="1"
                                max="500"
                                inputmode="numeric"
                            />
                        </div>
                    </div>

                    <!-- DESCRIPCIÓN -->
                    <div class="form-group">
                        <label>Descripción <span class="opt">(opcional)</span></label>
                        <input
                            type="text"
                            id="edit-a-descripcion"
                            autocomplete="off"
                            maxlength="255"
                            class="form-input-full"
                        />
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="aula-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody   = document.getElementById("aulas-tbody");
    const table   = document.getElementById("aulas-table");
    const emptyMsg= document.getElementById("aulas-empty-msg");
    const search  = document.getElementById("aula-search-input");
    const overlay = document.getElementById("aula-modal-overlay");
    const editForm= document.getElementById("aula-edit-form");

    let aulas = [];

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

        lista.forEach(aula => {
            const idx      = aulas.indexOf(aula);
            const esActiva = aula.estado === "ACTIVO";

            const toggleIcon  = esActiva ? "block"         : "check_circle";
            const toggleClass = esActiva ? "btn-icon-danger" : "btn-icon-success";
            const toggleTitle = esActiva ? "Desactivar aula"  : "Activar aula";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${aula.codigo_aula}</strong></td>
                <td>${aula.edificio}</td>
                <td style="text-align:center;">${aula.nivel}</td>
                <td style="text-align:center;">${aula.capacidad}</td>
                <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${aula.descripcion || "<span style='color:#bbb;'>—</span>"}
                </td>
                <td style="text-align:center;">${badgeEstado(aula.estado)}</td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                        <button class="btn-icon btn-edit-aula" data-idx="${idx}" title="Editar aula">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${toggleClass} btn-toggle-aula" data-idx="${idx}" title="${toggleTitle}">
                            <span class="material-symbols-rounded">${toggleIcon}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Listeners — editar
        tbody.querySelectorAll(".btn-edit-aula").forEach(btn =>
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
        );

        // Listeners — activar / desactivar
        tbody.querySelectorAll(".btn-toggle-aula").forEach(btn =>
            btn.addEventListener("click", () => {
                const aula = aulas[parseInt(btn.dataset.idx)];
                const nuevoEstado = aula.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
                cambiarEstado(aula, nuevoEstado);
            })
        );
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? aulas.filter(a =>
                a.codigo_aula.toLowerCase().includes(q) ||
                a.edificio.toLowerCase().includes(q)    ||
                (a.descripcion || "").toLowerCase().includes(q)
            )
            : [...aulas];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Cambiar estado (activar / desactivar) ─────────────────
    function cambiarEstado(aula, nuevoEstado) {
        fetch(`https://proyectoiid-production.up.railway.app/aulas/${aula.id_aula}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                aula.estado = nuevoEstado;
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

    // ── Modal — abrir y poblar ────────────────────────────────
    function abrirModal(idx) {
        const aula = aulas[idx];

        document.getElementById("edit-aula-id").value    = aula.id_aula;
        document.getElementById("edit-a-codigo").value   = aula.codigo_aula   || "";
        document.getElementById("edit-a-edificio").value = aula.edificio       || "";
        document.getElementById("edit-a-nivel").value    = aula.nivel          ?? "";
        document.getElementById("edit-a-capacidad").value= aula.capacidad      ?? "";
        document.getElementById("edit-a-descripcion").value = aula.descripcion || "";

        // Activar formato uppercase en los inputs del modal
        setupUppercase("edit-a-codigo");
        setupUppercase("edit-a-edificio");

        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("aula-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("aula-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Modal — guardar cambios ───────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = ["edit-a-codigo", "edit-a-edificio", "edit-a-nivel", "edit-a-capacidad"];
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

        const idAula = document.getElementById("edit-aula-id").value;

        const datos = {
            codigo_aula: document.getElementById("edit-a-codigo").value.trim(),
            edificio:    document.getElementById("edit-a-edificio").value.trim(),
            nivel:       parseInt(document.getElementById("edit-a-nivel").value),
            capacidad:   parseInt(document.getElementById("edit-a-capacidad").value),
            descripcion: document.getElementById("edit-a-descripcion").value.trim() || null,
        };

        fetch(`https://proyectoiid-production.up.railway.app/aulas/${idAula}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Aula actualizada correctamente.");
                cerrarModal();
                // Recargar lista desde el servidor
                cargarAulas();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar el aula.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });

    // ── Carga inicial ─────────────────────────────────────────
    function cargarAulas() {
        fetch("https://proyectoiid-production.up.railway.app/aulas")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                aulas = data.aulas;
                renderTabla(aulas);
            } else {
                alert(data.error || data.mensaje || "No se pudieron cargar las aulas.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al cargar las aulas.");
        });
    }

    cargarAulas();
}