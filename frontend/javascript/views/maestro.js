// ============================================================
//  views/maestro.js — Panel del Maestro: Pasar Lista
// ============================================================

function renderViewMaestroAlumnos(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idDocente = usuarioActivo.id;
    console.log("USUARIO ACTIVO:", usuarioActivo);  // ← agrega esto
    console.log("ID DOCENTE:", idDocente);           // ← y esto

    // ── Estado global de la vista ─────────────────────────────
    let claseSeleccionada = null; // { id_clase, materia_nombre, tipo_clase, grupo_nombre, id_grupo }

    // ── Estilos inline específicos de esta vista ──────────────
    if (!document.getElementById("maestro-lista-style")) {
        const st = document.createElement("style");
        st.id = "maestro-lista-style";
        st.textContent = `
            /* ── TARJETAS DE CLASE ── */
            .ml-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                gap: 18px;
                margin-top: 24px;
            }
            .ml-card {
                background: #fff;
                border: 1.5px solid #e8edf5;
                border-radius: 14px;
                padding: 22px 20px;
                cursor: pointer;
                transition: border-color .18s, box-shadow .18s, transform .15s;
                display: flex;
                flex-direction: column;
                gap: 10px;
                position: relative;
                overflow: hidden;
            }
            .ml-card::before {
                content: "";
                position: absolute;
                top: 0; left: 0;
                width: 4px; height: 100%;
                background: var(--azul-sami, #2563eb);
                border-radius: 4px 0 0 4px;
                opacity: 0;
                transition: opacity .18s;
            }
            .ml-card:hover {
                border-color: var(--azul-sami, #2563eb);
                box-shadow: 0 6px 24px rgba(37,99,235,.13);
                transform: translateY(-2px);
            }
            .ml-card:hover::before { opacity: 1; }
            .ml-card-icon {
                width: 44px; height: 44px;
                border-radius: 10px;
                background: #eef1f9;
                display: flex; align-items: center; justify-content: center;
                color: var(--azul-sami, #2563eb);
            }
            .ml-card-icon .material-symbols-rounded { font-size: 1.4rem; }
            .ml-card-materia {
                font-size: 1rem; font-weight: 700;
                color: #1a1a2e; line-height: 1.3;
            }
            .ml-card-meta {
                font-size: 0.82rem; color: #666;
                display: flex; flex-direction: column; gap: 4px;
            }
            .ml-card-meta span {
                display: flex; align-items: center; gap: 5px;
            }
            .ml-card-meta .material-symbols-rounded { font-size: 0.9rem; }
            .ml-tipo-badge {
                display: inline-flex; align-items: center; gap: 4px;
                padding: 2px 10px; border-radius: 20px;
                font-size: 0.75rem; font-weight: 600;
                margin-top: 4px; width: fit-content;
            }
            .ml-tipo-teoria   { background: #eef1f9; color: var(--azul-sami,#2563eb); }
            .ml-tipo-practica { background: #edfaf3; color: #27ae60; }

            /* ── LISTA DE ALUMNOS ── */
            .ml-back-btn {
                display: inline-flex; align-items: center; gap: 6px;
                background: none; border: none; cursor: pointer;
                color: var(--azul-sami, #2563eb);
                font-size: 0.9rem; font-weight: 600;
                padding: 6px 0; margin-bottom: 20px;
                transition: opacity .15s;
            }
            .ml-back-btn:hover { opacity: .7; }

            .ml-alumno-row {
                background: #fff;
                border: 1.5px solid #e8edf5;
                border-radius: 12px;
                padding: 16px 18px;
                display: flex;
                align-items: flex-start;
                gap: 16px;
                margin-bottom: 12px;
                transition: border-color .15s;
            }
            .ml-alumno-row:hover { border-color: #c8d3ef; }

            .ml-alumno-avatar {
                width: 42px; height: 42px; border-radius: 50%;
                background: var(--azul-sami, #2563eb);
                color: #fff; font-weight: 700; font-size: 1rem;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0;
            }

            .ml-alumno-info {
                flex: 1; min-width: 0;
            }
            .ml-alumno-nombre {
                font-weight: 700; font-size: 0.95rem;
                color: #1a1a2e; margin-bottom: 2px;
            }
            .ml-alumno-carnet {
                font-size: 0.8rem; color: #888; margin-bottom: 12px;
            }

            /* ── RADIO BUTTONS DE ASISTENCIA ── */
            .ml-opciones {
                display: flex; gap: 8px; flex-wrap: wrap;
            }
            .ml-opcion-label {
                cursor: pointer;
            }
            .ml-opcion-label input[type="radio"] { display: none; }
            .ml-opcion-pill {
                display: inline-flex; align-items: center; gap: 4px;
                padding: 5px 12px; border-radius: 20px;
                font-size: 0.78rem; font-weight: 600;
                border: 1.5px solid #e8edf5;
                background: #f8f9fb;
                color: #777;
                transition: all .15s;
                user-select: none;
            }
            .ml-opcion-pill .material-symbols-rounded { font-size: 0.85rem; }

            /* Colores por estado */
            .ml-opcion-label input[value="PRESENTE"]:checked ~ .ml-opcion-pill {
                background: #e6f9f0; border-color: #1a8a4a; color: #1a8a4a;
            }
            .ml-opcion-label input[value="AUSENTE"]:checked ~ .ml-opcion-pill {
                background: #fdecea; border-color: #c0392b; color: #c0392b;
            }
            .ml-opcion-label input[value="TARDE"]:checked ~ .ml-opcion-pill {
                background: #fef5e7; border-color: #d4780a; color: #d4780a;
            }
            .ml-opcion-label input[value="JUSTIFICADA"]:checked ~ .ml-opcion-pill {
                background: #f5eef8; border-color: #8e44ad; color: #8e44ad;
            }
            .ml-opcion-label:hover .ml-opcion-pill { border-color: #c8d3ef; }

            /* ── CAMPO OBSERVACIÓN ── */
            .ml-obs-input {
                width: 100%; margin-top: 10px;
                border: 1.5px solid #e8edf5;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 0.82rem;
                font-family: inherit;
                color: #1a1a2e;
                background: #f8f9fb;
                resize: none;
                outline: none;
                transition: border-color .15s;
                box-sizing: border-box;
            }
            .ml-obs-input:focus { border-color: var(--azul-sami, #2563eb); background: #fff; }
            .ml-obs-input::placeholder { color: #bbb; }

            /* ── BOTÓN GUARDAR LISTA ── */
            .ml-guardar-wrap {
                position: sticky; bottom: 0;
                background: linear-gradient(to top, #f5f6fa 80%, transparent);
                padding: 20px 0 12px;
                margin-top: 8px;
                display: flex; justify-content: flex-end; gap: 12px;
            }
            .ml-fecha-label {
                font-size: 0.82rem; color: #888;
                display: flex; align-items: center; gap: 6px;
                margin-right: auto;
            }

            /* ── ESTADO VACÍO ── */
            .ml-empty {
                text-align: center; padding: 60px 20px;
                color: #aaa; font-size: 0.95rem;
            }
            .ml-empty .material-symbols-rounded {
                font-size: 3.5rem; display: block; margin-bottom: 12px;
            }

            /* ── HEADER DE LA SECCIÓN DE LISTA ── */
            .ml-lista-header {
                background: #fff; border: 1.5px solid #e8edf5;
                border-radius: 12px; padding: 18px 20px;
                margin-bottom: 20px;
                display: flex; align-items: center; gap: 16px;
            }
            .ml-lista-header-icon {
                width: 48px; height: 48px; border-radius: 12px;
                background: #eef1f9; display: flex; align-items: center;
                justify-content: center; color: var(--azul-sami, #2563eb);
            }
            .ml-lista-header h2 { font-size: 1.05rem; font-weight: 700; margin: 0 0 3px; }
            .ml-lista-header p  { font-size: 0.82rem; color: #777; margin: 0; }

            .ml-contador {
                margin-left: auto; text-align: right;
                font-size: 0.82rem; color: #666;
            }
            .ml-contador strong { font-size: 1.4rem; color: var(--azul-sami,#2563eb); display: block; }
        `;
        document.head.appendChild(st);
    }

    // ── Render inicial: tarjetas de clase ─────────────────────
    function renderClases() {
        container.innerHTML = `
            <div class="dashboard-header">
                <h1><span class="material-symbols-rounded">how_to_reg</span> Pasar Lista</h1>
                <p>Selecciona una clase para registrar la asistencia del día.</p>
            </div>
            <div id="ml-clases-wrap">
                <div class="ml-empty">
                    <span class="material-symbols-rounded">sync</span>
                    Cargando tus clases...
                </div>
            </div>
        `;

        // BACKEND: GET /mis-clases-grupos?id_docente=X
        // Debe devolver las clases del docente CON su grupo asignado (via clase_grupo):
        // {
        //   success: true,
        //   clases: [{
        //     id_clase, tipo_clase,
        //     materia_nombre,
        //     id_clase_grupo, id_grupo, nombre_grupo,
        //     carrera_nombre, nombre_ciclo,
        //     horarios: [{ id_horario, dia_semana, hora_inicio, hora_fin }]
        //   }]
        // }
        // La query base sería:
        //   SELECT c.id_clase, c.tipo_clase,
        //          m.nombre AS materia_nombre,
        //          cg.id_clase_grupo, cg.id_grupo,
        //          g.nombre_grupo,
        //          ca.nombre AS carrera_nombre,
        //          ci.nombre AS nombre_ciclo
        //   FROM clase c
        //   JOIN materia m ON m.id_materia = c.id_materia
        //   JOIN clase_grupo cg ON cg.id_clase = c.id_clase AND cg.estado = 'ACTIVO'
        //   JOIN grupo g ON g.id_grupo = cg.id_grupo
        //   JOIN carrera ca ON ca.id_carrera = g.id_carrera
        //   JOIN ciclo ci ON ci.id_ciclo = g.id_ciclo
        //   WHERE c.id_docente = :id_docente AND c.estado = 'ACTIVO'

        fetch(`http://127.0.0.1:5000/mis-clases-grupos?id_docente=${idDocente}`)
            .then(r => r.json())
            .then(data => {
                const wrap = document.getElementById("ml-clases-wrap");
                if (!data.success || !data.clases || data.clases.length === 0) {
                    wrap.innerHTML = `
                        <div class="ml-empty">
                            <span class="material-symbols-rounded">event_busy</span>
                            No tienes clases con grupos asignados actualmente.
                        </div>
                    `;
                    return;
                }
                renderTarjetas(data.clases, wrap);
            })
            .catch(() => {
                const wrap = document.getElementById("ml-clases-wrap");
                wrap.innerHTML = `
                    <div class="ml-empty">
                        <span class="material-symbols-rounded">wifi_off</span>
                        No se pudo conectar con el servidor.
                    </div>
                `;
            });
    }

    // ── Tarjetas de clase ─────────────────────────────────────
    function renderTarjetas(clases, wrap) {
        const tipoIcon = t => t === "TEORIA" ? "menu_book" : "science";
        const tipoClass = t => t === "TEORIA" ? "ml-tipo-teoria" : "ml-tipo-practica";
        const tipoLabel = t => t === "TEORIA" ? "Teoría" : "Práctica";

        const diasCorto = {
            LUNES:"Lun", MARTES:"Mar", MIERCOLES:"Mié",
            JUEVES:"Jue", VIERNES:"Vie", SABADO:"Sáb", DOMINGO:"Dom"
        };

        wrap.innerHTML = `<div class="ml-grid" id="ml-grid"></div>`;
        const grid = document.getElementById("ml-grid");

        clases.forEach(cl => {
            const horarioHTML = (cl.horarios && cl.horarios.length)
                ? cl.horarios.map(h =>
                    `<span>
                        <span class="material-symbols-rounded">schedule</span>
                        ${diasCorto[h.dia_semana] || h.dia_semana} ${h.hora_inicio?.slice(0,5)} – ${h.hora_fin?.slice(0,5)}
                    </span>`
                  ).join("")
                : `<span><span class="material-symbols-rounded">schedule</span> Sin horario asignado</span>`;

            const card = document.createElement("div");
            card.className = "ml-card";
            card.innerHTML = `
                <div class="ml-card-icon">
                    <span class="material-symbols-rounded">${tipoIcon(cl.tipo_clase)}</span>
                </div>
                <div class="ml-card-materia">${cl.materia_nombre || `Clase #${cl.id_clase}`}</div>
                <div class="ml-card-meta">
                    <span>
                        <span class="material-symbols-rounded">group</span>
                        ${cl.nombre_grupo || "Sin grupo"} — ${cl.carrera_nombre || ""}
                    </span>
                    <span>
                        <span class="material-symbols-rounded">sync_alt</span>
                        ${cl.nombre_ciclo || ""}
                    </span>
                    ${horarioHTML}
                </div>
                <span class="ml-tipo-badge ${tipoClass(cl.tipo_clase)}">
                    <span class="material-symbols-rounded">${tipoIcon(cl.tipo_clase)}</span>
                    ${tipoLabel(cl.tipo_clase)}
                </span>
            `;
            card.addEventListener("click", () => {
                claseSeleccionada = cl;
                renderLista(cl);
            });
            grid.appendChild(card);
        });
    }

    // ── Vista de lista de estudiantes ─────────────────────────
    function renderLista(clase) {
        const ahora = new Date();
        const fechaHoy = ahora.toISOString().slice(0, 10);
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        const horaAhora = ahora.toISOString().slice(11, 16);

        container.innerHTML = `
            <button class="ml-back-btn" id="ml-back">
                <span class="material-symbols-rounded">arrow_back</span>
                Volver a mis clases
            </button>

            <div class="ml-lista-header">
                <div class="ml-lista-header-icon">
                    <span class="material-symbols-rounded">${clase.tipo_clase === "TEORIA" ? "menu_book" : "science"}</span>
                </div>
                <div>
                    <h2>${clase.materia_nombre || `Clase #${clase.id_clase}`}</h2>
                    <p>
                        Grupo ${clase.nombre_grupo || "—"} &nbsp;·&nbsp;
                        ${clase.tipo_clase === "TEORIA" ? "Teoría" : "Práctica"} &nbsp;·&nbsp;
                        ${clase.carrera_nombre || ""}
                    </p>
                </div>
                <div class="ml-contador" id="ml-contador">
                    <strong>—</strong>
                    estudiantes
                </div>
            </div>

            <div id="ml-lista-cuerpo">
                <div class="ml-empty">
                    <span class="material-symbols-rounded">sync</span>
                    Cargando estudiantes...
                </div>
            </div>
        `;

        document.getElementById("ml-back").addEventListener("click", renderClases);

        // BACKEND: GET /estudiantes-grupo?id_grupo=X
        // Devuelve los usuarios inscritos en ese grupo con estado='ACTIVA':
        // {
        //   success: true,
        //   estudiantes: [{ id_usuario, primer_nombre, primer_apellido, carnet }]
        // }
        // Query:
        //   SELECT u.id_usuario, u.primer_nombre, u.segundo_nombre,
        //          u.primer_apellido, u.segundo_apellido, u.carnet
        //   FROM inscripcion i
        //   JOIN usuario u ON u.id_usuario = i.id_usuario
        //   WHERE i.id_grupo = :id_grupo AND i.estado = 'ACTIVA' AND u.estado = 'ACTIVO'

        fetch(`http://127.0.0.1:5000/estudiantes-grupo?id_grupo=${clase.id_grupo}`)
            .then(r => r.json())
            .then(data => {
                const cuerpo = document.getElementById("ml-lista-cuerpo");
                if (!data.success || !data.estudiantes || data.estudiantes.length === 0) {
                    cuerpo.innerHTML = `
                        <div class="ml-empty">
                            <span class="material-symbols-rounded">person_off</span>
                            No hay estudiantes inscritos en este grupo.
                        </div>
                    `;
                    document.getElementById("ml-contador").innerHTML = `<strong>0</strong> estudiantes`;
                    return;
                }

                const estudiantes = data.estudiantes;
                document.getElementById("ml-contador").innerHTML =
                    `<strong>${estudiantes.length}</strong> estudiantes`;

                // Consultar si ya hay lista guardada hoy
                fetch(`http://127.0.0.1:5000/asistencias?id_clase=${clase.id_clase}&fecha=${fechaHoy}`)
                    .then(r => r.json())
                    .then(asistenciaHoy => {
                        const previas = {};
                        if (asistenciaHoy.success && asistenciaHoy.asistencias.length) {
                            asistenciaHoy.asistencias.forEach(a => {
                                previas[a.id_usuario] = {
                                    estado:     a.estado,
                                    observacion: a.observacion
                                };
                            });
                        }
                        renderFormLista(cuerpo, estudiantes, clase, fechaHoy, horaAhora, previas);
                    })
                    .catch(() => {
                        renderFormLista(cuerpo, estudiantes, clase, fechaHoy, horaAhora, {});
                    });
                    //hasta aca
            })
            .catch(() => {
                document.getElementById("ml-lista-cuerpo").innerHTML = `
                    <div class="ml-empty">
                        <span class="material-symbols-rounded">wifi_off</span>
                        No se pudo cargar la lista.
                    </div>
                `;
            });
    }

    // ── Formulario de asistencia ──────────────────────────────
    function renderFormLista(cuerpo, estudiantes, clase, fechaHoy, horaAhora, previas = {}) {

        const estados = [
            { valor: "PRESENTE",    icon: "check_circle",      label: "Presente"    },
            { valor: "AUSENTE",     icon: "cancel",            label: "Ausente"     },
            { valor: "TARDE",       icon: "schedule",          label: "Tarde"       },
            { valor: "JUSTIFICADA", icon: "verified",          label: "Justificada" }
        ];

        let html = "";
        estudiantes.forEach((est, i) => {
            const nombre = [est.primer_nombre, est.segundo_nombre, est.primer_apellido, est.segundo_apellido]
                .filter(Boolean).join(" ");
            const inicial = (est.primer_nombre || "E").charAt(0).toUpperCase();

            const radioOpts = estados.map(e => `
                <label class="ml-opcion-label" title="${e.label}">
                    <input type="radio" name="asist-${est.id_usuario}" value="${e.valor}" />
                    <span class="ml-opcion-pill">
                        <span class="material-symbols-rounded">${e.icon}</span>
                        ${e.label}
                    </span>
                </label>
            `).join("");

            html += `
                <div class="ml-alumno-row">
                    <div class="ml-alumno-avatar">${inicial}</div>
                    <div class="ml-alumno-info">
                        <div class="ml-alumno-nombre">${nombre}</div>
                        <div class="ml-alumno-carnet">Carnet: ${est.carnet || "—"}</div>
                        <div class="ml-opciones">${radioOpts}</div>
                        <textarea
                            class="ml-obs-input"
                            id="obs-${est.id_usuario}"
                            rows="1"
                            placeholder="Observación (opcional)..."
                            style="display:none;"
                        ></textarea>
                    </div>
                </div>
            `;
        });

        cuerpo.innerHTML = `
            ${html}
            <div class="ml-guardar-wrap">
                <span class="ml-fecha-label">
                    <span class="material-symbols-rounded">calendar_today</span>
                    ${fechaHoy} &nbsp;
                    <span class="material-symbols-rounded">schedule</span>
                    ${horaAhora}
                </span>
                <button class="btn-secondary" id="ml-btn-marcar-todos">
                    <span class="material-symbols-rounded">done_all</span> Marcar todos Presentes
                </button>
                <button class="btn-primary" id="ml-btn-guardar" style="width:auto; padding:12px 28px;">
                    <span class="material-symbols-rounded">save</span> Guardar Lista
                </button>
            </div>
        `;


        // ── Validar ventana de edición ────────────────────────
        const diasMap = {
            0: "DOMINGO", 1: "LUNES", 2: "MARTES", 3: "MIERCOLES",
            4: "JUEVES", 5: "VIERNES", 6: "SABADO"
        };
        const diaHoy     = diasMap[new Date().getDay()];
        const diasClase  = clase.horarios?.map(h => h.dia_semana) || [];
        const puedeEditar = diasClase.includes(diaHoy);

        if (!puedeEditar) {
            const btnGuardar = document.getElementById("ml-btn-guardar");
            const btnMarcar  = document.getElementById("ml-btn-marcar-todos");
            btnGuardar.disabled = true;
            btnMarcar.disabled  = true;
            btnGuardar.style.opacity = "0.5";
            btnMarcar.style.opacity  = "0.5";

            cuerpo.querySelectorAll("input[type='radio']").forEach(r => r.disabled = true);
            cuerpo.querySelectorAll("textarea").forEach(t => t.disabled = true);

            const aviso = document.createElement("div");
            aviso.style.cssText = `
                background: #fef5e7;
                border: 1.5px solid #d4780a;
                color: #d4780a;
                border-radius: 10px;
                padding: 12px 16px;
                margin-bottom: 16px;
                font-size: 0.85rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            aviso.innerHTML = `
                <span class="material-symbols-rounded">lock</span>
                Esta clase no se imparte hoy. Solo puedes ver la última lista registrada.
            `;
            cuerpo.insertBefore(aviso, cuerpo.firstChild);
        }

        // ── Mostrar/ocultar observación según el estado ───────
        estudiantes.forEach(est => {
            const radios   = cuerpo.querySelectorAll(`input[name="asist-${est.id_usuario}"]`);
            const obsField = document.getElementById(`obs-${est.id_usuario}`);

            radios.forEach(radio => {
                radio.addEventListener("change", () => {
                    // Mostrar obs si no es PRESENTE
                    const val = cuerpo.querySelector(`input[name="asist-${est.id_usuario}"]:checked`)?.value;
                    obsField.style.display = (val && val !== "PRESENTE") ? "block" : "none";

                    // Auto-expandir textarea al escribir
                    obsField.style.height = "auto";
                    obsField.style.height = obsField.scrollHeight + "px";
                });
            });

            obsField.addEventListener("input", () => {
                obsField.style.height = "auto";
                obsField.style.height = obsField.scrollHeight + "px";
            });
        });

        // ── Marcar todos como presentes ───────────────────────
        document.getElementById("ml-btn-marcar-todos").addEventListener("click", () => {
            estudiantes.forEach(est => {
                const radio = cuerpo.querySelector(`input[name="asist-${est.id_usuario}"][value="PRESENTE"]`);
                if (radio) {
                    radio.checked = true;
                    document.getElementById(`obs-${est.id_usuario}`).style.display = "none";
                }
            });
        });

        // ── Pre-marcar estados previos
        estudiantes.forEach(est => {
            const prev = previas[est.id_usuario];
            if (!prev) return;

            const radio = cuerpo.querySelector(
                `input[name="asist-${est.id_usuario}"][value="${prev.estado}"]`
            );
            if (radio) {
                radio.checked = true;
                const obsField = document.getElementById(`obs-${est.id_usuario}`);
                if (prev.estado !== "PRESENTE" && prev.observacion) {
                    obsField.style.display = "block";
                    obsField.value = prev.observacion;
                }
            }
        });

        // ── Guardar lista ─────────────────────────────────────
        document.getElementById("ml-btn-guardar").addEventListener("click", () => {
            // Validar que todos tengan estado
            const sinMarcar = [];
            estudiantes.forEach(est => {
                const checked = cuerpo.querySelector(`input[name="asist-${est.id_usuario}"]:checked`);
                if (!checked) {
                    sinMarcar.push(est.primer_nombre);
                }
            });

            if (sinMarcar.length > 0) {
                alert(`Por favor marca el estado de: ${sinMarcar.slice(0, 3).join(", ")}${sinMarcar.length > 3 ? ` y ${sinMarcar.length - 3} más` : ""}.`);
                return;
            }

            // Construir payload
            const registros = estudiantes.map(est => {
                const estado = cuerpo.querySelector(`input[name="asist-${est.id_usuario}"]:checked`).value;
                const obs    = document.getElementById(`obs-${est.id_usuario}`).value.trim() || null;
                return {
                    id_usuario:    est.id_usuario,
                    id_clase:      clase.id_clase,


                    id_horario: (() => {
                        const diasMap = {0: "DOMINGO", 1: "LUNES", 2: "MARTES", 3: "MIERCOLES",4: "JUEVES", 5: "VIERNES", 6: "SABADO"};
                        const diaHoy = diasMap[new Date().getDay()];
                        const horarioHoy = clase.horarios?.find(h => h.dia_semana === diaHoy);
                        return horarioHoy?.id_horario || clase.horarios?.[0]?.id_horario || null;
                    })(),


                    fecha:         fechaHoy,
                    hora:          horaAhora + ":00",
                    estado:        estado,
                    tipo_registro: "MANUAL",
                    observacion:   obs,
                    id_usuario_modificador: window.SAMI?.usuario?.id || null,
                    id_usuario_registrador: window.SAMI?.usuario?.id || null 
                };
            });

            const btn = document.getElementById("ml-btn-guardar");
            btn.disabled = true;
            btn.innerHTML = `<span class="material-symbols-rounded">hourglass_top</span> Guardando...`;

            // BACKEND: POST /asistencias/lista
            // Recibe un array de registros y los inserta en bulk.
            // Si ya existe registro para (id_usuario, id_horario, fecha) → actualizar (ON DUPLICATE KEY UPDATE).
            // {
            //   success: true,
            //   registrados: N,
            //   actualizados: M
            // }
            fetch("http://127.0.0.1:5000/asistencias/lista", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registros })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    const msg = data.actualizados
                        ? `Lista guardada. ${data.registrados} nuevos, ${data.actualizados} actualizados.`
                        : `Lista guardada correctamente para ${data.registrados} estudiante(s).`;
                    alert(msg);
                    renderClases(); // volver al inicio
                } else {
                    alert(data.error || data.mensaje || "No se pudo guardar la lista.");
                    btn.disabled = false;
                    btn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar Lista`;
                }
            })
            .catch(error => {
                console.error(error);
                alert("Error al conectar con el servidor.");
                btn.disabled = false;
                btn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar Lista`;
            });
        });
    }

    // ── Iniciar ───────────────────────────────────────────────
    renderClases();
}



//ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// ============================================================
//  Panel del Maestro: Registrar Inscripción
// ============================================================
function renderViewMaestroInscripcion(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idDocente     = usuarioActivo.id;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">how_to_reg</span> Registrar Inscripción</h1>
            <p>Inscribe un estudiante en uno de tus grupos activos.</p>
        </div>

        <div class="admin-card" style="max-width:760px;">
            <h3><span class="material-symbols-rounded">add_circle</span> Nueva Inscripción</h3>

            <form id="mins-form" novalidate>

                <div class="form-row">
                    <div class="form-group">
                        <label>Estudiante <span class="req">*</span></label>
                        <select id="mins-estudiante" required class="form-select">
                            <option value="" disabled selected>Cargando estudiantes...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Grupo <span class="req">*</span></label>
                        <select id="mins-grupo" required class="form-select">
                            <option value="" disabled selected>Cargando tus grupos...</option>
                        </select>
                    </div>
                </div>

                <!-- Registrador fijo — no editable por el maestro -->
                <div class="form-group">
                    <label>Registrado por</label>
                    <input
                        type="text"
                        class="form-input-full"
                        value="${usuarioActivo.nombre || usuarioActivo.primer_nombre || 'Docente'} ${usuarioActivo.primer_apellido || ''}"
                        disabled
                        style="background:#f5f5f5; color:#888; cursor:not-allowed;"
                    />
                    <small style="color:#aaa; font-size:0.78rem;">
                        Se registra automáticamente con tu cuenta.
                    </small>
                </div>

                <div class="form-group">
                    <label>Observación <span class="opt">(opcional)</span></label>
                    <input
                        type="text"
                        id="mins-observacion"
                        placeholder="Ej. Inscripción tardía autorizada por coordinación"
                        autocomplete="off"
                        maxlength="255"
                        class="form-input-full"
                    />
                    <small style="color:#aaa; font-size:0.78rem;">Máx. 255 caracteres</small>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Inscripción
                    </button>
                </div>

            </form>
        </div>
    `;

    // ── Cargar estudiantes ────────────────────────────────────
    fetch("http://127.0.0.1:5000/estudiantes")
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById("mins-estudiante");
            if (data.success && data.estudiantes.length) {
                select.innerHTML = `<option value="" disabled selected>Selecciona un estudiante...</option>`;
                data.estudiantes.forEach(est => {
                    const opt = document.createElement("option");
                    opt.value       = est.id_usuario;
                    opt.textContent = est.nombre_completo;
                    select.appendChild(opt);
                });
            } else {
                select.innerHTML = `<option value="" disabled selected>Sin estudiantes disponibles</option>`;
            }
        })
        .catch(() => {
            document.getElementById("mins-estudiante").innerHTML =
                `<option value="" disabled selected>Error al cargar estudiantes</option>`;
        });

    // ── Cargar solo los grupos del docente ────────────────────
    fetch(`http://127.0.0.1:5000/mis-grupos-inscripcion?id_docente=${idDocente}`)
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById("mins-grupo");
            if (data.success && data.grupos.length) {
                select.innerHTML = `<option value="" disabled selected>Selecciona un grupo...</option>`;
                data.grupos.forEach(g => {
                    const opt = document.createElement("option");
                    opt.value       = g.id_grupo;
                    opt.textContent = `${g.nombre_grupo} — ${g.materia_nombre}`;
                    select.appendChild(opt);
                });
            } else {
                select.innerHTML = `<option value="" disabled selected>Sin grupos asignados</option>`;
            }
        })
        .catch(() => {
            document.getElementById("mins-grupo").innerHTML =
                `<option value="" disabled selected>Error al cargar grupos</option>`;
        });

    // ── Envío ─────────────────────────────────────────────────
    document.getElementById("mins-form").addEventListener("submit", e => {
        e.preventDefault();

        const idEstudiante = document.getElementById("mins-estudiante").value;
        const idGrupo      = document.getElementById("mins-grupo").value;

        if (!idEstudiante || !idGrupo) {
            alert("Por favor selecciona el estudiante y el grupo.");
            return;
        }

        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());

        const payload = {
            id_usuario:          parseInt(idEstudiante),
            id_grupo:            parseInt(idGrupo),
            id_usuario_registro: idDocente,
            fecha_inscripcion:   ahora.toISOString().slice(0, 16),
            observacion:         document.getElementById("mins-observacion").value.trim() || null,
        };

        const btn = document.querySelector("#mins-form button[type='submit']");
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-rounded">hourglass_top</span> Guardando...`;

        fetch("http://127.0.0.1:5000/inscripciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                alert("Inscripción registrada correctamente.");
                document.getElementById("mins-form").reset();
            } else {
                alert(data.error || data.mensaje || "No se pudo registrar la inscripción.");
            }
        })
        .catch(() => alert("Error al conectar con el servidor."))
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar Inscripción`;
        });
    });
}


// ============================================================
//  Panel del Maestro: Ver Inscripciones
// ============================================================
function renderViewMaestroVerInscripciones(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idDocente     = usuarioActivo.id;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">list_alt</span> Mis Inscripciones</h1>
            <p>Consulta las inscripciones de los estudiantes en tus grupos.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="mins-search"
                    placeholder="Buscar por estudiante, grupo o estado..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="mins-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th>Carnet</th>
                            <th>Grupo</th>
                            <th>Fecha</th>
                            <th>Observación</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="mins-tbody"></tbody>
                </table>
                <div id="mins-empty" class="empty-state">Cargando inscripciones...</div>
            </div>
        </div>

        <!-- MODAL EDITAR -->
        <div id="mins-modal-overlay" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:580px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Inscripción</h3>
                    <button id="mins-modal-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="mins-edit-form" novalidate>
                    <input type="hidden" id="mins-edit-id" />

                    <!-- Estudiante — solo lectura -->
                    <div class="form-group">
                        <label>Estudiante</label>
                        <input type="text" id="mins-edit-estudiante" class="form-input-full" disabled
                            style="background:#f5f5f5; color:#888; cursor:not-allowed;" />
                    </div>

                    <!-- Grupo y Estado -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Grupo <span class="req">*</span></label>
                            <select id="mins-edit-grupo" required class="form-select">
                                <option value="" disabled>Cargando grupos...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Estado <span class="req">*</span></label>
                            <select id="mins-edit-estado" required class="form-select">
                                <option value="ACTIVA">Activa</option>
                                <option value="RETIRADA">Retirada</option>
                                <option value="FINALIZADA">Finalizada</option>
                                <option value="GRADUADA">Graduada</option>
                            </select>
                        </div>
                    </div>

                    <!-- Observación -->
                    <div class="form-group">
                        <label>Observación <span class="opt">(opcional)</span></label>
                        <input type="text" id="mins-edit-observacion" autocomplete="off"
                            maxlength="255" class="form-input-full"
                            placeholder="Ej. Cambio de grupo autorizado" />
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" id="mins-modal-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const tbody  = document.getElementById("mins-tbody");
    const table  = document.getElementById("mins-table");
    const empty  = document.getElementById("mins-empty");
    const search = document.getElementById("mins-search");
    const overlay  = document.getElementById("mins-modal-overlay");
    const editForm = document.getElementById("mins-edit-form");

    let inscripciones = [];
    let misGrupos     = [];

    // ── Badges de estado ──────────────────────────────────────
    const estadoConfig = {
        ACTIVA:     { color: "#1a8a4a", bg: "#e6f9f0", icon: "check_circle"     },
        RETIRADA:   { color: "#c0392b", bg: "#fdecea", icon: "cancel"           },
        FINALIZADA: { color: "#7f8c8d", bg: "#f0f0f0", icon: "task_alt"         },
        GRADUADA:   { color: "#8e44ad", bg: "#f5eef8", icon: "workspace_premium" }
    };

    function badgeEstado(estado) {
        const cfg = estadoConfig[estado] || estadoConfig.ACTIVA;
        return `<span style="
            display:inline-flex; align-items:center; gap:4px;
            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
            background:${cfg.bg}; color:${cfg.color};
        ">
            <span class="material-symbols-rounded" style="font-size:0.85rem;">${cfg.icon}</span>
            ${estado.charAt(0) + estado.slice(1).toLowerCase()}
        </span>`;
    }

    function formatFecha(dt) {
        if (!dt) return "—";
        return new Date(dt).toLocaleDateString("es-SV", {
            day: "2-digit", month: "short", year: "numeric"
        });
    }

    // ── Renderizar tabla ──────────────────────────────────────
    function renderTabla(lista) {
        tbody.innerHTML = "";
        if (lista.length === 0) {
            empty.style.display = "block";
            empty.textContent   = "No hay inscripciones en tus grupos.";
            table.style.display = "none";
            return;
        }
        empty.style.display = "none";
        table.style.display = "table";

        lista.forEach(ins => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${ins.estudiante_nombre || "—"}</td>
                <td style="font-size:0.85rem; color:#888;">${ins.carnet || "—"}</td>
                <td><span class="subject-tag">${ins.nombre_grupo || "—"}</span></td>
                <td style="font-size:0.85rem;">${formatFecha(ins.fecha_inscripcion)}</td>
                <td style="max-width:160px; white-space:nowrap; overflow:hidden;
                    text-overflow:ellipsis; font-size:0.85rem; color:#777;">
                    ${ins.observacion || "<span style='color:#bbb;'>—</span>"}
                </td>
                <td style="text-align:center;">${badgeEstado(ins.estado)}</td>
                <td style="text-align:center;">
                    <button class="btn-icon btn-edit-mins" data-id="${ins.id_inscripcion}" title="Editar">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".btn-edit-mins").forEach(btn => {
            btn.addEventListener("click", () => {
                const ins = inscripciones.find(i => i.id_inscripcion == btn.dataset.id);
                if (ins) abrirModal(ins);
            });
        });
    }

    // ── Filtrado ──────────────────────────────────────────────
    search.addEventListener("input", () => {
        const q = search.value.toLowerCase().trim();
        renderTabla(q
            ? inscripciones.filter(i =>
                (i.estudiante_nombre || "").toLowerCase().includes(q) ||
                (i.nombre_grupo      || "").toLowerCase().includes(q) ||
                (i.estado            || "").toLowerCase().includes(q)
            )
            : [...inscripciones]
        );
    });

    // ── Modal ─────────────────────────────────────────────────
    function poblarGruposModal(idGrupoSel) {
        const select = document.getElementById("mins-edit-grupo");
        select.innerHTML = "";
        misGrupos.forEach(g => {
            const opt = document.createElement("option");
            opt.value       = g.id_grupo;
            opt.textContent = `${g.nombre_grupo} — ${g.materia_nombre}`;
            if (g.id_grupo == idGrupoSel) opt.selected = true;
            select.appendChild(opt);
        });
    }

    function abrirModal(ins) {
        document.getElementById("mins-edit-id").value          = ins.id_inscripcion;
        document.getElementById("mins-edit-estudiante").value  = ins.estudiante_nombre;
        document.getElementById("mins-edit-estado").value      = ins.estado;
        document.getElementById("mins-edit-observacion").value = ins.observacion || "";
        poblarGruposModal(ins.id_grupo);
        overlay.style.display = "flex";
    }

    function cerrarModal() {
        overlay.style.display = "none";
        editForm.reset();
    }

    document.getElementById("mins-modal-close").addEventListener("click",  cerrarModal);
    document.getElementById("mins-modal-cancel").addEventListener("click", cerrarModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

    // ── Guardar edición ───────────────────────────────────────
    editForm.addEventListener("submit", e => {
        e.preventDefault();

        const idIns  = document.getElementById("mins-edit-id").value;
        const idGrupo = document.getElementById("mins-edit-grupo").value;
        const estado  = document.getElementById("mins-edit-estado").value;

        if (!idGrupo || !estado) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const datos = {
            id_grupo:            parseInt(idGrupo),
            id_usuario_registro: idDocente,
            estado:              estado,
            observacion:         document.getElementById("mins-edit-observacion").value.trim() || null,
        };

        fetch(`http://127.0.0.1:5000/inscripciones/${idIns}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                alert("Inscripción actualizada correctamente.");
                cerrarModal();
                cargarInscripciones();
            } else {
                alert(data.error || data.mensaje || "No se pudo actualizar.");
            }
        })
        .catch(() => alert("Error al conectar con el servidor."));
    });

    // ── Carga inicial ─────────────────────────────────────────
    function cargarInscripciones() {
        fetch(`http://127.0.0.1:5000/inscripciones-mis-grupos?id_docente=${idDocente}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    inscripciones = data.inscripciones || [];
                    renderTabla(inscripciones);
                } else {
                    empty.textContent = "No se pudieron cargar las inscripciones.";
                }
            })
            .catch(() => { empty.textContent = "Error al conectar con el servidor."; });
    }

    // Cargar grupos del docente para el modal
    fetch(`http://127.0.0.1:5000/mis-grupos-inscripcion?id_docente=${idDocente}`)
        .then(r => r.json())
        .then(data => { if (data.success) misGrupos = data.grupos || []; })
        .catch(() => {});

    cargarInscripciones();
}