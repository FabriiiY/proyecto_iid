// ============================================================
//  views/horarios-admin.js — Control de Horarios (Admin)
// ============================================================

// ── VISTA: ASIGNAR HORARIO ────────────────────────────────────
function renderViewAsignarHorario(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">schedule</span> Asignar Horario</h1>
            <p>Define el horario de una clase, asignando aula, modalidad y franja horaria.</p>
        </div>

        <div class="admin-card" style="max-width:800px;">
            <h3><span class="material-symbols-rounded">add_circle</span> Nuevo Horario</h3>

            <form id="add-horario-form" novalidate>

                <!-- ═══ SECCIÓN 1: CLASE Y AULA ═══ -->
                <p class="form-section-label">
                    <span class="material-symbols-rounded">cast_for_education</span> Clase y Espacio
                </p>
                <div class="form-row">
                    <div class="form-group">
                        <!-- BACKEND: GET /clases → { success: true, clases: [{ id_clase, materia_nombre, tipo_clase, docente_nombre }] }
                             Clases con estado = 'ACTIVO'. El backend debe devolver los nombres resueltos con JOIN. -->
                        <label>Clase <span class="req">*</span></label>
                        <select id="h-clase" required class="form-select">
                            <option value="" disabled selected>Cargando clases...</option>
                        </select>
                        <small style="color:#aaa; font-size:0.78rem;">Formato: Materia — Tipo — Docente</small>
                    </div>
                    <div class="form-group">
                        <!-- BACKEND: GET /aulas → { success: true, aulas: [{ id_aula, codigo_aula, edificio }] }
                             Aulas con estado = 'ACTIVO' -->
                        <label>Aula <span class="req">*</span></label>
                        <select id="h-aula" required class="form-select">
                            <option value="" disabled selected>Cargando aulas...</option>
                        </select>
                    </div>
                </div>

                <!-- ═══ SECCIÓN 2: MODALIDAD Y DÍA ═══ -->
                <p class="form-section-label" style="margin-top:20px;">
                    <span class="material-symbols-rounded">tune</span> Modalidad y Día
                </p>
                <div class="form-row">
                    <div class="form-group">
                        <!-- BACKEND: GET /modalidades → { success: true, modalidades: [{ id_modalidad, nombre }] }
                             Modalidades con estado = 'ACTIVO' -->
                        <label>Modalidad <span class="req">*</span></label>
                        <select id="h-modalidad" required class="form-select">
                            <option value="" disabled selected>Cargando modalidades...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Día de la Semana <span class="req">*</span></label>
                        <select id="h-dia" required class="form-select">
                            <option value="" disabled selected>Selecciona un día...</option>
                            <option value="LUNES">Lunes</option>
                            <option value="MARTES">Martes</option>
                            <option value="MIERCOLES">Miércoles</option>
                            <option value="JUEVES">Jueves</option>
                            <option value="VIERNES">Viernes</option>
                            <option value="SABADO">Sábado</option>
                            <option value="DOMINGO">Domingo</option>
                        </select>
                    </div>
                </div>

                <!-- ═══ SECCIÓN 3: HORARIO DE CLASE ═══ -->
                <p class="form-section-label" style="margin-top:20px;">
                    <span class="material-symbols-rounded">access_time</span> Franja Horaria
                </p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Hora de Inicio <span class="req">*</span></label>
                        <input type="time" id="h-hora-inicio" required />
                    </div>
                    <div class="form-group">
                        <label>Hora de Fin <span class="req">*</span></label>
                        <input type="time" id="h-hora-fin" required />
                    </div>
                </div>

                <!-- ═══ SECCIÓN 4: VIGENCIA ═══ -->
                <p class="form-section-label" style="margin-top:20px;">
                    <span class="material-symbols-rounded">date_range</span> Vigencia del Horario
                </p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Inicio <span class="req">*</span></label>
                        <input type="date" id="h-fecha-inicio" required />
                    </div>
                    <div class="form-group">
                        <label>Fecha de Fin <span class="req">*</span></label>
                        <input type="date" id="h-fecha-fin" required />
                    </div>
                </div>

                <!-- ═══ SECCIÓN 5: TOLERANCIAS ═══ -->
                <p class="form-section-label" style="margin-top:20px;">
                    <span class="material-symbols-rounded">timer</span> Control de Asistencia
                </p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Minutos de Anticipación <span class="req">*</span></label>
                        <input
                            type="number"
                            id="h-anticipacion"
                            value="10"
                            required
                            min="0"
                            max="60"
                            inputmode="numeric"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">
                            Minutos antes de la clase para habilitar la marcación
                        </small>
                    </div>
                    <div class="form-group">
                        <label>Minutos de Tolerancia <span class="req">*</span></label>
                        <input
                            type="number"
                            id="h-tolerancia"
                            value="10"
                            required
                            min="0"
                            max="60"
                            inputmode="numeric"
                        />
                        <small style="color:#aaa; font-size:0.78rem;">
                            Minutos tras la hora de inicio antes de marcar como tardanza
                        </small>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:24px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 32px;">
                        <span class="material-symbols-rounded">save</span> Guardar Horario
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Inyectar estilo de sección si no existe ───────────────
    if (!document.getElementById("form-section-label-style")) {
        const st = document.createElement("style");
        st.id = "form-section-label-style";
        st.textContent = `
            .form-section-label {
                display: flex; align-items: center; gap: 7px;
                font-size: 0.82rem; font-weight: 700; letter-spacing: 0.06em;
                color: var(--azul-sami, #2563eb); text-transform: uppercase;
                margin: 0 0 12px 0; padding-bottom: 6px;
                border-bottom: 1.5px solid #e8edf5;
            }
            .form-section-label .material-symbols-rounded { font-size: 1rem; }
        `;
        document.head.appendChild(st);
    }

    // ── Helper genérico de select ─────────────────────────────
    function cargarSelect(selectId, endpoint, campoId, fnLabel, textoError) {
        const select = document.getElementById(selectId);
        fetch(`http://127.0.0.1:5000/${endpoint}`)
            .then(res => res.json())
            .then(data => {
                const key   = Object.keys(data).find(k => Array.isArray(data[k]));
                const lista = key ? data[key] : [];
                if (data.success && lista.length > 0) {
                    select.innerHTML = `<option value="" disabled selected>Selecciona una opción...</option>`;
                    lista.forEach(item => {
                        const opt       = document.createElement("option");
                        opt.value       = item[campoId];
                        opt.textContent = typeof fnLabel === "function" ? fnLabel(item) : item[fnLabel];
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

    cargarSelect("h-clase",     "clases/activas",      "id_clase",
        c => (c.materia_nombre && c.docente_nombre)
            ? `${c.materia_nombre} — ${c.tipo_clase} — ${c.docente_nombre}`
            : `Clase #${c.id_clase}`,
        "Error al cargar clases"
    );
    cargarSelect("h-aula",      "aulas/activas",      "id_aula",
        a => `${a.codigo_aula} — Edif. ${a.edificio}`,
        "Error al cargar aulas"
    );
    cargarSelect("h-modalidad", "modalidades/activas", "id_modalidad", "nombre", "Error al cargar modalidades");

    // ── Validación cruzada hora fin > hora inicio ─────────────
    document.getElementById("h-hora-fin").addEventListener("change", () => {
        const inicio = document.getElementById("h-hora-inicio").value;
        const fin    = document.getElementById("h-hora-fin").value;
        if (inicio && fin && fin <= inicio) {
            document.getElementById("h-hora-fin").style.borderColor = "#e74c3c";
            alert("La hora de fin debe ser posterior a la hora de inicio.");
        } else {
            document.getElementById("h-hora-fin").style.borderColor = "";
        }
    });

    // Validación cruzada fecha fin >= fecha inicio
    document.getElementById("h-fecha-fin").addEventListener("change", () => {
        const fi = document.getElementById("h-fecha-inicio").value;
        const ff = document.getElementById("h-fecha-fin").value;
        if (fi && ff && ff < fi) {
            document.getElementById("h-fecha-fin").style.borderColor = "#e74c3c";
            alert("La fecha de fin debe ser igual o posterior a la fecha de inicio.");
        } else {
            document.getElementById("h-fecha-fin").style.borderColor = "";
        }
    });

    // ── Envío del formulario ──────────────────────────────────
    const form = document.getElementById("add-horario-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = [
            "h-clase", "h-aula", "h-modalidad", "h-dia",
            "h-hora-inicio", "h-hora-fin",
            "h-fecha-inicio", "h-fecha-fin",
            "h-anticipacion", "h-tolerancia"
        ];
        let valido = true;

        requeridos.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.toString().trim()) {
                el.style.borderColor = "#e74c3c";
                valido = false;
                const reset = () => el.style.borderColor = "";
                el.addEventListener("change", reset, { once: true });
                el.addEventListener("input",  reset, { once: true });
            }
        });

        // Validar que hora fin > hora inicio
        const horaIni = document.getElementById("h-hora-inicio").value;
        const horaFin = document.getElementById("h-hora-fin").value;
        if (horaIni && horaFin && horaFin <= horaIni) {
            document.getElementById("h-hora-fin").style.borderColor = "#e74c3c";
            valido = false;
        }

        // Validar que fecha fin >= fecha inicio
        const fechaIni = document.getElementById("h-fecha-inicio").value;
        const fechaFin = document.getElementById("h-fecha-fin").value;
        if (fechaIni && fechaFin && fechaFin < fechaIni) {
            document.getElementById("h-fecha-fin").style.borderColor = "#e74c3c";
            valido = false;
        }

        if (!valido) {
            alert("Por favor revisa los campos marcados en rojo.");
            return;
        }

        const nuevo = {
            id_clase:             parseInt(document.getElementById("h-clase").value),
            id_aula:              parseInt(document.getElementById("h-aula").value),
            id_modalidad:         parseInt(document.getElementById("h-modalidad").value),
            dia_semana:           document.getElementById("h-dia").value,
            hora_inicio:          document.getElementById("h-hora-inicio").value + ":00",
            hora_fin:             document.getElementById("h-hora-fin").value + ":00",
            fecha_inicio:         document.getElementById("h-fecha-inicio").value,
            fecha_fin:            document.getElementById("h-fecha-fin").value,
            minutos_anticipacion: parseInt(document.getElementById("h-anticipacion").value),
            minutos_tolerancia:   parseInt(document.getElementById("h-tolerancia").value),
        };

        fetch("http://127.0.0.1:5000/horarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevo)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                // Restaurar defaults de minutos
                document.getElementById("h-anticipacion").value = 10;
                document.getElementById("h-tolerancia").value   = 10;
                alert("Horario registrado correctamente.");
            } else {
                alert(data.error || data.mensaje || "No se pudo registrar el horario.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });
}


// ── VISTA: VER HORARIOS GLOBALES ──────────────────────────────
function renderViewVerHorariosGlobales(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">calendar_month</span> Horarios Globales</h1>
            <p>Consulta, edita o cambia el estado de todos los horarios del sistema.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="h-search-input"
                    placeholder="Buscar por clase, aula, día o modalidad..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px; overflow-x:auto;">
                <table class="students-table" id="h-table" style="display:none; min-width:860px;">
                    <thead>
                        <tr>
                            <th>Clase</th>
                            <th>Aula</th>
                            <th>Modalidad</th>
                            <th style="text-align:center;">Día</th>
                            <th style="text-align:center;">Horario</th>
                            <th style="text-align:center;">Vigencia</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="h-tbody"></tbody>
                </table>
                <div id="h-empty-msg" class="empty-state">No hay horarios registrados.</div>
            </div>
        </div>

        <!-- MODAL EDITAR HORARIO -->
        <div id="h-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:700px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Horario</h3>
                    <button id="h-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="h-edit-form" novalidate>
                    <input type="hidden" id="edit-h-id" />

                    <!-- CLASE (no editable) -->
                    <div class="form-group">
                        <label>Clase</label>
                        <input type="text" id="edit-h-clase-label" class="form-input-full" disabled
                            style="background:#f5f5f5; color:#888; cursor:not-allowed;" />
                    </div>

                    <!-- AULA Y MODALIDAD -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Aula <span class="req">*</span></label>
                            <select id="edit-h-aula" required class="form-select">
                                <option value="" disabled>Selecciona un aula...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Modalidad <span class="req">*</span></label>
                            <select id="edit-h-modalidad" required class="form-select">
                                <option value="" disabled>Selecciona una modalidad...</option>
                            </select>
                        </div>
                    </div>

                    <!-- DÍA Y HORAS -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Día de la Semana <span class="req">*</span></label>
                            <select id="edit-h-dia" required class="form-select">
                                <option value="LUNES">Lunes</option>
                                <option value="MARTES">Martes</option>
                                <option value="MIERCOLES">Miércoles</option>
                                <option value="JUEVES">Jueves</option>
                                <option value="VIERNES">Viernes</option>
                                <option value="SABADO">Sábado</option>
                                <option value="DOMINGO">Domingo</option>
                            </select>
                        </div>
                        <div class="form-group" style="display:flex; gap:10px;">
                            <div style="flex:1;">
                                <label>Hora Inicio <span class="req">*</span></label>
                                <input type="time" id="edit-h-hora-inicio" required />
                            </div>
                            <div style="flex:1;">
                                <label>Hora Fin <span class="req">*</span></label>
                                <input type="time" id="edit-h-hora-fin" required />
                            </div>
                        </div>
                    </div>

                    <!-- FECHAS -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Fecha Inicio <span class="req">*</span></label>
                            <input type="date" id="edit-h-fecha-inicio" required />
                        </div>
                        <div class="form-group">
                            <label>Fecha Fin <span class="req">*</span></label>
                            <input type="date" id="edit-h-fecha-fin" required />
                        </div>
                    </div>

                    <!-- MINUTOS -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Min. Anticipación <span class="req">*</span></label>
                            <input type="number" id="edit-h-anticipacion" required min="0" max="60" inputmode="numeric" />
                        </div>
                        <div class="form-group">
                            <label>Min. Tolerancia <span class="req">*</span></label>
                            <input type="number" id="edit-h-tolerancia" required min="0" max="60" inputmode="numeric" />
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="h-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const tbody    = document.getElementById("h-tbody");
    const table    = document.getElementById("h-table");
    const emptyMsg = document.getElementById("h-empty-msg");
    const search   = document.getElementById("h-search-input");
    const overlay  = document.getElementById("h-modal-overlay");
    const editForm = document.getElementById("h-edit-form");

    let horarios         = [];
    let catalogoClases   = [];
    let catalogoAulas    = [];
    let catalogoMods     = [];

    const diasLabel = {
        LUNES: "Lun", MARTES: "Mar", MIERCOLES: "Mié",
        JUEVES: "Jue", VIERNES: "Vie", SABADO: "Sáb", DOMINGO: "Dom"
    };

    // ── Helpers de catálogo ───────────────────────────────────
    function etiquetaClase(id) {
        const c = catalogoClases.find(x => x.id_clase === id);
        if (!c) return `ID ${id}`;
        return (c.materia_nombre && c.docente_nombre)
            ? `${c.materia_nombre} — ${c.tipo_clase}`
            : `Clase #${id}`;
    }
    function etiquetaAula(id) {
        const a = catalogoAulas.find(x => x.id_aula === id);
        return a ? `${a.codigo_aula} · ${a.edificio}` : `ID ${id}`;
    }
    function nombreMod(id) {
        const m = catalogoMods.find(x => x.id_modalidad === id);
        return m ? m.nombre : `ID ${id}`;
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
            ${activo ? "Activo" : "Inactivo"}
        </span>`;
    }

    // ── Formatear hora HH:MM ──────────────────────────────────
    function fmtHora(t) {
        if (!t) return "—";
        return t.slice(0, 5); // "08:00:00" → "08:00"
    }

    // ── Formatear fecha corta ─────────────────────────────────
    function fmtFecha(d) {
        if (!d) return "—";
        if (d.includes("-") && d.length === 10) {
            const [y, m, day] = d.split("-");
            return `${day}/${m}/${y}`;
        }
        const fecha = new Date(d);
        if (isNaN(fecha)) return d;
        const day = String(fecha.getUTCDate()).padStart(2, "0");
        const m   = String(fecha.getUTCMonth() + 1).padStart(2, "0");
        const y   = fecha.getUTCFullYear();
        return `${day}/${m}/${y}`;
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

        lista.forEach(h => {
            const idx      = horarios.indexOf(h);
            const esActivo = h.estado === "ACTIVO";

            const toggleIcon  = esActivo ? "block"          : "check_circle";
            const toggleClass = esActivo ? "btn-icon-danger" : "btn-icon-success";
            const toggleTitle = esActivo ? "Desactivar horario" : "Activar horario";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${etiquetaClase(h.id_clase)}
                </td>
                <td>${etiquetaAula(h.id_aula)}</td>
                <td>
                    <span class="subject-tag">${nombreMod(h.id_modalidad)}</span>
                </td>
                <td style="text-align:center; font-weight:600;">
                    ${diasLabel[h.dia_semana] || h.dia_semana}
                </td>
                <td style="text-align:center; font-size:0.85rem; white-space:nowrap;">
                    ${fmtHora(h.hora_inicio)} – ${fmtHora(h.hora_fin)}
                </td>
                <td style="text-align:center; font-size:0.82rem; color:#666; white-space:nowrap;">
                    ${fmtFecha(h.fecha_inicio)}<br>
                    <span style="color:#bbb;">al</span> ${fmtFecha(h.fecha_fin)}
                </td>
                <td style="text-align:center;">${badgeEstado(h.estado)}</td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                        <button class="btn-icon btn-edit-h" data-idx="${idx}" title="Editar horario">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${toggleClass} btn-toggle-h" data-idx="${idx}" title="${toggleTitle}">
                            <span class="material-symbols-rounded">${toggleIcon}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".btn-edit-h").forEach(btn =>
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.idx)))
        );
        tbody.querySelectorAll(".btn-toggle-h").forEach(btn =>
            btn.addEventListener("click", () => {
                const h           = horarios[parseInt(btn.dataset.idx)];
                const nuevoEstado = h.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
                cambiarEstado(h, nuevoEstado);
            })
        );
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? horarios.filter(h =>
                etiquetaClase(h.id_clase).toLowerCase().includes(q)  ||
                etiquetaAula(h.id_aula).toLowerCase().includes(q)    ||
                nombreMod(h.id_modalidad).toLowerCase().includes(q)  ||
                (diasLabel[h.dia_semana] || h.dia_semana).toLowerCase().includes(q)
            )
            : [...horarios];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Cambiar estado ────────────────────────────────────────
    function cambiarEstado(h, nuevoEstado) {
        fetch(`http://127.0.0.1:5000/horarios/${h.id_horario}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                h.estado = nuevoEstado;
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
    function poblarSelectModal(selectId, catalogo, campoId, fnLabel, idSel) {
        const select = document.getElementById(selectId);
        select.innerHTML = "";
        catalogo.forEach(item => {
            const opt       = document.createElement("option");
            opt.value       = item[campoId];
            opt.textContent = typeof fnLabel === "function" ? fnLabel(item) : item[fnLabel];
            if (item[campoId] === idSel) opt.selected = true;
            select.appendChild(opt);
        });
    }

    // ── Modal — abrir ─────────────────────────────────────────
    function abrirModal(idx) {
        const h = horarios[idx];

        document.getElementById("edit-h-id").value           = h.id_horario;
        document.getElementById("edit-h-clase-label").value  = etiquetaClase(h.id_clase) + " — " + (catalogoClases.find(c => c.id_clase === h.id_clase)?.docente_nombre || "");
        document.getElementById("edit-h-hora-inicio").value  = fmtHora(h.hora_inicio);
        document.getElementById("edit-h-hora-fin").value     = fmtHora(h.hora_fin);
        document.getElementById("edit-h-fecha-inicio").value = h.fecha_inicio ? h.fecha_inicio.slice(0, 10) : "";
        document.getElementById("edit-h-fecha-fin").value    = h.fecha_fin   ? h.fecha_fin.slice(0, 10)    : "";
        document.getElementById("edit-h-anticipacion").value = h.minutos_anticipacion ?? 10;
        document.getElementById("edit-h-tolerancia").value   = h.minutos_tolerancia   ?? 10;
        document.getElementById("edit-h-dia").value          = h.dia_semana;

        poblarSelectModal("edit-h-aula",     catalogoAulas, "id_aula",     a => `${a.codigo_aula} — Edif. ${a.edificio}`, h.id_aula);
        poblarSelectModal("edit-h-modalidad", catalogoMods,  "id_modalidad","nombre",                                      h.id_modalidad);

        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("h-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("h-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Modal — guardar cambios ───────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const requeridos = [
            "edit-h-aula", "edit-h-modalidad", "edit-h-dia",
            "edit-h-hora-inicio", "edit-h-hora-fin",
            "edit-h-fecha-inicio", "edit-h-fecha-fin",
            "edit-h-anticipacion", "edit-h-tolerancia"
        ];
        let valido = true;

        requeridos.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.toString().trim()) {
                el.style.borderColor = "#e74c3c";
                valido = false;
                const reset = () => el.style.borderColor = "";
                el.addEventListener("change", reset, { once: true });
                el.addEventListener("input",  reset, { once: true });
            }
        });

        const horaIni  = document.getElementById("edit-h-hora-inicio").value;
        const horaFin  = document.getElementById("edit-h-hora-fin").value;
        const fechaIni = document.getElementById("edit-h-fecha-inicio").value;
        const fechaFin = document.getElementById("edit-h-fecha-fin").value;

        if (horaIni && horaFin && horaFin <= horaIni) {
            document.getElementById("edit-h-hora-fin").style.borderColor = "#e74c3c";
            alert("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }
        if (fechaIni && fechaFin && fechaFin < fechaIni) {
            document.getElementById("edit-h-fecha-fin").style.borderColor = "#e74c3c";
            alert("La fecha de fin debe ser igual o posterior a la fecha de inicio.");
            return;
        }

        if (!valido) {
            alert("Por favor revisa los campos marcados en rojo.");
            return;
        }

        const idH   = document.getElementById("edit-h-id").value;

        const datos = {
            id_aula:              parseInt(document.getElementById("edit-h-aula").value),
            id_modalidad:         parseInt(document.getElementById("edit-h-modalidad").value),
            dia_semana:           document.getElementById("edit-h-dia").value,
            hora_inicio:          horaIni + ":00",
            hora_fin:             horaFin + ":00",
            fecha_inicio:         fechaIni,
            fecha_fin:            fechaFin,
            minutos_anticipacion: parseInt(document.getElementById("edit-h-anticipacion").value),
            minutos_tolerancia:   parseInt(document.getElementById("edit-h-tolerancia").value),
        };

        fetch(`http://127.0.0.1:5000/horarios/${idH}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Horario actualizado correctamente.");
                cerrarModal();
                cargarHorarios();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar el horario.");
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
            // BACKEND: GET /clases → con JOIN para tener materia_nombre, tipo_clase, docente_nombre
            fetch("http://127.0.0.1:5000/clases/activas")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoClases = d.clases || []; })
                .catch(() => {}),

            // BACKEND: GET /aulas → { success: true, aulas: [{ id_aula, codigo_aula, edificio }] }
            fetch("http://127.0.0.1:5000/aulas/activas")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoAulas = d.aulas || []; })
                .catch(() => {}),

            // BACKEND: GET /modalidades → { success: true, modalidades: [{ id_modalidad, nombre }] }
            fetch("http://127.0.0.1:5000/modalidades/activas")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoMods = d.modalidades || []; })
                .catch(() => {})
        ]);
    }

    function cargarHorarios() {
        // BACKEND: GET /horarios → { success: true, horarios: [...] }
        fetch("http://127.0.0.1:5000/horarios")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    horarios = data.horarios || [];
                    renderTabla(horarios);
                } else {
                    alert(data.error || data.mensaje || "No se pudieron cargar los horarios.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Error al cargar los horarios.");
            });
    }

    cargarCatalogos().then(cargarHorarios);
}