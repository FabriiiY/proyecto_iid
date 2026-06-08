// ============================================================
//  views/reporte-asistencia.js — Reporte de Asistencia (Estudiante)
// ============================================================

function renderViewReporteAsistencia(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idEstudiante = usuarioActivo.id;

    // ── Inyectar CSS si no existe ─────────────────────────────
    if (!document.getElementById("rpt-style")) {
        const st  = document.createElement("style");
        st.id     = "rpt-style";
        st.textContent = `
            .rpt-filtros-card {
                background: #fff;
                border: 1.5px solid #e8edf5;
                border-radius: 16px;
                padding: 22px 24px;
                margin-bottom: 24px;
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                align-items: flex-end;
            }
            .rpt-filtro-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
                flex: 1;
                min-width: 160px;
            }
            .rpt-filtro-group label {
                font-size: 0.78rem;
                font-weight: 700;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .rpt-filtro-group select,
            .rpt-filtro-group input[type="date"] {
                border: 1.5px solid #e8edf5;
                border-radius: 10px;
                padding: 9px 13px;
                font-size: 0.88rem;
                font-family: inherit;
                color: #1a1a2e;
                background: #f8f9fb;
                outline: none;
                transition: border-color .15s;
                cursor: pointer;
            }
            .rpt-filtro-group select:focus,
            .rpt-filtro-group input[type="date"]:focus {
                border-color: var(--azul-sami, #2563eb);
                background: #fff;
            }
            .rpt-btn-generar {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 10px 22px;
                border-radius: 10px;
                border: none;
                background: var(--azul-sami, #2563eb);
                color: #fff;
                font-size: 0.9rem;
                font-weight: 700;
                font-family: inherit;
                cursor: pointer;
                transition: opacity .15s;
                white-space: nowrap;
                align-self: flex-end;
            }
            .rpt-btn-generar:hover   { opacity: .87; }
            .rpt-btn-generar:disabled{ opacity: .5; cursor: not-allowed; }

            /* ── Resumen stats ── */
            .rpt-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 12px;
                margin-bottom: 22px;
            }
            .rpt-stat {
                background: #fff;
                border: 1.5px solid #e8edf5;
                border-radius: 14px;
                padding: 16px 18px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .rpt-stat-icon {
                width: 36px; height: 36px;
                border-radius: 9px;
                display: flex; align-items: center; justify-content: center;
            }
            .rpt-stat-icon .material-symbols-rounded { font-size: 1.1rem; }
            .rpt-stat-num {
                font-size: 1.6rem;
                font-weight: 700;
                color: #1a1a2e;
                line-height: 1;
            }
            .rpt-stat-label {
                font-size: 0.75rem;
                color: #888;
                font-weight: 500;
            }

            /* ── Tabla de asistencias ── */
            .rpt-tabla-wrap {
                background: #fff;
                border: 1.5px solid #e8edf5;
                border-radius: 16px;
                overflow: hidden;
            }
            .rpt-tabla-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                border-bottom: 1.5px solid #e8edf5;
                flex-wrap: wrap;
                gap: 12px;
            }
            .rpt-tabla-header h3 {
                font-size: 0.95rem;
                font-weight: 700;
                color: #1a1a2e;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .rpt-btn-pdf {
                display: inline-flex;
                align-items: center;
                gap: 7px;
                padding: 9px 18px;
                border-radius: 10px;
                border: 1.5px solid #e8edf5;
                background: #f8f9fb;
                color: #c0392b;
                font-size: 0.85rem;
                font-weight: 700;
                font-family: inherit;
                cursor: pointer;
                transition: background .15s, border-color .15s;
            }
            .rpt-btn-pdf:hover { background: #fdecea; border-color: #e8b4b0; }
            .rpt-btn-pdf:disabled { opacity: .5; cursor: not-allowed; }

            .rpt-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.85rem;
            }
            .rpt-table thead th {
                padding: 11px 16px;
                text-align: left;
                font-size: 0.73rem;
                font-weight: 700;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                background: #f8f9fb;
                border-bottom: 1.5px solid #e8edf5;
            }
            .rpt-table tbody tr {
                border-bottom: 1px solid #f0f2f8;
                transition: background .12s;
            }
            .rpt-table tbody tr:last-child { border-bottom: none; }
            .rpt-table tbody tr:hover { background: #f8f9fb; }
            .rpt-table td {
                padding: 11px 16px;
                color: #1a1a2e;
                vertical-align: middle;
            }

            .rpt-badge {
                display: inline-flex; align-items: center; gap: 4px;
                padding: 3px 10px; border-radius: 20px;
                font-size: 0.75rem; font-weight: 700;
            }

            .rpt-empty {
                text-align: center;
                padding: 50px 20px;
                color: #bbb;
                font-size: 0.9rem;
            }
            .rpt-empty .material-symbols-rounded {
                font-size: 2.8rem; display: block; margin-bottom: 10px;
            }

            .rpt-periodo-label {
                font-size: 0.82rem; color: #888;
            }
        `;
        document.head.appendChild(st);
    }

    // ── Calcular rango por defecto: mes actual ────────────────
    const hoy      = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().slice(0, 10);

    // ── HTML principal ────────────────────────────────────────
    container.innerHTML = `
        <div class="dashboard-header">
            <h1>
                <span class="material-symbols-rounded">summarize</span>
                Reporte de Asistencia
            </h1>
            <p>Consulta y descarga el historial de tu asistencia por período.</p>
        </div>

        <!-- Filtros -->
        <div class="rpt-filtros-card">
            <div class="rpt-filtro-group">
                <label>Desde</label>
                <input type="date" id="rpt-fecha-ini" value="${primerDia}" />
            </div>
            <div class="rpt-filtro-group">
                <label>Hasta</label>
                <input type="date" id="rpt-fecha-fin" value="${ultimoDia}" />
            </div>
            <div class="rpt-filtro-group">
                <!-- BACKEND: GET /mis-clases?id_docente=X ya existe — reutilizar para estudiante -->
                <!-- O bien: el select se llena con las materias que vienen en el reporte -->
                <label>Materia</label>
                <select id="rpt-materia">
                    <option value="">Todas las materias</option>
                </select>
            </div>
            <button class="rpt-btn-generar" id="rpt-btn-generar">
                <span class="material-symbols-rounded">search</span>
                Consultar
            </button>
        </div>

        <!-- Stats -->
        <div class="rpt-stats-grid" id="rpt-stats" style="display:none;"></div>

        <!-- Tabla -->
        <div class="rpt-tabla-wrap" id="rpt-tabla-wrap" style="display:none;">
            <div class="rpt-tabla-header">
                <h3>
                    <span class="material-symbols-rounded">table_rows</span>
                    Registros de asistencia
                    <span class="rpt-periodo-label" id="rpt-periodo-label"></span>
                </h3>
                <button class="rpt-btn-pdf" id="rpt-btn-pdf" disabled>
                    <span class="material-symbols-rounded">picture_as_pdf</span>
                    Descargar PDF
                </button>
            </div>
            <div style="overflow-x:auto;">
                <table class="rpt-table" id="rpt-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Materia</th>
                            <th>Tipo</th>
                            <th>Hora registro</th>
                            <th>Horario</th>
                            <th>Estado</th>
                            <th>Observación</th>
                        </tr>
                    </thead>
                    <tbody id="rpt-tbody"></tbody>
                </table>
            </div>
        </div>

        <div id="rpt-loading" style="display:none; text-align:center; padding:40px; color:#aaa;">
            <span class="material-symbols-rounded"
                style="font-size:2rem; display:block; margin-bottom:8px; animation:mh-spin 1s linear infinite;">
                sync
            </span>
            Cargando asistencias...
        </div>
    `;

    // ── Referencias DOM ───────────────────────────────────────
    const btnGenerar  = document.getElementById("rpt-btn-generar");
    const btnPDF      = document.getElementById("rpt-btn-pdf");
    const statsWrap   = document.getElementById("rpt-stats");
    const tablaWrap   = document.getElementById("rpt-tabla-wrap");
    const tbody       = document.getElementById("rpt-tbody");
    const loading     = document.getElementById("rpt-loading");
    const selectMat   = document.getElementById("rpt-materia");
    const periodoLabel= document.getElementById("rpt-periodo-label");

    let datosActuales = []; // asistencias cargadas
    let infoEstudiante = {};

    // ── Config de estados ─────────────────────────────────────
    const estadoCfg = {
        PRESENTE:    { label: "Presente",    color: "#1a8a4a", bg: "#e6f9f0", icon: "check_circle"   },
        TARDE:       { label: "Tarde",       color: "#d4780a", bg: "#fef5e7", icon: "schedule"        },
        AUSENTE:     { label: "Ausente",     color: "#c0392b", bg: "#fdecea", icon: "cancel"          },
        JUSTIFICADA: { label: "Justificada", color: "#8e44ad", bg: "#f5eef8", icon: "verified"        }
    };

    function badgeHTML(estado) {
        const cfg = estadoCfg[estado] || estadoCfg.AUSENTE;
        return `<span class="rpt-badge" style="background:${cfg.bg}; color:${cfg.color};">
            <span class="material-symbols-rounded" style="font-size:0.8rem;">${cfg.icon}</span>
            ${cfg.label}
        </span>`;
    }

    function fmtFecha(d) {
        if (!d) return "—";
        return new Date(d + "T00:00:00").toLocaleDateString("es-SV", {
            day: "2-digit", month: "short", year: "numeric"
        });
    }

    function fmtHora(t) {
        if (!t) return "—";
        const [h, m] = t.split(":").map(Number);
        return `${h % 12 || 12}:${m.toString().padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
    }

    // ── Calcular stats ────────────────────────────────────────
    function calcularStats(lista) {
        const total      = lista.length;
        const presentes  = lista.filter(r => r.estado === "PRESENTE").length;
        const tardes     = lista.filter(r => r.estado === "TARDE").length;
        const ausentes   = lista.filter(r => r.estado === "AUSENTE").length;
        const justif     = lista.filter(r => r.estado === "JUSTIFICADA").length;
        const pct        = total ? Math.round((presentes + tardes + justif) / total * 100) : 0;
        return { total, presentes, tardes, ausentes, justif, pct };
    }

    function renderStats(stats) {
        statsWrap.style.display = "grid";
        statsWrap.innerHTML = `
            <div class="rpt-stat">
                <div class="rpt-stat-icon" style="background:#eef1f9;">
                    <span class="material-symbols-rounded" style="color:var(--azul-sami,#2563eb);">event_note</span>
                </div>
                <div class="rpt-stat-num">${stats.total}</div>
                <div class="rpt-stat-label">Clases totales</div>
            </div>
            <div class="rpt-stat">
                <div class="rpt-stat-icon" style="background:#e6f9f0;">
                    <span class="material-symbols-rounded" style="color:#1a8a4a;">check_circle</span>
                </div>
                <div class="rpt-stat-num">${stats.presentes}</div>
                <div class="rpt-stat-label">Presentes</div>
            </div>
            <div class="rpt-stat">
                <div class="rpt-stat-icon" style="background:#fef5e7;">
                    <span class="material-symbols-rounded" style="color:#d4780a;">schedule</span>
                </div>
                <div class="rpt-stat-num">${stats.tardes}</div>
                <div class="rpt-stat-label">Tardanzas</div>
            </div>
            <div class="rpt-stat">
                <div class="rpt-stat-icon" style="background:#fdecea;">
                    <span class="material-symbols-rounded" style="color:#c0392b;">cancel</span>
                </div>
                <div class="rpt-stat-num">${stats.ausentes}</div>
                <div class="rpt-stat-label">Ausencias</div>
            </div>
            <div class="rpt-stat">
                <div class="rpt-stat-icon" style="background:#f5eef8;">
                    <span class="material-symbols-rounded" style="color:#8e44ad;">verified</span>
                </div>
                <div class="rpt-stat-num">${stats.justif}</div>
                <div class="rpt-stat-label">Justificadas</div>
            </div>
            <div class="rpt-stat" style="border-color:${stats.pct >= 80 ? "#a3e4c2" : "#f5d08a"};">
                <div class="rpt-stat-icon" style="background:${stats.pct >= 80 ? "#e6f9f0" : "#fef5e7"};">
                    <span class="material-symbols-rounded"
                        style="color:${stats.pct >= 80 ? "#1a8a4a" : "#d4780a"};">
                        percent
                    </span>
                </div>
                <div class="rpt-stat-num" style="color:${stats.pct >= 80 ? "#1a8a4a" : "#d4780a"};">
                    ${stats.pct}%
                </div>
                <div class="rpt-stat-label">Asistencia</div>
            </div>
        `;
    }

    // ── Renderizar tabla ──────────────────────────────────────
    function renderTabla(lista) {
        tbody.innerHTML = "";

        if (lista.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="7">
                    <div class="rpt-empty">
                        <span class="material-symbols-rounded">search_off</span>
                        No hay registros para el período seleccionado.
                    </div>
                </td></tr>
            `;
            btnPDF.disabled = true;
            return;
        }

        lista.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="white-space:nowrap; font-weight:600;">${fmtFecha(r.fecha)}</td>
                <td style="max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${r.materia_nombre || "—"}
                </td>
                <td>
                    <span style="font-size:0.78rem; color:#666;">
                        ${r.tipo_clase === "PRACTICA" ? "Práctica" : "Teoría"}
                    </span>
                </td>
                <td style="white-space:nowrap;">${fmtHora(r.hora)}</td>
                <td style="white-space:nowrap; font-size:0.82rem; color:#666;">
                    ${fmtHora(r.hora_inicio)} – ${fmtHora(r.hora_fin)}
                </td>
                <td>${badgeHTML(r.estado)}</td>
                <td style="max-width:160px; white-space:nowrap; overflow:hidden;
                    text-overflow:ellipsis; font-size:0.82rem; color:#777;">
                    ${r.observacion || "<span style='color:#bbb;'>—</span>"}
                </td>
            `;
            tbody.appendChild(tr);
        });

        btnPDF.disabled = false;
    }

    // ── Llenar select de materias ─────────────────────────────
    function poblarSelectMaterias(lista) {
        const unicas = [...new Map(lista.map(r => [r.id_clase, r])).values()];
        selectMat.innerHTML = `<option value="">Todas las materias</option>`;
        unicas.forEach(r => {
            const opt = document.createElement("option");
            opt.value       = r.id_clase;
            opt.textContent = r.materia_nombre || `Clase #${r.id_clase}`;
            selectMat.appendChild(opt);
        });
    }

    // ── Filtrar por materia ───────────────────────────────────
    function filtrarYRenderizar() {
        const idClase = selectMat.value;
        const filtrada = idClase
            ? datosActuales.filter(r => String(r.id_clase) === String(idClase))
            : [...datosActuales];
        renderStats(calcularStats(filtrada));
        renderTabla(filtrada);
    }

    selectMat.addEventListener("change", filtrarYRenderizar);

    // ── Fetch principal ───────────────────────────────────────
    function consultar() {
        const fechaIni = document.getElementById("rpt-fecha-ini").value;
        const fechaFin = document.getElementById("rpt-fecha-fin").value;

        if (!fechaIni || !fechaFin || fechaFin < fechaIni) {
            alert("Por favor selecciona un rango de fechas válido.");
            return;
        }

        btnGenerar.disabled = true;
        tablaWrap.style.display = "none";
        statsWrap.style.display = "none";
        loading.style.display   = "block";

        // BACKEND: GET /reporte-asistencia?id_usuario=X&fecha_ini=Y&fecha_fin=Z
        // {
        //   success: true,
        //   estudiante: { nombre_completo, carnet, grupo_nombre, carrera_nombre },
        //   asistencias: [{
        //     id_asistencia, fecha, hora, estado, observacion,
        //     id_clase, tipo_clase, materia_nombre,
        //     hora_inicio, hora_fin        ← del horario
        //   }]
        // }
        //
        // QUERY SQL:
        //   SELECT
        //     a.id_asistencia, a.fecha, a.hora, a.estado, a.observacion,
        //     c.id_clase, c.tipo_clase,
        //     m.nombre      AS materia_nombre,
        //     h.hora_inicio, h.hora_fin
        //   FROM asistencia a
        //   JOIN clase    c ON c.id_clase   = a.id_clase
        //   JOIN materia  m ON m.id_materia = c.id_materia
        //   JOIN horario  h ON h.id_horario = a.id_horario
        //   WHERE a.id_usuario = :id_usuario
        //     AND a.fecha BETWEEN :fecha_ini AND :fecha_fin
        //   ORDER BY a.fecha DESC, h.hora_inicio

        fetch(`https://proyectoiid-production.up.railway.app/reporte-asistencia?id_usuario=${idEstudiante}&fecha_ini=${fechaIni}&fecha_fin=${fechaFin}`)
            .then(r => r.json())
            .then(data => {
                loading.style.display = "none";
                btnGenerar.disabled   = false;

                if (!data.success) {
                    alert(data.error || "No se pudo cargar el reporte.");
                    return;
                }

                infoEstudiante = data.estudiante || {};
                datosActuales  = data.asistencias || [];

                poblarSelectMaterias(datosActuales);
                selectMat.value = "";

                // Etiqueta de período
                periodoLabel.textContent =
                    `— ${fmtFecha(fechaIni)} al ${fmtFecha(fechaFin)}`;

                tablaWrap.style.display = "block";
                filtrarYRenderizar();
            })
            .catch(() => {
                loading.style.display = "none";
                btnGenerar.disabled   = false;
                alert("Error al conectar con el servidor.");
            });
    }

    btnGenerar.addEventListener("click", consultar);
    // Consultar automáticamente al abrir la vista con el mes actual
    consultar();

    // ── GENERACIÓN DEL PDF ────────────────────────────────────
    btnPDF.addEventListener("click", () => {
        // Cargar jsPDF + autoTable desde CDN si no están disponibles
        function cargarScript(src, cb) {
            if (document.querySelector(`script[src="${src}"]`)) { cb(); return; }
            const s = document.createElement("script");
            s.src   = src;
            s.onload= cb;
            document.head.appendChild(s);
        }

        btnPDF.disabled = true;
        btnPDF.innerHTML = `<span class="material-symbols-rounded">hourglass_top</span> Generando...`;

        cargarScript(
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
            () => cargarScript(
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js",
                () => generarPDF()
            )
        );
    });

    function generarPDF() {
        const { jsPDF } = window.jspdf;
        const doc       = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });

        const fechaIni  = document.getElementById("rpt-fecha-ini").value;
        const fechaFin  = document.getElementById("rpt-fecha-fin").value;
        const idClase   = selectMat.value;
        const lista     = idClase
            ? datosActuales.filter(r => String(r.id_clase) === String(idClase))
            : [...datosActuales];

        const nombreEst = infoEstudiante.nombre_completo ||
            [usuarioActivo.primer_nombre, usuarioActivo.primer_apellido].filter(Boolean).join(" ") ||
            "Estudiante";
        const carnet    = infoEstudiante.carnet || usuarioActivo.carnet || "—";
        const grupo     = infoEstudiante.grupo_nombre || "—";
        const carrera   = infoEstudiante.carrera_nombre || "—";

        const pageW = doc.internal.pageSize.getWidth();
        let   y     = 14;

        // ── Encabezado ──────────────────────────────────────
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text("SAMI — Sistema de Asistencia y Marcación Institucional", 14, y);
        y += 7;

        doc.setFontSize(16);
        doc.setTextColor(30);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de Asistencia", 14, y);
        y += 2;

        // Línea divisoria
        doc.setDrawColor(220);
        doc.setLineWidth(0.4);
        doc.line(14, y + 3, pageW - 14, y + 3);
        y += 9;

        // Meta info: 3 columnas
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.setFont("helvetica", "normal");
        doc.text("Período considerado", 14, y);
        doc.text("Generado el", pageW / 2 - 20, y);
        doc.text("Generado por", pageW - 80, y);
        y += 5;

        doc.setFontSize(9);
        doc.setTextColor(30);
        doc.setFont("helvetica", "bold");
        doc.text(`${fmtFecha(fechaIni)} — ${fmtFecha(fechaFin)}`, 14, y);
        doc.text(new Date().toLocaleString("es-SV"), pageW / 2 - 20, y);
        doc.text(nombreEst, pageW - 80, y);
        y += 10;

        // ── Datos del estudiante ─────────────────────────────
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(14, y, pageW - 28, 20, 3, 3, "F");
        y += 5;

        doc.setFontSize(11);
        doc.setTextColor(26);
        doc.setFont("helvetica", "bold");
        doc.text(nombreEst, 20, y);
        y += 5;

        doc.setFontSize(8.5);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text(`Carnet: ${carnet}   ·   Grupo: ${grupo}   ·   Carrera: ${carrera}`, 20, y);
        y += 12;

        // ── Resumen de stats ─────────────────────────────────
        const stats    = calcularStats(lista);
        const statData = [
            ["Total clases", stats.total],
            ["Presentes",    stats.presentes],
            ["Tardanzas",    stats.tardes],
            ["Ausencias",    stats.ausentes],
            ["Justificadas", stats.justif],
            ["% Asistencia", `${stats.pct}%`]
        ];

        const statW     = (pageW - 28) / statData.length;
        doc.setFontSize(8);
        statData.forEach(([label, val], i) => {
            const x = 14 + i * statW;
            doc.setTextColor(140);
            doc.setFont("helvetica", "normal");
            doc.text(label, x + statW / 2, y, { align: "center" });
            doc.setFontSize(13);
            doc.setTextColor(30);
            doc.setFont("helvetica", "bold");
            doc.text(String(val), x + statW / 2, y + 6, { align: "center" });
            doc.setFontSize(8);
        });
        y += 14;

        // Línea antes de la tabla
        doc.setDrawColor(220);
        doc.line(14, y, pageW - 14, y);
        y += 4;

        // ── Tabla principal ──────────────────────────────────
        const estadoLabel = { PRESENTE: "Presente", TARDE: "Tarde", AUSENTE: "Ausente", JUSTIFICADA: "Justificada" };
        const estadoColor = {
            PRESENTE:    [26, 138, 74],
            TARDE:       [212, 120, 10],
            AUSENTE:     [192, 57, 43],
            JUSTIFICADA: [142, 68, 173]
        };

        const filas = lista.map(r => [
            fmtFecha(r.fecha),
            r.materia_nombre || "—",
            r.tipo_clase === "PRACTICA" ? "Práctica" : "Teoría",
            fmtHora(r.hora),
            `${fmtHora(r.hora_inicio)} – ${fmtHora(r.hora_fin)}`,
            estadoLabel[r.estado] || r.estado,
            r.observacion || "—"
        ]);

        doc.autoTable({
            startY: y,
            head: [["Fecha", "Materia", "Tipo", "Hora registro", "Horario clase", "Estado", "Observación"]],
            body: filas,
            styles: {
                fontSize: 8.5,
                cellPadding: 3.5,
                overflow: "ellipsize",
                textColor: [30, 30, 30]
            },
            headStyles: {
                fillColor: [245, 247, 250],
                textColor: [100, 100, 110],
                fontStyle: "bold",
                fontSize: 7.5,
                lineColor: [220, 220, 220],
                lineWidth: 0.3
            },
            columnStyles: {
                0: { cellWidth: 24 },  // fecha
                1: { cellWidth: 52 },  // materia
                2: { cellWidth: 18 },  // tipo
                3: { cellWidth: 24 },  // hora registro
                4: { cellWidth: 34 },  // horario clase
                5: { cellWidth: 24 },  // estado
                6: { cellWidth: "auto" }
            },
            alternateRowStyles: { fillColor: [249, 250, 252] },
            didParseCell(data) {
                // Colorear columna Estado
                if (data.section === "body" && data.column.index === 5) {
                    const estado = lista[data.row.index]?.estado;
                    const color  = estadoColor[estado];
                    if (color) data.cell.styles.textColor = color;
                }
            },
            didDrawPage(data) {
                // Número de página en el pie
                const pgStr = `Página ${data.pageNumber}`;
                doc.setFontSize(8);
                doc.setTextColor(160);
                doc.setFont("helvetica", "normal");
                doc.text(pgStr, pageW / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" });
            }
        });

        // ── Nombre del archivo ───────────────────────────────
        const nombreArchivo = `reporte-asistencia-${carnet}-${fechaIni}-${fechaFin}.pdf`;
        doc.save(nombreArchivo);

        // Restaurar botón
        btnPDF.disabled = false;
        btnPDF.innerHTML = `<span class="material-symbols-rounded">picture_as_pdf</span> Descargar PDF`;
    }
}