// ============================================================
//  views/ciclos-periodos.js
//  Vistas: Ciclos  y  Periodos
//
//  Estructura en BD:
//
//  CICLOS:
//    id_ciclo | nombre VARCHAR(50) UNIQUE | anio INT
//    fecha_inicio DATE | fecha_fin DATE | estado ENUM('ACTIVO','INACTIVO')
//    fecha_actualizacion
//
//  PERIODOS:
//    id_periodo | nombre VARCHAR(50) UNIQUE | descripcion VARCHAR(255)
//    estado ENUM('ACTIVO','INACTIVO') | fecha_actualizacion
//
//  Endpoints esperados:
//    GET    /ciclos              → { success, ciclos: [...] }
//    POST   /ciclos              → { success, ciclo }
//    PUT    /ciclos/:id/estado   → { success }
//
//    GET    /periodos            → { success, periodos: [...] }
//    POST   /periodos            → { success, periodo }
//    PUT    /periodos/:id/estado → { success }
// ============================================================


// ── Vista: REGISTRAR CICLO ────────────────────────────────────
function renderViewRegistrarCiclo(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1>
                <span class="material-symbols-rounded">event_repeat</span>
                Registrar Ciclo
            </h1>
            <p>Crea un nuevo ciclo académico con sus fechas de inicio y fin.</p>
        </div>

        <!-- FORMULARIO -->
        <div class="admin-card" style="max-width:680px;">
            <h3>
                <span class="material-symbols-rounded">add_circle</span>
                Nuevo Ciclo
            </h3>

            <form id="ciclo-form" novalidate>
                <div class="form-row">
                    <div class="form-group" style="grid-column:span 2;">
                        <label>Nombre del Ciclo <span class="req">*</span></label>
                        <input
                            type="text"
                            id="ciclo-nombre"
                            placeholder="Ej. CICLO I 2025"
                            required
                            autocomplete="off"
                            class="input-uppercase"
                            style="text-transform:uppercase;"
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Año <span class="req">*</span></label>
                        <input
                            type="number"
                            id="ciclo-anio"
                            placeholder="Ej. 2025"
                            min="2000"
                            max="2099"
                            required
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Inicio <span class="req">*</span></label>
                        <input type="date" id="ciclo-fecha-inicio" required />
                    </div>
                    <div class="form-group">
                        <label>Fecha de Fin <span class="req">*</span></label>
                        <input type="date" id="ciclo-fecha-fin" required />
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:8px;">
                    <button type="submit" class="btn-primary" id="ciclo-submit-btn" style="width:auto; padding:11px 28px;">
                        <span class="material-symbols-rounded">save</span> Guardar
                    </button>
                </div>
            </form>
        </div>

    `;

    // Uppercase en tiempo real
    const inputNombre = document.getElementById("ciclo-nombre");
    inputNombre.addEventListener("input", function () {
        const pos = this.selectionStart;
        this.value = this.value.toUpperCase();
        this.setSelectionRange(pos, pos);
    });

    const tbody    = document.getElementById("ciclo-tbody");
    const table    = document.getElementById("ciclo-table");
    const emptyEl  = document.getElementById("ciclo-empty");
    const form     = document.getElementById("ciclo-form");
    const submitBtn= document.getElementById("ciclo-submit-btn");

    let ciclos = [];

    function formatFecha(f) {
        if (!f) return "—";
        // Si viene como "2025-03-10" lo formatea a "10/03/2025"
        const [y, m, d] = f.split("T")[0].split("-");
        return `${d}/${m}/${y}`;
    }

    function renderTabla(lista) {
        tbody.innerHTML = "";
        if (!lista || lista.length === 0) {
            emptyEl.style.display = "block";
            table.style.display   = "none";
            return;
        }
        emptyEl.style.display = "none";
        table.style.display   = "table";

        lista.forEach(item => {
            const esActivo = item.estado === "ACTIVO";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${item.nombre}</strong></td>
                <td style="text-align:center;">${item.anio}</td>
                <td>${formatFecha(item.fecha_inicio)}</td>
                <td>${formatFecha(item.fecha_fin)}</td>
                <td style="text-align:center;">
                    <span class="status-badge ${esActivo ? "badge-activo" : "badge-inactivo"}">
                        ${esActivo ? "Activo" : "Inactivo"}
                    </span>
                </td>
                <td style="text-align:center;">
                    <button
                        class="btn-icon ${esActivo ? "btn-icon-danger" : "btn-icon-success"} btn-ciclo-toggle"
                        data-id="${item.id_ciclo}"
                        data-estado="${item.estado}"
                        title="${esActivo ? "Desactivar" : "Activar"}"
                    >
                        <span class="material-symbols-rounded">
                            ${esActivo ? "block" : "check_circle"}
                        </span>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".btn-ciclo-toggle").forEach(btn => {
            btn.addEventListener("click", () => {
                const id          = btn.dataset.id;
                const nuevoEstado = btn.dataset.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";

                fetch(`http://127.0.0.1:5000/ciclos/${id}/estado`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ estado: nuevoEstado })
                })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        const item = ciclos.find(x => String(x.id_ciclo) === String(id));
                        if (item) item.estado = nuevoEstado;
                        renderTabla(ciclos);
                    } else {
                        alert(data.mensaje || "Error al cambiar estado");
                    }
                })
                .catch(() => alert("Error al conectar con el servidor"));
            });
        });
    }

    // Cargar lista
    fetch("http://127.0.0.1:5000/ciclos")
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                ciclos = data.ciclos || [];
                renderTabla(ciclos);
            }
        })
        .catch(() => {
            emptyEl.textContent = "Error al cargar los datos.";
            emptyEl.style.display = "block";
        });

    // Envío formulario
    form.addEventListener("submit", e => {
        e.preventDefault();

        const nombre     = inputNombre.value.trim();
        const anio       = document.getElementById("ciclo-anio").value.trim();
        const fechaInicio= document.getElementById("ciclo-fecha-inicio").value;
        const fechaFin   = document.getElementById("ciclo-fecha-fin").value;

        if (!nombre || !anio || !fechaInicio || !fechaFin) {
            alert("Todos los campos marcados con * son obligatorios.");
            return;
        }

        if (fechaFin < fechaInicio) {
            alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-rounded">hourglass_top</span> Guardando...`;

        fetch("http://127.0.0.1:5000/ciclos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, anio: parseInt(anio), fecha_inicio: fechaInicio, fecha_fin: fechaFin })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                if (data.ciclo) ciclos.push(data.ciclo);
                renderTabla(ciclos);
                form.reset();

                submitBtn.classList.add("success");
                submitBtn.innerHTML = `<span class="material-symbols-rounded">check_circle</span> Guardado`;
                setTimeout(() => {
                    submitBtn.classList.remove("success");
                    submitBtn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar`;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                alert(data.mensaje || data.error || "Error al guardar");
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar`;
            }
        })
        .catch(() => {
            alert("Error al conectar con el servidor");
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar`;
        });
    });
}


// ── Vista: VER CICLOS (sólo tabla, sin formulario) ────────────
function renderViewVerCiclos(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1>
                <span class="material-symbols-rounded">date_range</span>
                Ver Ciclos
            </h1>
            <p>Consulta todos los ciclos académicos registrados en el sistema.</p>
        </div>

        <div class="admin-card" style="max-width:780px;">
            <h3>
                <span class="material-symbols-rounded">list</span>
                Ciclos registrados
            </h3>
            <div class="students-table-wrapper">
                <table class="students-table" id="vciclo-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th style="text-align:center;">Año</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="vciclo-tbody"></tbody>
                </table>
                <div id="vciclo-empty" class="empty-state">No hay ciclos registrados todavía.</div>
            </div>
        </div>
    `;

    const tbody   = document.getElementById("vciclo-tbody");
    const table   = document.getElementById("vciclo-table");
    const emptyEl = document.getElementById("vciclo-empty");

    function formatFecha(f) {
        if (!f) return "—";
        const [y, m, d] = f.split("T")[0].split("-");
        return `${d}/${m}/${y}`;
    }

    fetch("http://127.0.0.1:5000/ciclos")
        .then(r => r.json())
        .then(data => {
            const lista = data.ciclos || [];
            if (!lista.length) {
                emptyEl.style.display = "block";
                table.style.display   = "none";
                return;
            }
            emptyEl.style.display = "none";
            table.style.display   = "table";

            lista.forEach(item => {
                const esActivo = item.estado === "ACTIVO";
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${item.nombre}</strong></td>
                    <td style="text-align:center;">${item.anio}</td>
                    <td>${formatFecha(item.fecha_inicio)}</td>
                    <td>${formatFecha(item.fecha_fin)}</td>
                    <td style="text-align:center;">
                        <span class="status-badge ${esActivo ? "badge-activo" : "badge-inactivo"}">
                            ${esActivo ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(() => {
            emptyEl.textContent = "Error al cargar los datos.";
            emptyEl.style.display = "block";
        });
}


// ── Vista: REGISTRAR PERIODO ──────────────────────────────────
function renderViewRegistrarPeriodo(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1>
                <span class="material-symbols-rounded">calendar_clock</span>
                Registrar Periodo
            </h1>
            <p>Define los periodos académicos disponibles en el sistema (Parcial 1, Final, Extraordinario, etc.)</p>
        </div>

        <!-- FORMULARIO -->
        <div class="admin-card" style="max-width:680px;">
            <h3>
                <span class="material-symbols-rounded">add_circle</span>
                Nuevo Periodo
            </h3>

            <form id="periodo-form" novalidate>
                <div class="form-row">
                    <div class="form-group" style="grid-column:span 2;">
                        <label>Nombre del Periodo <span class="req">*</span></label>
                        <input
                            type="text"
                            id="periodo-nombre"
                            placeholder="Ej. PARCIAL I"
                            required
                            autocomplete="off"
                            class="input-uppercase"
                            style="text-transform:uppercase;"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label>Descripción <span class="opt">(opcional)</span></label>
                    <textarea
                        id="periodo-descripcion"
                        class="materia-textarea"
                        placeholder="Breve descripción del periodo..."
                        rows="2"
                    ></textarea>
                </div>
                <div style="display:flex; justify-content:flex-end; margin-top:8px;">
                    <button type="submit" class="btn-primary" id="periodo-submit-btn" style="width:auto; padding:11px 28px;">
                        <span class="material-symbols-rounded">save</span> Guardar
                    </button>
                </div>
            </form>
        </div>
    `;

    // Uppercase en tiempo real
    const inputNombre = document.getElementById("periodo-nombre");
    inputNombre.addEventListener("input", function () {
        const pos = this.selectionStart;
        this.value = this.value.toUpperCase();
        this.setSelectionRange(pos, pos);
    });

    const tbody    = document.getElementById("periodo-tbody");
    const table    = document.getElementById("periodo-table");
    const emptyEl  = document.getElementById("periodo-empty");
    const form     = document.getElementById("periodo-form");
    const submitBtn= document.getElementById("periodo-submit-btn");

    let periodos = [];

    function renderTabla(lista) {
        tbody.innerHTML = "";
        if (!lista || lista.length === 0) {
            emptyEl.style.display = "block";
            table.style.display   = "none";
            return;
        }
        emptyEl.style.display = "none";
        table.style.display   = "table";

        lista.forEach(item => {
            const esActivo = item.estado === "ACTIVO";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${item.nombre}</strong></td>
                <td style="color:#888; font-size:0.87rem;">${item.descripcion || "—"}</td>
                <td style="text-align:center;">
                    <span class="status-badge ${esActivo ? "badge-activo" : "badge-inactivo"}">
                        ${esActivo ? "Activo" : "Inactivo"}
                    </span>
                </td>
                <td style="text-align:center;">
                    <button
                        class="btn-icon ${esActivo ? "btn-icon-danger" : "btn-icon-success"} btn-periodo-toggle"
                        data-id="${item.id_periodo}"
                        data-estado="${item.estado}"
                        title="${esActivo ? "Desactivar" : "Activar"}"
                    >
                        <span class="material-symbols-rounded">
                            ${esActivo ? "block" : "check_circle"}
                        </span>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".btn-periodo-toggle").forEach(btn => {
            btn.addEventListener("click", () => {
                const id          = btn.dataset.id;
                const nuevoEstado = btn.dataset.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";

                fetch(`http://127.0.0.1:5000/periodos/${id}/estado`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ estado: nuevoEstado })
                })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        const item = periodos.find(x => String(x.id_periodo) === String(id));
                        if (item) item.estado = nuevoEstado;
                        renderTabla(periodos);
                    } else {
                        alert(data.mensaje || "Error al cambiar estado");
                    }
                })
                .catch(() => alert("Error al conectar con el servidor"));
            });
        });
    }

    // Cargar lista
    fetch("http://127.0.0.1:5000/periodos")
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                periodos = data.periodos || [];
                renderTabla(periodos);
            }
        })
        .catch(() => {
            emptyEl.textContent = "Error al cargar los datos.";
            emptyEl.style.display = "block";
        });

    // Envío formulario
    form.addEventListener("submit", e => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        if (!nombre) {
            inputNombre.style.borderColor = "#e74c3c";
            inputNombre.addEventListener("input", () => inputNombre.style.borderColor = "", { once: true });
            alert("El nombre es obligatorio.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-rounded">hourglass_top</span> Guardando...`;

        const payload = {
            nombre,
            descripcion: document.getElementById("periodo-descripcion").value.trim() || null
        };

        fetch("http://127.0.0.1:5000/periodos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                if (data.periodo) periodos.push(data.periodo);
                renderTabla(periodos);
                form.reset();

                submitBtn.classList.add("success");
                submitBtn.innerHTML = `<span class="material-symbols-rounded">check_circle</span> Guardado`;
                setTimeout(() => {
                    submitBtn.classList.remove("success");
                    submitBtn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar`;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                alert(data.mensaje || data.error || "Error al guardar");
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar`;
            }
        })
        .catch(() => {
            alert("Error al conectar con el servidor");
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar`;
        });
    });
}


