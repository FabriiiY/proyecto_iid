// ============================================================
//  views/maestro-horarios.js — Mis Horarios Globales (Docente)
//
//  Solo lectura. Muestra únicamente los horarios ACTIVOS
//  de las clases asignadas al docente en sesión.
//
//  BACKEND requerido:
//    GET /horarios?id_docente=X&estado=ACTIVO
//      → { success, horarios: [{ id_horario, dia_semana, hora_inicio,
//                                hora_fin, fecha_inicio, fecha_fin,
//                                estado, id_clase, id_aula,
//                                id_modalidad }] }
//      Filtra: horario JOIN clase WHERE clase.id_docente = X
//                                  AND horario.estado = 'ACTIVO'
//    GET /horarios/clases-docente?id_docente=X
//      → { success, clases: [{ id_clase, materia_nombre, tipo_clase }] }
//    GET /aulas   → { success, aulas:    [{ id_aula, codigo_aula, edificio }] }
//    GET /modalidades → { success, modalidades: [{ id_modalidad, nombre }] }
// ============================================================


// ── VISTA: MIS HORARIOS GLOBALES (Docente) ────────────────────
function renderViewMaestroHorarios(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idDocente     = usuarioActivo.id_usuario;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">calendar_month</span> Mis Horarios Globales</h1>
            <p>Horarios activos asignados a tus clases.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="mh-search"
                    placeholder="Buscar por clase, aula, día o modalidad..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px; overflow-x:auto;">
                <table class="students-table" id="mh-table" style="display:none; min-width:860px;">
                    <thead>
                        <tr>
                            <th>Clase</th>
                            <th>Aula</th>
                            <th>Modalidad</th>
                            <th style="text-align:center;">Día</th>
                            <th style="text-align:center;">Horario</th>
                            <th style="text-align:center;">Vigencia</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="mh-tbody"></tbody>
                </table>
                <div id="mh-empty" class="empty-state">
                    <span class="material-symbols-rounded" style="font-size:2.5rem; color:#ccc;">
                        calendar_month
                    </span>
                    <p>No tienes horarios activos asignados.</p>
                </div>
            </div>
        </div>
    `;

    const tbody    = document.getElementById("mh-tbody");
    const table    = document.getElementById("mh-table");
    const emptyMsg = document.getElementById("mh-empty");
    const search   = document.getElementById("mh-search");

    let horarios       = [];
    let catalogoClases = [];
    let catalogoAulas  = [];
    let catalogoMods   = [];

    const diasLabel = {
        LUNES: "Lun", MARTES: "Mar", MIERCOLES: "Mié",
        JUEVES: "Jue", VIERNES: "Vie", SABADO: "Sáb", DOMINGO: "Dom"
    };

    // ── Helpers de catálogo ───────────────────────────────────
    function etiquetaClase(id) {
        const c = catalogoClases.find(x => x.id_clase === id);
        if (!c) return `Clase #${id}`;
        return (c.materia_nombre)
            ? `${c.materia_nombre} — ${c.tipo_clase === "TEORIA" ? "Teoría" : "Práctica"}`
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

    // ── Formatear hora HH:MM ──────────────────────────────────
    function fmtHora(t) {
        if (!t) return "—";
        return t.slice(0, 5);
    }

    // ── Formatear fecha DD/MM/YYYY ────────────────────────────
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

    // ── Badge estado ──────────────────────────────────────────
    function badgeEstado(estado) {
        const activo = estado === "ACTIVO";
        return `<span style="
            display:inline-flex; align-items:center; gap:4px;
            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
            background:${activo ? "#e6f9f0" : "#fdecea"};
            color:${activo ? "#1a8a4a" : "#c0392b"};">
            <span class="material-symbols-rounded" style="font-size:0.85rem;">
                ${activo ? "check_circle" : "cancel"}
            </span>
            ${activo ? "Activo" : "Inactivo"}
        </span>`;
    }

    // ── Renderizar tabla ──────────────────────────────────────
    function renderTabla(lista) {
        tbody.innerHTML = "";

        if (!lista.length) {
            emptyMsg.style.display = "flex";
            table.style.display    = "none";
            return;
        }
        emptyMsg.style.display = "none";
        table.style.display    = "table";

        lista.forEach(h => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${etiquetaClase(h.id_clase)}</td>
                <td>${etiquetaAula(h.id_aula)}</td>
                <td style="font-size:0.88rem;">${nombreMod(h.id_modalidad)}</td>
                <td style="text-align:center; font-size:0.88rem;">
                    ${diasLabel[h.dia_semana] || h.dia_semana}
                </td>
                <td style="text-align:center; font-size:0.88rem; white-space:nowrap;">
                    ${fmtHora(h.hora_inicio)} – ${fmtHora(h.hora_fin)}
                </td>
                <td style="text-align:center; font-size:0.82rem; white-space:nowrap;">
                    ${fmtFecha(h.fecha_inicio)} – ${fmtFecha(h.fecha_fin)}
                </td>
                <td style="text-align:center;">${badgeEstado(h.estado)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        if (!q) return [...horarios];
        return horarios.filter(h =>
            etiquetaClase(h.id_clase).toLowerCase().includes(q)  ||
            etiquetaAula(h.id_aula).toLowerCase().includes(q)    ||
            nombreMod(h.id_modalidad).toLowerCase().includes(q)  ||
            (diasLabel[h.dia_semana] || h.dia_semana).toLowerCase().includes(q)
        );
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Carga inicial ─────────────────────────────────────────
    function cargarCatalogos() {
        return Promise.all([
            // Clases del docente (para resolver etiqueta)
            // BACKEND: GET /mis-clases?id_docente=X
            //   → { success, clases: [{ id_clase, materia_nombre, tipo_clase }] }
            fetch(`http://127.0.0.1:5000/mis-clases?id_docente=${idDocente}`)
                .then(r => r.json())
                .then(d => { if (d.success) catalogoClases = d.clases || []; })
                .catch(() => {}),

            // Aulas (catálogo general para resolver nombres)
            // BACKEND: GET /aulas → { success, aulas: [{ id_aula, codigo_aula, edificio }] }
            fetch("http://127.0.0.1:5000/aulas")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoAulas = d.aulas || []; })
                .catch(() => {}),

            // Modalidades (catálogo general)
            // BACKEND: GET /modalidades → { success, modalidades: [{ id_modalidad, nombre }] }
            fetch("http://127.0.0.1:5000/modalidades")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoMods = d.modalidades || []; })
                .catch(() => {})
        ]);
    }

    function cargarHorarios() {
        // Solo horarios ACTIVOS de las clases del docente
        // BACKEND: GET /horarios?id_docente=X&estado=ACTIVO
        //   → { success, horarios: [...] }
        fetch(`http://127.0.0.1:5000/horarios?id_docente=${idDocente}&estado=ACTIVO`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    // Filtro en cliente como segunda capa de seguridad
                    horarios = (data.horarios || []).filter(h => h.estado === "ACTIVO");
                    renderTabla(horarios);
                } else {
                    emptyMsg.querySelector("p").textContent =
                        data.error || data.mensaje || "No se pudieron cargar los horarios.";
                    emptyMsg.style.display = "flex";
                }
            })
            .catch(err => {
                console.error(err);
                emptyMsg.querySelector("p").textContent = "Error al conectar con el servidor.";
                emptyMsg.style.display = "flex";
            });
    }

    cargarCatalogos().then(cargarHorarios);
}