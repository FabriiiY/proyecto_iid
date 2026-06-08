// ============================================================
//  views/tipo_clase.js
//  Vistas: Modalidad  y  Tipo de Programa
//
//  Ambas tablas tienen la misma estructura en la BD:
//    id_*  |  nombre VARCHAR(50) UNIQUE  |  descripcion VARCHAR(255)
//    estado ENUM('ACTIVO','INACTIVO')   |  fecha_actualizacion
//
//  Endpoints esperados (tu compañero los implementa):
//    GET    /modalidades              → { success, modalidades: [...] }
//    POST   /modalidades              → { success, modalidad }
//    PUT    /modalidades/:id/estado   → { success }
//
//    GET    /tipos-programa           → { success, tipos: [...] }
//    POST   /tipos-programa           → { success, tipo }
//    PUT    /tipos-programa/:id/estado → { success }
// ============================================================

// ── Helper genérico: construye la vista completa ─────────────
function renderViewTipoClaseGenerico(container, cfg) {
    /*
     * cfg = {
     *   titulo      : string   — encabezado h1
     *   icono       : string   — material-symbol
     *   subtitulo   : string   — párrafo descripción
     *   labelNombre : string   — etiqueta del campo nombre
     *   placeholder : string   — placeholder del campo nombre
     *   endpointGet : string   — URL GET lista
     *   endpointPost: string   — URL POST crear
     *   endpointEstado: fn(id) — URL PUT estado  ej. id => `/modalidades/${id}/estado`
     *   keyLista    : string   — key del objeto respuesta GET  ej. "modalidades"
     *   keyItem     : string   — key del objeto respuesta POST ej. "modalidad"
     *   idField     : string   — campo PK del objeto           ej. "id_modalidad"
     * }
     */

    container.innerHTML = `
        <div class="dashboard-header">
            <h1>
                <span class="material-symbols-rounded">${cfg.icono}</span>
                ${cfg.titulo}
            </h1>
            <p>${cfg.subtitulo}</p>
        </div>

        <!-- FORMULARIO CREAR -->
        <div class="admin-card" style="max-width:680px;">
            <h3>
                <span class="material-symbols-rounded">add_circle</span>
                Nuevo registro
            </h3>

            <form id="tc-form" novalidate>
                <div class="form-row">
                    <div class="form-group" style="grid-column:span 2;">
                        <label>${cfg.labelNombre} <span class="req">*</span></label>
                        <input
                            type="text"
                            id="tc-nombre"
                            placeholder="${cfg.placeholder}"
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
                        id="tc-descripcion"
                        class="materia-textarea"
                        placeholder="Breve descripción..."
                        rows="2"
                    ></textarea>
                </div>
                <div style="display:flex; justify-content:flex-end; margin-top:8px;">
                    <button type="submit" class="btn-primary" id="tc-submit-btn" style="width:auto; padding:11px 28px;">
                        <span class="material-symbols-rounded">save</span> Guardar
                    </button>
                </div>
            </form>
        </div>

        <!-- TABLA DE EXISTENTES -->
        <div class="admin-card" style="max-width:680px;">
            <h3>
                <span class="material-symbols-rounded">list</span>
                Registros existentes
            </h3>

            <div class="students-table-wrapper">
                <table class="students-table" id="tc-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acción</th>
                        </tr>
                    </thead>
                    <tbody id="tc-tbody"></tbody>
                </table>
                <div id="tc-empty" class="empty-state">No hay registros todavía.</div>
            </div>
        </div>
    `;

    // ── Uppercase en tiempo real ──────────────────────────────
    const inputNombre = document.getElementById("tc-nombre");
    inputNombre.addEventListener("input", function () {
        const pos = this.selectionStart;
        this.value = this.value.toUpperCase();
        this.setSelectionRange(pos, pos);
    });

    // ── Render tabla ─────────────────────────────────────────
    const tbody   = document.getElementById("tc-tbody");
    const table   = document.getElementById("tc-table");
    const emptyEl = document.getElementById("tc-empty");

    let registros = [];

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
                        class="btn-icon ${esActivo ? "btn-icon-danger" : "btn-icon-success"} btn-tc-toggle"
                        data-id="${item[cfg.idField]}"
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

        // Listeners toggle
        tbody.querySelectorAll(".btn-tc-toggle").forEach(btn => {
            btn.addEventListener("click", () => {
                const id         = btn.dataset.id;
                const nuevoEstado = btn.dataset.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";

                fetch(cfg.endpointEstado(id), {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ estado: nuevoEstado })
                })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        const item = registros.find(x => String(x[cfg.idField]) === String(id));
                        if (item) item.estado = nuevoEstado;
                        renderTabla(registros);
                    } else {
                        alert(data.mensaje || "Error al cambiar estado");
                    }
                })
                .catch(() => alert("Error al conectar con el servidor"));
            });
        });
    }

    // ── Cargar lista inicial ──────────────────────────────────
    fetch(cfg.endpointGet)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                registros = data[cfg.keyLista] || [];
                renderTabla(registros);
            }
        })
        .catch(() => {
            emptyEl.textContent = "Error al cargar los datos.";
            emptyEl.style.display = "block";
        });

    // ── Envío del formulario ──────────────────────────────────
    const form      = document.getElementById("tc-form");
    const submitBtn = document.getElementById("tc-submit-btn");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        if (!nombre) {
            inputNombre.style.borderColor = "#e74c3c";
            inputNombre.addEventListener("input", () => inputNombre.style.borderColor = "", { once: true });
            alert("El nombre es obligatorio.");
            return;
        }

        // Deshabilitar botón mientras se guarda
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-rounded">hourglass_top</span> Guardando...`;

        const payload = {
            nombre,
            descripcion: document.getElementById("tc-descripcion").value.trim() || null
        };

        fetch(cfg.endpointPost, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                // Agregar a la lista local y re-renderizar
                const nuevo = data[cfg.keyItem];
                if (nuevo) registros.push(nuevo);
                renderTabla(registros);

                // Resetear formulario
                form.reset();

                // Feedback visual en el botón
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

// ── Vista: MODALIDAD ─────────────────────────────────────────
function renderViewModalidad(container) {
    renderViewTipoClaseGenerico(container, {
        titulo       : "Modalidad",
        icono        : "cast_for_education",
        subtitulo    : "Gestiona las modalidades de clase disponibles en el sistema (Presencial, Virtual, Semipresencial, etc.)",
        labelNombre  : "Nombre de la Modalidad",
        placeholder  : "Ej. PRESENCIAL",
        endpointGet  : "https://proyectoiid-production.up.railway.app/modalidades",
        endpointPost : "https://proyectoiid-production.up.railway.app/modalidades",
        endpointEstado: id => `https://proyectoiid-production.up.railway.app/modalidades/${id}/estado`,
        keyLista     : "modalidades",
        keyItem      : "modalidad",
        idField      : "id_modalidad"
    });
}

// ── Vista: TIPO DE PROGRAMA ───────────────────────────────────
function renderViewTipoPrograma(container) {
    renderViewTipoClaseGenerico(container, {
        titulo       : "Tipo de Programa",
        icono        : "category",
        subtitulo    : "Gestiona los tipos de programa de estudio disponibles (Técnico, Ingeniería, Dual, etc.)",
        labelNombre  : "Nombre del Tipo de Programa",
        placeholder  : "Ej. TECNICO",
        endpointGet  : "https://proyectoiid-production.up.railway.app/tipos-programa",
        endpointPost : "https://proyectoiid-production.up.railway.app/tipos-programa",
        endpointEstado: id => `https://proyectoiid-production.up.railway.app/tipos-programa/${id}/estado`,
        keyLista     : "tipos",
        keyItem      : "tipo",
        idField      : "id_tipo_programa"
    });
}