// ── Vista: VER PERIODOS (sólo tabla) ─────────────────────────
function renderViewVerPeriodos(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1>
                <span class="material-symbols-rounded">view_timeline</span>
                Ver Periodos
            </h1>
            <p>Consulta todos los periodos académicos registrados en el sistema.</p>
        </div>

        <div class="admin-card" style="max-width:680px;">
            <h3>
                <span class="material-symbols-rounded">list</span>
                Periodos registrados
            </h3>
            <div class="students-table-wrapper">
                <table class="students-table" id="vperiodo-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="vperiodo-tbody"></tbody>
                </table>
                <div id="vperiodo-empty" class="empty-state">No hay periodos registrados todavía.</div>
            </div>
        </div>
    `;

    const tbody   = document.getElementById("vperiodo-tbody");
    const table   = document.getElementById("vperiodo-table");
    const emptyEl = document.getElementById("vperiodo-empty");

    fetch("http://127.0.0.1:5000/periodos")
        .then(r => r.json())
        .then(data => {
            const lista = data.periodos || [];
            if (!lista.length) {
                emptyEl.style.display = "block";
                table.style.display   = "none";
                return;
            }
            emptyEl.style.display = "none";
            table.style.display   = "table";

            lista.forEach(item => {
                const esActivo = item.estado === "ACTIVO";
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${item.nombre}</strong></td>
                    <td style="color:#888; font-size:0.87rem;">${item.descripcion || "—"}</td>
                    <td style="text-align:center;">
                        <span class="status-badge ${esActivo ? "badge-activo" : "badge-inactivo"}">
                            ${esActivo ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(() => {
            emptyEl.textContent = "Error al cargar los datos.";
            emptyEl.style.display = "block";
        });
}