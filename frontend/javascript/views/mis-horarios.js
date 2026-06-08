// ============================================================
//  views/mis-horarios.js — Panel Estudiante: Ver mis horarios
// ============================================================

function renderViewMisHorarios(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idEstudiante = usuarioActivo.id;

    // ── Inyectar CSS si no existe ─────────────────────────────
    if (!document.getElementById("mh-style")) {
        const link  = document.createElement("link");
        link.id     = "mh-style";
        link.rel    = "stylesheet";
        link.href   = "../css/mis-horarios.css";
        document.head.appendChild(link);
    }

    // ── PANTALLA 1: tarjetas de materia ───────────────────────
    function renderTarjetas() {
        container.innerHTML = `
            <div class="dashboard-header">
                <h1>
                    <span class="material-symbols-rounded">calendar_month</span>
                    Mis Horarios
                </h1>
                <p>Selecciona una materia para ver sus horarios completos.</p>
            </div>

            <!-- Tarjeta de perfil del estudiante -->
            <div class="mh-perfil-card" id="mh-perfil">
                <div class="mh-perfil-avatar" id="mh-avatar">
                    ${(usuarioActivo.primer_nombre || "E").charAt(0).toUpperCase()}
                </div>
                <div class="mh-perfil-info">
                    <p class="mh-perfil-nombre" id="mh-nombre">
                        ${[usuarioActivo.primer_nombre, usuarioActivo.primer_apellido].filter(Boolean).join(" ") || "Estudiante"}
                    </p>
                    <p class="mh-perfil-carnet" id="mh-carnet">
                        Carnet: ${usuarioActivo.carnet || "—"}
                    </p>
                </div>
                <div class="mh-perfil-right" id="mh-carrera-ciclo">
                    <span class="mh-perfil-badge" id="mh-grupo-badge">—</span>
                </div>
            </div>

            <div id="mh-grid-wrap">
                <div class="mh-loading">
                    <span class="material-symbols-rounded mh-spin">sync</span>
                    Cargando tus materias...
                </div>
            </div>
        `;

        // BACKEND: GET /mis-horarios-completos?id_usuario=X
        // Devuelve TODOS los horarios del estudiante (todos los días, no solo hoy):
        // {
        //   success: true,
        //   estudiante: { primer_nombre, primer_apellido, carnet, grupo_nombre, carrera_nombre, ciclo_nombre },
        //   materias: [{
        //     id_clase, id_horario, tipo_clase, materia_nombre,
        //     docente_nombre, codigo_aula, edificio, nivel,
        //     modalidad_nombre, dia_semana, hora_inicio, hora_fin,
        //     minutos_anticipacion, minutos_tolerancia,
        //     fecha_inicio, fecha_fin
        //   }]
        // }
        //
        // QUERY SQL:
        //   SELECT
        //     h.id_horario, h.dia_semana, h.hora_inicio, h.hora_fin,
        //     h.minutos_anticipacion, h.minutos_tolerancia,
        //     h.fecha_inicio, h.fecha_fin,
        //     c.id_clase, c.tipo_clase,
        //     m.nombre                                          AS materia_nombre,
        //     CONCAT(u.primer_nombre,' ',u.primer_apellido)     AS docente_nombre,
        //     a.codigo_aula, a.edificio, a.nivel,
        //     mo.nombre                                         AS modalidad_nombre
        //   FROM horario h
        //   JOIN clase        c   ON c.id_clase      = h.id_clase
        //   JOIN materia      m   ON m.id_materia    = c.id_materia
        //   JOIN usuario      u   ON u.id_usuario    = c.id_docente
        //   JOIN aula         a   ON a.id_aula       = h.id_aula
        //   JOIN modalidad    mo  ON mo.id_modalidad = h.id_modalidad
        //   JOIN clase_grupo  cg  ON cg.id_clase     = c.id_clase AND cg.estado = 'ACTIVO'
        //   JOIN inscripcion  i   ON i.id_grupo      = cg.id_grupo
        //                       AND i.id_usuario    = :id_usuario
        //                       AND i.estado        = 'ACTIVA'
        //   WHERE h.estado = 'ACTIVO'
        //     AND h.fecha_inicio <= CURDATE()
        //     AND h.fecha_fin    >= CURDATE()
        //   ORDER BY FIELD(h.dia_semana,'LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'),
        //            h.hora_inicio

        fetch(`https://proyectoiid-production.up.railway.app/mis-horarios-completos?id_usuario=${idEstudiante}`)
            .then(r => r.json())
            .then(data => {
                const wrap = document.getElementById("mh-grid-wrap");

                // Actualizar perfil con datos del backend si vienen
                if (data.estudiante) {
                    const est = data.estudiante;
                    const nombreCompleto = [est.primer_nombre, est.primer_apellido].filter(Boolean).join(" ");
                    if (nombreCompleto) {
                        document.getElementById("mh-nombre").textContent = nombreCompleto;
                        document.getElementById("mh-avatar").textContent = nombreCompleto.charAt(0).toUpperCase();
                    }
                    if (est.carnet)      document.getElementById("mh-carnet").textContent = `Carnet: ${est.carnet}`;
                    if (est.grupo_nombre) document.getElementById("mh-grupo-badge").textContent =
                        `${est.grupo_nombre}${est.ciclo_nombre ? " · " + est.ciclo_nombre : ""}`;
                    if (est.carrera_nombre) {
                        const right = document.getElementById("mh-carrera-ciclo");
                        right.insertAdjacentHTML("beforeend",
                            `<p class="mh-perfil-carrera">${est.carrera_nombre}</p>`
                        );
                    }
                }

                if (!data.success || !data.materias || data.materias.length === 0) {
                    wrap.innerHTML = `
                        <div class="mh-empty">
                            <span class="material-symbols-rounded">event_busy</span>
                            No tienes horarios asignados actualmente.
                        </div>
                    `;
                    return;
                }

                // Agrupar horarios por id_clase (una tarjeta por materia)
                const porClase = {};
                data.materias.forEach(h => {
                    if (!porClase[h.id_clase]) porClase[h.id_clase] = { ...h, horarios: [] };
                    porClase[h.id_clase].horarios.push(h);
                });

                renderGrid(Object.values(porClase), wrap);
            })
            .catch(() => {
                document.getElementById("mh-grid-wrap").innerHTML = `
                    <div class="mh-empty">
                        <span class="material-symbols-rounded">wifi_off</span>
                        No se pudo conectar con el servidor.
                    </div>
                `;
            });
    }

    // ── GRID DE TARJETAS ──────────────────────────────────────
    function renderGrid(materias, wrap) {
        const diasOrden = ["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"];
        const diasLabel = { LUNES:"Lun",MARTES:"Mar",MIERCOLES:"Mié",JUEVES:"Jue",VIERNES:"Vie",SABADO:"Sáb",DOMINGO:"Dom" };

        function fmtHora(hms) {
            if (!hms) return "—";
            const [h, m] = hms.split(":").map(Number);
            return `${h % 12 || 12}:${m.toString().padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
        }

        wrap.innerHTML = `<div class="mh-grid" id="mh-grid"></div>`;
        const grid = document.getElementById("mh-grid");

        materias.forEach(mat => {
            // Ordenar horarios por día
            const horarios = [...mat.horarios].sort(
                (a, b) => diasOrden.indexOf(a.dia_semana) - diasOrden.indexOf(b.dia_semana)
            );

            const esPractica = mat.tipo_clase === "PRACTICA";

            const diasHTML = horarios.map(h => `
                <div class="mh-dia-chip">
                    <span class="mh-dia-nombre">${diasLabel[h.dia_semana] || h.dia_semana}</span>
                    <span class="mh-dia-hora">${fmtHora(h.hora_inicio)} – ${fmtHora(h.hora_fin)}</span>
                </div>
            `).join("");

            const card = document.createElement("div");
            card.className = "mh-card";
            card.innerHTML = `
                <div class="mh-card-top">
                    <div class="mh-card-icon ${esPractica ? "mh-icon-practica" : "mh-icon-teoria"}">
                        <span class="material-symbols-rounded">
                            ${esPractica ? "science" : "menu_book"}
                        </span>
                    </div>
                    <span class="mh-tipo-pill ${esPractica ? "mh-tipo-practica" : "mh-tipo-teoria"}">
                        ${esPractica ? "Práctica" : "Teoría"}
                    </span>
                </div>

                <p class="mh-card-materia">${mat.materia_nombre || `Clase #${mat.id_clase}`}</p>

                <div class="mh-card-meta">
                    <div class="mh-meta-row">
                        <span class="material-symbols-rounded">person</span>
                        <span>${mat.docente_nombre || "—"}</span>
                    </div>
                    <div class="mh-meta-row">
                        <span class="material-symbols-rounded">room</span>
                        <span>${mat.codigo_aula || "—"} · Edif. ${mat.edificio || "—"}</span>
                    </div>
                    <div class="mh-meta-row">
                        <span class="material-symbols-rounded">wifi</span>
                        <span>${mat.modalidad_nombre || "—"}</span>
                    </div>
                </div>

                <div class="mh-dias-wrap">${diasHTML}</div>

                <div class="mh-card-footer">
                    <span class="material-symbols-rounded">info</span>
                    Ver detalle completo
                </div>
            `;

            card.addEventListener("click", () => renderDetalle(mat, materias));
            grid.appendChild(card);
        });
    }

    // ── PANTALLA 2: detalle de una materia ────────────────────
    function renderDetalle(mat, todasLasMaterias) {
        const diasOrden = ["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"];
        const diasLabel = {
            LUNES:"Lunes", MARTES:"Martes", MIERCOLES:"Miércoles",
            JUEVES:"Jueves", VIERNES:"Viernes", SABADO:"Sábado", DOMINGO:"Domingo"
        };
        const diasColor = {
            LUNES:"#2563eb", MARTES:"#7c3aed", MIERCOLES:"#0891b2",
            JUEVES:"#059669", VIERNES:"#d97706", SABADO:"#dc2626", DOMINGO:"#6b7280"
        };

        function fmtHora(hms) {
            if (!hms) return "—";
            const [h, m] = hms.split(":").map(Number);
            return `${h % 12 || 12}:${m.toString().padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
        }

        function fmtFecha(d) {
            if (!d) return "—";
            return new Date(d + "T00:00:00").toLocaleDateString("es-SV", {
                day: "2-digit", month: "long", year: "numeric"
            });
        }

        const esPractica = mat.tipo_clase === "PRACTICA";
        const horarios   = [...mat.horarios].sort(
            (a, b) => diasOrden.indexOf(a.dia_semana) - diasOrden.indexOf(b.dia_semana)
        );

        const horariosHTML = horarios.map(h => {
            const color = diasColor[h.dia_semana] || "#6b7280";
            return `
                <div class="mh-horario-bloque" style="--mh-dia-color: ${color};">
                    <div class="mh-horario-dia">
                        <span class="mh-horario-dia-nombre">${diasLabel[h.dia_semana] || h.dia_semana}</span>
                    </div>
                    <div class="mh-horario-datos">
                        <div class="mh-horario-franja">
                            <span class="material-symbols-rounded">schedule</span>
                            <strong>${fmtHora(h.hora_inicio)}</strong>
                            <span class="mh-horario-sep">–</span>
                            <strong>${fmtHora(h.hora_fin)}</strong>
                        </div>
                        <div class="mh-horario-chips">
                            <span class="mh-chip">
                                <span class="material-symbols-rounded">timer</span>
                                Anticip. ${h.minutos_anticipacion ?? 10} min
                            </span>
                            <span class="mh-chip">
                                <span class="material-symbols-rounded">hourglass_top</span>
                                Tolerancia ${h.minutos_tolerancia ?? 10} min
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <button class="mh-back-btn" id="mh-back">
                <span class="material-symbols-rounded">arrow_back</span>
                Volver a mis materias
            </button>

            <!-- Cabecera de la materia -->
            <div class="mh-detalle-header ${esPractica ? "mh-header-practica" : "mh-header-teoria"}">
                <div class="mh-detalle-icono">
                    <span class="material-symbols-rounded">
                        ${esPractica ? "science" : "menu_book"}
                    </span>
                </div>
                <div class="mh-detalle-titulo">
                    <p class="mh-detalle-tipo">${esPractica ? "Práctica" : "Teoría"}</p>
                    <h2>${mat.materia_nombre || `Clase #${mat.id_clase}`}</h2>
                </div>
            </div>

            <!-- Info general -->
            <div class="mh-info-grid">
                <div class="mh-info-bloque">
                    <p class="mh-info-label">
                        <span class="material-symbols-rounded">person</span> Docente
                    </p>
                    <p class="mh-info-valor">${mat.docente_nombre || "—"}</p>
                </div>
                <div class="mh-info-bloque">
                    <p class="mh-info-label">
                        <span class="material-symbols-rounded">room</span> Aula
                    </p>
                    <p class="mh-info-valor">${mat.codigo_aula || "—"}
                        <span class="mh-info-sub">Edificio ${mat.edificio || "—"}, Nivel ${mat.nivel ?? "—"}</span>
                    </p>
                </div>
                <div class="mh-info-bloque">
                    <p class="mh-info-label">
                        <span class="material-symbols-rounded">wifi</span> Modalidad
                    </p>
                    <p class="mh-info-valor">${mat.modalidad_nombre || "—"}</p>
                </div>
                <div class="mh-info-bloque">
                    <p class="mh-info-label">
                        <span class="material-symbols-rounded">date_range</span> Vigencia
                    </p>
                    <p class="mh-info-valor" style="font-size:0.88rem;">
                        ${fmtFecha(mat.fecha_inicio)}
                        <span class="mh-info-sub">al ${fmtFecha(mat.fecha_fin)}</span>
                    </p>
                </div>
            </div>

            <!-- Horarios por día -->
            <p class="mh-seccion-label">
                <span class="material-symbols-rounded">calendar_today</span>
                Días y horas de clase
            </p>
            <div class="mh-horarios-lista">
                ${horariosHTML}
            </div>
        `;

        document.getElementById("mh-back").addEventListener("click", () => renderTarjetas());
    }

    // ── Iniciar ───────────────────────────────────────────────
    renderTarjetas();
}