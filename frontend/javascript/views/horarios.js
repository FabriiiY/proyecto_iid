// ============================================================
//  views/horarios.js — Vista Estudiante: Carrusel de clases
// ============================================================
function renderViewHorarios(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idEstudiante  = usuarioActivo.id; //se cambia esto const idEstudiante  = usuarioActivo.id_usuario;

    // ── Intervalo global — se limpia al salir de la vista ─────
    let _tickInterval = null;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">schedule</span> Clases del Día</h1>
            <p>Desliza para ver tus clases y marca tu asistencia al entrar al aula.</p>
        </div>

        <div class="carousel-wrapper">
            <button class="nav-btn prev" id="btn-prev">
                <span class="material-symbols-rounded">chevron_left</span>
            </button>
            <div class="carousel-track-container">
                <div class="carousel-track" id="carousel-track"></div>
            </div>
            <button class="nav-btn next" id="btn-next">
                <span class="material-symbols-rounded">chevron_right</span>
            </button>
        </div>
        <div class="carousel-indicators" id="carousel-indicators"></div>

        <!-- MODAL JUSTIFICACIÓN -->
        <div id="justif-overlay" style="
            display:none; position:fixed; inset:0;
            background:rgba(0,0,0,.45); z-index:9999;
            align-items:center; justify-content:center;
        ">
            <div style="
                background:#fff; border-radius:16px;
                padding:28px 26px; max-width:420px; width:90%;
                box-shadow:0 16px 48px rgba(0,0,0,.18);
            ">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
                    <span class="material-symbols-rounded" style="color:#8e44ad;font-size:1.6rem;">verified</span>
                    <h3 style="margin:0;font-size:1.05rem;">Solicitar Justificación</h3>
                </div>
                <p style="font-size:0.85rem;color:#666;margin:0 0 14px;" id="justif-clase-label">—</p>
                <textarea id="justif-obs" rows="4" placeholder="Describe el motivo de tu inasistencia o tardanza..." style="
                    width:100%; box-sizing:border-box;
                    border:1.5px solid #e8edf5; border-radius:10px;
                    padding:10px 12px; font-size:0.88rem; font-family:inherit;
                    resize:none; outline:none; color:#1a1a2e; background:#f8f9fb;
                    transition:border-color .15s;
                "></textarea>
                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
                    <button id="justif-cancelar" style="
                        padding:10px 20px; border-radius:8px;
                        border:1.5px solid #e8edf5; background:#f8f9fb;
                        cursor:pointer; font-size:0.88rem; font-weight:600; color:#666;
                    ">Cancelar</button>
                    <button id="justif-enviar" style="
                        padding:10px 22px; border-radius:8px;
                        border:none; background:#8e44ad; color:#fff;
                        cursor:pointer; font-size:0.88rem; font-weight:600;
                        display:flex;align-items:center;gap:6px;
                    ">
                        <span class="material-symbols-rounded" style="font-size:1rem;">send</span>
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    `;

    const track      = document.getElementById("carousel-track");
    const indicators = document.getElementById("carousel-indicators");

    // ── ESTADO VACÍO ──────────────────────────────────────────
    function mostrarVacio(mensaje) {
        track.innerHTML = `
            <div style="
                min-width:300px; max-width:420px; margin:0 auto;
                text-align:center; padding:60px 20px; color:#aaa;
            ">
                <span class="material-symbols-rounded" style="font-size:3.5rem;display:block;margin-bottom:12px;">
                    event_busy
                </span>
                <p style="font-size:0.95rem;">${mensaje}</p>
            </div>
        `;
        document.getElementById("btn-prev").style.display = "none";
        document.getElementById("btn-next").style.display = "none";
    }

    // ── HELPERS DE TIEMPO ─────────────────────────────────────

    // Convierte "HH:MM:SS" a minutos desde medianoche
    function hmsAMinutos(hms) {
        const [h, m] = hms.split(":").map(Number);
        return h * 60 + m;
    }

    // Hora local en minutos desde medianoche
    function ahoraMinutos() {
        const n = new Date();
        return n.getHours() * 60 + n.getMinutes();
    }

    // Formatea "HH:MM:SS" → "HH:MM AM/PM"
    function fmtHora(hms) {
        const [h, m] = hms.split(":").map(Number);
        const ampm   = h >= 12 ? "PM" : "AM";
        const h12    = h % 12 || 12;
        return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
    }

    // ── CALCULAR ESTADO DE VENTANA ────────────────────────────
    // Devuelve: 'anticipado' | 'presente' | 'tarde' | 'cerrado' | 'futuro'
    function calcularVentana(horario) {
        const ahora     = ahoraMinutos();
        const inicio    = hmsAMinutos(horario.hora_inicio);
        const fin       = hmsAMinutos(horario.hora_fin);
        const anticip   = horario.minutos_anticipacion ?? 10;
        const toleran   = horario.minutos_tolerancia   ?? 10;

        const abreEn    = inicio - anticip;   // cuando se habilita el botón
        const tardaHasta= inicio + toleran;   // hasta cuándo es "tarde"

        if (ahora < abreEn)      return "futuro";      // aún no llega la ventana
        if (ahora < inicio)      return "anticipado";  // ventana abierta, aún no empieza
        if (ahora <= tardaHasta) return "tarde";       // dentro de tolerancia → tarde
        if (ahora <= fin)        return "tarde_cerrado";// pasó tolerancia pero clase activa
        return "cerrado";                               // clase terminó
    }

    // ── ESTADO DEL BOTÓN según ventana y si ya marcó ─────────
    function calcularBoton(ventana, yaMarco, estadoMarcado) {
        if (yaMarco) {
            return { estado: "marcado", estadoMarcado };
        }
        switch (ventana) {
            case "futuro":
                return { estado: "futuro" };
            case "anticipado":
                return { estado: "presente" };   // botón verde
            case "tarde":
                return { estado: "tarde_activo" }; // botón naranja
            case "tarde_cerrado":
                return { estado: "tarde_activo" }; // sigue siendo tarde (no marcó en tiempo)
            case "cerrado":
                return { estado: "ausente" };      // no marcó, clase terminó
        }
    }

    // ── RENDERIZAR BOTÓN DE ASISTENCIA ────────────────────────
    function renderBoton(wrap, ventana, yaMarco, estadoMarcado, clase, onMarcado) {
        const boton  = calcularBoton(ventana, yaMarco, estadoMarcado);

        const configs = {
            futuro: {
                html:     `<span class="material-symbols-rounded">lock_clock</span> Disponible a las ${fmtHora(clase.hora_inicio)}`,
                style:    "background:#f0f0f0; color:#aaa; cursor:not-allowed;",
                disabled: true
            },
            presente: {
                html:     `<span class="material-symbols-rounded">how_to_reg</span> Marcar Asistencia`,
                style:    "background:#1a8a4a; color:#fff; cursor:pointer;",
                disabled: false
            },
            tarde_activo: {
                html:     `<span class="material-symbols-rounded">schedule</span> Llegaste Tarde — Marcar`,
                style:    "background:#d4780a; color:#fff; cursor:pointer;",
                disabled: false
            },
            ausente: {
                html:     `<span class="material-symbols-rounded">cancel</span> Ausente — Clase Terminada`,
                style:    "background:#fdecea; color:#c0392b; cursor:not-allowed; border:1.5px solid #e8b4b0;",
                disabled: true
            },
            marcado: {
                html: estadoMarcado === "PRESENTE"
                    ? `<span class="material-symbols-rounded">check_circle</span> Asistencia Confirmada`
                    : estadoMarcado === "TARDE"
                    ? `<span class="material-symbols-rounded">schedule</span> Registrado — Tarde`
                    : estadoMarcado === "JUSTIFICADA" && clase._justificacionAprobada === "APROBADA"
                    ? `<span class="material-symbols-rounded">verified</span> Justificación Aprobada`
                    : estadoMarcado === "JUSTIFICADA" && clase._justificacionAprobada === "RECHAZADA"
                    ? `<span class="material-symbols-rounded">cancel</span> Justificación Rechazada`
                    : estadoMarcado === "JUSTIFICADA"
                    ? `<span class="material-symbols-rounded">verified</span> Justificación Pendiente`
                    : `<span class="material-symbols-rounded">check_circle</span> Marcado`,
                style: estadoMarcado === "PRESENTE"
                    ? "background:#e6f9f0; color:#1a8a4a; cursor:not-allowed; border:1.5px solid #a3e4c2;"
                    : estadoMarcado === "TARDE"
                    ? "background:#fef5e7; color:#d4780a; cursor:not-allowed; border:1.5px solid #f5d08a;"
                    : estadoMarcado === "JUSTIFICADA" && clase._justificacionAprobada === "APROBADA"
                    ? "background:#e6f9f0; color:#1a8a4a; cursor:not-allowed; border:1.5px solid #a3e4c2;"
                    : estadoMarcado === "JUSTIFICADA" && clase._justificacionAprobada === "RECHAZADA"
                    ? "background:#fdecea; color:#c0392b; cursor:not-allowed; border:1.5px solid #e8b4b0;"
                    : "background:#f5eef8; color:#8e44ad; cursor:not-allowed; border:1.5px solid #c9a8e0;",
                disabled: true
            },
        };

        const cfg = configs[boton.estado];

        wrap.innerHTML = `
            <button id="btn-asist-${clase.id_horario}" style="
                width:100%; padding:14px 20px; border-radius:10px; border:none;
                font-size:0.92rem; font-weight:700; font-family:inherit;
                display:flex; align-items:center; justify-content:center; gap:8px;
                transition:opacity .15s; ${cfg.style}
            " ${cfg.disabled ? "disabled" : ""}>
                ${cfg.html}
            </button>
        `;

        // Botón de justificación — solo si no marcó y la clase está activa o cerrada
        if (!yaMarco && (ventana === "tarde_cerrado" || ventana === "cerrado" || ventana === "tarde")) {
            wrap.innerHTML += `
                <button id="btn-justif-${clase.id_horario}" style="
                    width:100%; margin-top:10px; padding:11px 20px;
                    border-radius:10px; border:1.5px solid #c9a8e0;
                    background:#f5eef8; color:#8e44ad;
                    font-size:0.88rem; font-weight:700; font-family:inherit;
                    display:flex; align-items:center; justify-content:center; gap:7px;
                    cursor:pointer; transition:opacity .15s;
                ">
                    <span class="material-symbols-rounded" style="font-size:1rem;">verified</span>
                    Solicitar Justificación
                </button>
            `;
            document.getElementById(`btn-justif-${clase.id_horario}`)
                ?.addEventListener("click", () => abrirJustificacion(clase));
        }

        // Listener del botón principal
        if (!cfg.disabled) {
            const btnEl = document.getElementById(`btn-asist-${clase.id_horario}`);
            btnEl?.addEventListener("click", () => {
                btnEl.disabled = true;
                btnEl.style.opacity = "0.6";
                const esPresente = (boton.estado === "presente");
                onMarcado(esPresente ? "PRESENTE" : "TARDE");
            });
        }
    }

    // ── MODAL JUSTIFICACIÓN ───────────────────────────────────
    let _claseJustif = null;

    function abrirJustificacion(clase) {
        _claseJustif = clase;
        document.getElementById("justif-clase-label").textContent =
            `${clase.materia_nombre} — ${fmtHora(clase.hora_inicio)} a ${fmtHora(clase.hora_fin)}`;
        document.getElementById("justif-obs").value = "";
        const overlay = document.getElementById("justif-overlay");
        overlay.style.display = "flex";
    }

    document.getElementById("justif-cancelar").addEventListener("click", () => {
        document.getElementById("justif-overlay").style.display = "none";
    });

    document.getElementById("justif-overlay").addEventListener("click", e => {
        if (e.target === document.getElementById("justif-overlay"))
            document.getElementById("justif-overlay").style.display = "none";
    });

    document.getElementById("justif-enviar").addEventListener("click", () => {
        const obs = document.getElementById("justif-obs").value.trim();
        if (!obs) {
            document.getElementById("justif-obs").style.borderColor = "#e74c3c";
            return;
        }
        const clase   = _claseJustif;
        const fechaHoy = new Date().toISOString().slice(0, 10);
        const horaAhora = new Date().toTimeString().slice(0, 8);

        const payload = {
            id_usuario:    idEstudiante,
            id_clase:      clase.id_clase,
            id_horario:    clase.id_horario,
            fecha:         fechaHoy,
            hora:          horaAhora,
            estado:        "JUSTIFICADA",
            tipo_registro: "AUTOMATICO",
            observacion:   obs
        };

        document.getElementById("justif-enviar").disabled = true;

        fetch("http://127.0.0.1:5000/asistencias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(data => {
            document.getElementById("justif-overlay").style.display = "none";
            if (data.success) {
                clase._yaMarco               = true;
                clase._estadoMarcado         = "JUSTIFICADA";
                clase._justificacionAprobada = "PENDIENTE";
                actualizarBadge(clase.id_horario, "JUSTIFICADA", "PENDIENTE");
                rehacerBoton(clase);
                alert("Justificación enviada correctamente.");
            } else {
                alert(data.error || data.mensaje || "No se pudo enviar la justificación.");
            }
        })
        .catch(() => alert("Error al conectar con el servidor."))
        .finally(() => {
            document.getElementById("justif-enviar").disabled = false;
        });
    });

    // ── ACTUALIZAR BADGE DE ESTADO ────────────────────────────
    function actualizarBadge(idHorario, estado, justificacionAprobada = null) {
        const badge = document.getElementById(`badge-h${idHorario}`);
        if (!badge) return;

        let claveEstado = estado;
        if (estado === "JUSTIFICADA") {
            claveEstado = justificacionAprobada === "APROBADA"  ? "JUSTIFICADA_APROBADA"
                        : justificacionAprobada === "RECHAZADA" ? "JUSTIFICADA_RECHAZADA"
                        : "JUSTIFICADA_PENDIENTE";
        }

        const map = {
            PRESENTE:              { texto: "Presente",          clase: "attended"           },
            TARDE:                 { texto: "Tarde",             clase: "status-tarde"       },
            JUSTIFICADA_PENDIENTE: { texto: "Justif. Pendiente", clase: "status-justificada" },
            JUSTIFICADA_APROBADA:  { texto: "Justif. Aprobada",  clase: "attended"           },
            JUSTIFICADA_RECHAZADA: { texto: "Justif. Rechazada", clase: "status-ausente"     },
            AUSENTE:               { texto: "Ausente",           clase: "status-ausente"     },
            pendiente:             { texto: "Pendiente",         clase: "pending"            }
        };

        const cfg = map[claveEstado] || map.pendiente;
        badge.className   = `status-badge ${cfg.clase}`;
        badge.textContent = cfg.texto;
    }

    // ── REHACER SOLO EL ÁREA DEL BOTÓN ───────────────────────
    function rehacerBoton(clase) {
        const wrap   = document.getElementById(`wrap-btn-h${clase.id_horario}`);
        if (!wrap) return;
        const ventana = calcularVentana(clase);
        renderBoton(wrap, ventana, clase._yaMarco, clase._estadoMarcado, clase,
            (estado) => marcarAsistencia(clase, estado));
    }

    // ── MARCAR ASISTENCIA ─────────────────────────────────────
    function marcarAsistencia(clase, estadoAMarcar) {
        const fechaHoy  = new Date().toISOString().slice(0, 10);
        const horaAhora = new Date().toTimeString().slice(0, 8);

        // BACKEND: POST /asistencias
        // usa ON DUPLICATE KEY UPDATE para (id_usuario, id_horario, fecha)
        fetch("http://127.0.0.1:5000/asistencias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario:    idEstudiante,
                id_clase:      clase.id_clase,
                id_horario:    clase.id_horario,
                fecha:         fechaHoy,
                hora:          horaAhora,
                estado:        estadoAMarcar,
                tipo_registro: "AUTOMATICO",
                observacion:   null
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                clase._yaMarco       = true;
                clase._estadoMarcado = estadoAMarcar;
                actualizarBadge(clase.id_horario, estadoAMarcar);
                rehacerBoton(clase);
            } else {
                alert(data.error || data.mensaje || "No se pudo registrar la asistencia.");
                rehacerBoton(clase); // restaurar botón
            }
        })
        .catch(() => {
            alert("Error al conectar con el servidor.");
            rehacerBoton(clase);
        });
    }

    // ── CONSTRUIR SLIDES ──────────────────────────────────────
    function construirCarrusel(clases) {
        track.innerHTML      = "";
        indicators.innerHTML = "";

        clases.forEach((clase, i) => {
            const esPractica = clase.tipo_clase === "PRACTICA";
            const ventana    = calcularVentana(clase);
            const botonCfg   = calcularBoton(ventana, clase._yaMarco, clase._estadoMarcado);

            // Badge de estado inicial
            const badgeEstadoInicial = clase._yaMarco
                ? (clase._estadoMarcado === "JUSTIFICADA"
                    ? (clase._justificacionAprobada === "APROBADA"  ? "JUSTIFICADA_APROBADA"
                    : clase._justificacionAprobada === "RECHAZADA" ? "JUSTIFICADA_RECHAZADA"
                    : "JUSTIFICADA_PENDIENTE")
                    : clase._estadoMarcado)
                : (ventana === "cerrado" && !clase._yaMarco ? "AUSENTE" : "pendiente");

            const badgeMap = {
                PRESENTE:    { texto: "Presente",   cls: "attended"           },
                TARDE:       { texto: "Tarde",       cls: "status-tarde"       },
                JUSTIFICADA_PENDIENTE: { texto: "Justif. Pendiente",    cls: "status-justificada" },
                JUSTIFICADA_APROBADA:  { texto: "Justif. Aprobada",     cls: "attended"           },
                JUSTIFICADA_RECHAZADA: { texto: "Justif. Rechazada",    cls: "status-ausente"},
                AUSENTE:     { texto: "Ausente",     cls: "status-ausente"     },
                pendiente:   { texto: "Pendiente",   cls: "pending"            }
            };
            const bCfg = badgeMap[badgeEstadoInicial] || badgeMap.pendiente;

            const slide = document.createElement("div");
            slide.className = `class-slide`;
            slide.style.cssText = "min-width:100%;";
            slide.innerHTML = `
                <div class="class-top-info">
                    <span class="class-type">
                        <span class="material-symbols-rounded" style="font-size:1.1rem">
                            ${esPractica ? "science" : "menu_book"}
                        </span>
                        ${esPractica ? "Práctica" : "Teoría"}
                    </span>
                    <span class="status-badge ${bCfg.cls}" id="badge-h${clase.id_horario}">
                        ${bCfg.texto}
                    </span>
                </div>

                <div class="class-main-info">
                    <h2>${clase.materia_nombre || "Clase"}</h2>
                    <div class="class-time">
                        <span class="material-symbols-rounded">schedule</span>
                        ${fmtHora(clase.hora_inicio)} – ${fmtHora(clase.hora_fin)}
                    </div>
                </div>

                <div class="class-details">
                    <div class="detail-item">
                        <span class="material-symbols-rounded icon">person</span>
                        <strong>Docente</strong>
                        <p>${clase.docente_nombre || "—"}</p>
                    </div>
                    <div class="detail-item">
                        <span class="material-symbols-rounded icon">room</span>
                        <strong>Aula</strong>
                        <p>${clase.codigo_aula || "—"} · Edif. ${clase.edificio || "—"}</p>
                    </div>
                    <div class="detail-item">
                        <span class="material-symbols-rounded icon">apartment</span>
                        <strong>Modalidad</strong>
                        <p>${clase.modalidad_nombre || "—"}</p>
                    </div>
                </div>

                <!-- Área del botón — se reconstruye en cada tick -->
                <div id="wrap-btn-h${clase.id_horario}"></div>
            `;
            track.appendChild(slide);

            // Dot indicador
            const dot = document.createElement("div");
            dot.className = `dot ${i === 0 ? "active" : ""}`;
            indicators.appendChild(dot);

            // Renderizar botón inicial
            const wrap = slide.querySelector(`#wrap-btn-h${clase.id_horario}`);
            renderBoton(wrap, ventana, clase._yaMarco, clase._estadoMarcado, clase,
                (estado) => marcarAsistencia(clase, estado));
        });

        // ── CARRUSEL ─────────────────────────────────────────
        const dots    = indicators.querySelectorAll(".dot");
        const btnPrev = document.getElementById("btn-prev");
        const btnNext = document.getElementById("btn-next");
        let current   = 0;

        function goTo(index) {
            const slideW = track.querySelector(".class-slide").clientWidth + 20;
            track.scrollTo({ left: index * slideW, behavior: "smooth" });
            dots.forEach((d, i) => d.classList.toggle("active", i === index));
            current = index;
        }

        btnPrev.addEventListener("click", () => { if (current > 0) goTo(current - 1); });
        btnNext.addEventListener("click", () => { if (current < clases.length - 1) goTo(current + 1); });

        track.addEventListener("scroll", () => {
            const slideW   = track.querySelector(".class-slide").clientWidth + 20;
            const newIndex = Math.round(track.scrollLeft / slideW);
            if (newIndex !== current) {
                current = newIndex;
                dots.forEach((d, i) => d.classList.toggle("active", i === current));
            }
        });

        // ── TICK: actualizar botones cada 30 segundos ─────────
        if (_tickInterval) clearInterval(_tickInterval);
        _tickInterval = setInterval(() => {
            clases.forEach(clase => {
                if (!clase._yaMarco) rehacerBoton(clase);
            });
        }, 30_000);

        // Limpiar intervalo si el usuario navega a otra vista
        const observer = new MutationObserver(() => {
            if (!document.getElementById("carousel-track")) {
                clearInterval(_tickInterval);
                observer.disconnect();
            }
        });
        observer.observe(document.getElementById("main-content") || document.body,
            { childList: true, subtree: false });
    }

    // ── FETCH PRINCIPAL ───────────────────────────────────────
    // BACKEND: GET /mis-horarios-hoy?id_usuario=X
    //
    // Devuelve los horarios del día de semana actual cuya ventana de fecha
    // (fecha_inicio → fecha_fin) incluye la fecha de hoy, para el estudiante.
    // La query base sería:
    //
    //   SELECT
    //     h.id_horario, h.hora_inicio, h.hora_fin,
    //     h.minutos_anticipacion, h.minutos_tolerancia,
    //     h.dia_semana,
    //     c.id_clase, c.tipo_clase,
    //     m.nombre       AS materia_nombre,
    //     CONCAT(u.primer_nombre,' ',u.primer_apellido) AS docente_nombre,
    //     a.codigo_aula, a.edificio,
    //     mo.nombre      AS modalidad_nombre,
    //     -- asistencia ya registrada hoy (puede ser NULL)
    //     asi.estado     AS estado_asistencia
    //   FROM horario h
    //   JOIN clase        c   ON c.id_clase     = h.id_clase
    //   JOIN materia      m   ON m.id_materia   = c.id_materia
    //   JOIN usuario      u   ON u.id_usuario   = c.id_docente
    //   JOIN aula         a   ON a.id_aula      = h.id_aula
    //   JOIN modalidad    mo  ON mo.id_modalidad= h.id_modalidad
    //   -- grupo del estudiante que tiene esta clase
    //   JOIN clase_grupo  cg  ON cg.id_clase    = c.id_clase AND cg.estado = 'ACTIVO'
    //   JOIN inscripcion  i   ON i.id_grupo     = cg.id_grupo
    //                       AND i.id_usuario   = :id_usuario
    //                       AND i.estado       = 'ACTIVA'
    //   LEFT JOIN asistencia asi ON asi.id_horario = h.id_horario
    //                          AND asi.id_usuario  = :id_usuario
    //                          AND asi.fecha       = CURDATE()
    //   WHERE h.dia_semana  = :dia_semana_actual   -- LUNES, MARTES...
    //     AND h.fecha_inicio <= CURDATE()
    //     AND h.fecha_fin    >= CURDATE()
    //     AND h.estado       = 'ACTIVO'
    //   ORDER BY h.hora_inicio

    const diasSemana = ["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"];
    const diaHoy     = diasSemana[new Date().getDay()];

    // Mostrar loader
    track.innerHTML = `
        <div style="min-width:300px;max-width:420px;margin:0 auto;
            text-align:center;padding:60px 20px;color:#aaa;">
            <span class="material-symbols-rounded"
                style="font-size:3rem;display:block;margin-bottom:12px;animation:spin 1s linear infinite;">
                sync
            </span>
            <p style="font-size:0.9rem;">Cargando tus clases de hoy...</p>
        </div>
    `;

    fetch(`http://127.0.0.1:5000/mis-horarios-hoy?id_usuario=${idEstudiante}&dia=${diaHoy}`)
        .then(r => r.json())
        .then(data => {
            if (!data.success || !data.horarios || data.horarios.length === 0) {
                mostrarVacio("No tienes clases programadas para hoy.");
                return;
            }

            // Enriquecer cada horario con el estado ya marcado (si aplica)
            const clases = data.horarios.map(h => ({
                ...h,
                _yaMarco:      !!h.estado_asistencia,
                _estadoMarcado: h.estado_asistencia || null,
                _justificacionAprobada: h.justificacion_aprobada || null
            }));

            construirCarrusel(clases);
        })
        .catch(() => {
            mostrarVacio("No se pudo conectar con el servidor.");
        });
}