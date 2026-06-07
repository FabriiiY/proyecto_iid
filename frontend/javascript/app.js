// ============================================================
//  app.js — Punto de entrada de la SPA
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. SESIÓN
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        window.location.href = "../html/login-Marcacion.html";
        return;
    }

    const rol       = usuarioActivo.rol;
    const esAdmin   = rol === 1;
    const esMaestro = rol === 2;

    window.SAMI = { usuario: usuarioActivo, rol, esAdmin, esMaestro };

    // 2. HEADER — nombre, avatar e iniciales
    const nombreCompleto = [
        usuarioActivo.primer_nombre,
        usuarioActivo.segundo_nombre,
        usuarioActivo.primer_apellido,
        usuarioActivo.segundo_apellido
    ].filter(Boolean).join(" ");
    document.getElementById("user-name").textContent = nombreCompleto;

    const avatarCircle = document.getElementById("avatar-circle");

    // Foto guardada o inicial
    const fotoPerfil = usuarioActivo.foto_perfil;
    if (fotoPerfil) {
        avatarCircle.style.backgroundImage = `url(${fotoPerfil})`;
        avatarCircle.style.backgroundSize  = "cover";
        avatarCircle.style.backgroundPosition = "center";
        avatarCircle.textContent = "";
    } else {
        avatarCircle.textContent = usuarioActivo.nombre.charAt(0).toUpperCase();
    }

    // Etiqueta de rol legible
    const rolesLabel = { 1: "Administrador", 2: "Maestro", 3: "Estudiante" };
    const rolLabel   = rolesLabel[rol] || "Usuario";

    // Badge secundario (carnet para estudiante/maestro, rol para admin)
    const badgeHTML = esAdmin
        ? `<span class="pd-badge pd-badge-role">${rolLabel}</span>`
        : `<span class="pd-badge pd-badge-carnet">Carnet: ${usuarioActivo.carnet || "—"}</span>`;

    // Inyectar dropdown en el top-bar (justo después del avatar)
    const userInfo = document.querySelector(".user-info");
    userInfo.style.position = "relative";
    userInfo.style.cursor   = "pointer";

    const dropdown = document.createElement("div");
    dropdown.id        = "profile-dropdown";
    dropdown.className = "profile-dropdown";
    dropdown.innerHTML = `
        <div class="pd-header">
            <div class="pd-avatar" id="pd-avatar-img">${fotoPerfil
                ? `<img src="${fotoPerfil}" alt="Foto de perfil" />`
                : `<span>${usuarioActivo.nombre.charAt(0).toUpperCase()}</span>`
            }</div>
            <div class="pd-info">
                <strong class="pd-name">${nombreCompleto}</strong>
                <span class="pd-email">${usuarioActivo.correoInstitucional || usuarioActivo.correoPersonal || ""}</span>
                ${badgeHTML}
            </div>
        </div>
        <div class="pd-divider"></div>
        <button class="pd-btn" id="pd-btn-perfil">
            <span class="material-symbols-rounded">account_circle</span> Mi Perfil
        </button>
        <button class="pd-btn pd-btn-logout" id="pd-btn-logout">
            <span class="material-symbols-rounded">logout</span> Cerrar Sesión
        </button>
    `;
    userInfo.appendChild(dropdown);

    // Toggle dropdown al hacer clic en user-info
    userInfo.addEventListener("click", e => {
        e.stopPropagation();
        dropdown.classList.toggle("open");
    });

    // Cerrar al hacer clic fuera
    document.addEventListener("click", () => dropdown.classList.remove("open"));

    // Botón Mi Perfil dentro del dropdown
    document.getElementById("pd-btn-perfil").addEventListener("click", e => {
        e.stopPropagation();
        dropdown.classList.remove("open");
        SAMI.navegar("mi-perfil");
    });

    // Logout desde dropdown
    document.getElementById("pd-btn-logout").addEventListener("click", e => {
        e.stopPropagation();
        localStorage.removeItem("usuarioActivo");
        window.location.href = "../html/login-Marcacion.html";
    });

    // Función global para refrescar el avatar cuando se cambia la foto
    SAMI.refrescarAvatar = function(dataUrl) {
        // Top-bar
        if (dataUrl) {
            avatarCircle.style.backgroundImage    = `url(${dataUrl})`;
            avatarCircle.style.backgroundSize     = "cover";
            avatarCircle.style.backgroundPosition = "center";
            avatarCircle.textContent = "";
        } else {
            avatarCircle.style.backgroundImage = "";
            avatarCircle.textContent = usuarioActivo.nombre.charAt(0).toUpperCase();
        }
        // Dropdown
        const pdAvatar = document.getElementById("pd-avatar-img");
        if (pdAvatar) {
            pdAvatar.innerHTML = dataUrl
                ? `<img src="${dataUrl}" alt="Foto de perfil" />`
                : `<span>${usuarioActivo.nombre.charAt(0).toUpperCase()}</span>`;
        }
    };

    // 3. SIDEBAR ITEMS SEGÚN ROL
    const navItemsEstudiante = [
        { id: "nav-horarios", icon: "today", label: "Clases", view: "horarios" },
        { id: "nav-reportes", icon: "history", label: "Reportes",
          dropdown: [
            { label: "Asistencia Diaria", href: "WIP.html" },
            { label: "Resumen Mensual",   href: "WIP.html" }
          ]
        }
    ];

    const navItemsMaestro = [
        // Mis Horarios
        { id: "nav-mis-horarios", icon: "select_check_box", label: "Listas", view: "maestro-alumnos" },

        // Inscripciones
        { id: "nav-inscripciones", icon: "how_to_reg", label: "Inscripción",
        dropdown: [
            { label: "Registrar Inscripción", view: "maestro-inscripcion-registrar" },
            { label: "Ver Inscripciones",     view: "maestro-inscripcion-ver"       }
        ]
        },

        // Vistas
        { id: "nav-maestro-info", icon: "visibility", label: "Información",
          dropdown: [
            { label: "Clases del Grupo", view: "maestro-clase-grupo"},
            { label: "Ver Materias", view: "maestro-materias"},
            { label: "Ver Clases", view: "maestro-clases"},
            { label: "Ver Ciclos", view: "maestro-ciclos"},
            { label: "Ver Aulas", view: "maestro-aulas"},
            { label: "Ver Horarios", view: "maestro-horarios"}
          ]
        },
    ];

    const navItemsAdmin = [
        // Gestión de Usuarios
        { id: "nav-gestion-usuarios", icon: "manage_accounts", label: "Gestión de Usuarios",
          dropdown: [
            { label: "Registrar Usuario",    view: "admin-usuarios"    },
            { label: "Ver Usuarios",         view: "admin-registrados" }
          ]
        },

        // Inscripciones
        { id: "nav-inscripciones", icon: "how_to_reg", label: "Inscripción",
          dropdown: [
            { label: "Registrar Inscripción",  view: "inscripcion-registrar" },
            { label: "Ver Inscripciones",      view: "inscripcion-ver"       }
          ]
        },

        // Aulas
        { id: "nav-aulas", icon: "door_front", label: "Aulas",
          dropdown: [
            { label: "Registrar Aula", view: "aula-registrar" },
            { label: "Ver Aulas",      view: "aula-ver"       }
          ]
        },

        // Carreras
        { id: "nav-carreras", icon: "school", label: "Carreras",
          dropdown: [
            { label: "Registrar Carrera", view: "carrera-registrar" },
            { label: "Ver Carreras",      view: "carrera-ver"       },
            { label: "Asignar Materia",        view: "carrera-mat-asignar" },
            { label: "Materias de Carrera",view: "carrera-mat-ver"     }
          ]
        },

        // Ciclos y Periodos
        { id: "nav-ciclos", icon: "date_range", label: "Ciclos y Periodos",
          dropdown: [
            { label: "Registrar Periodo",    view: "periodo-registrar"  },
            { label: "Registrar Tipo Ciclo", view: "tipo-ciclo-registrar"},
            { label: "Registrar Ciclo",      view: "ciclo-registrar"    },
            { label: "Ver Registros",        view: "ciclo-ver"          }
          ]
        },

        // Tipo de Clase
        { id: "nav-tipo-clase", icon: "tune", label: "Tipo de Clase",
          dropdown: [
            { label: "Modalidad",        view: "modalidad"      },
            { label: "Tipo de Programa", view: "tipo-programa"  }
          ]
        },

        // Materias y Clases
        { id: "nav-materias", icon: "library_books", label: "Materias y Clases",
          dropdown: [
            { label: "Registrar Materia",         view: "materias-agregar" },
            { label: "Ver Materias",              view: "materias-ver"     },
            { label: "Registrar Clase",           view: "clase-registrar"  },
            { label: "Ver Clases",                view: "clase-ver"        }
          ]
        },

        // Grupos de Estudiantes
        { id: "nav-grupos", icon: "group_work", label: "Grupos de Estudiantes",
          dropdown: [
            { label: "Crear Grupo", view: "grupo-registrar" },
            { label: "Ver Grupos",  view: "grupo-ver"       },
            { label: "Clase del Grupo",     view: "grupo-clase-asignar" },
            { label: "Ver Clases de Grupo", view: "grupo-clase-ver"     }
          ]
        },

        // Control de Horarios
        { id: "nav-horarios-admin", icon: "schedule", label: "Control de Horarios",
          dropdown: [
            { label: "Asignar Horario",       view: "horario-asignar"    },
            { label: "Ver Horarios Globales", view: "horario-ver-global" }
          ]
        }
    ];

    const items = esAdmin ? navItemsAdmin : esMaestro ? navItemsMaestro : navItemsEstudiante;

    // 4. CONSTRUIR SIDEBAR
    const primaryNav = document.getElementById("sidebar-primary-nav");

    items.forEach(item => {
        const li = document.createElement("li");
        li.className = "nav-item" + (item.dropdown ? " dropdown-container" : "");

        if (item.dropdown) {
            li.innerHTML = `
                <a href="#" class="nav-link dropdown-toggle" id="${item.id}">
                    <span class="material-symbols-rounded">${item.icon}</span>
                    <span class="nav-label">${item.label}</span>
                    <span class="dropdown-icon material-symbols-rounded">keyboard_arrow_down</span>
                </a>
                <ul class="dropdown-menu">
                    ${item.dropdown.map(d => d.view
                        ? `<li><a href="#" class="dropdown-link" data-view="${d.view}">${d.label}</a></li>`
                        : `<li><a href="${d.href}" class="dropdown-link">${d.label}</a></li>`
                    ).join("")}
                </ul>`;
        } else if (item.href) {
            li.innerHTML = `
                <a href="${item.href}" class="nav-link" id="${item.id}">
                    <span class="material-symbols-rounded">${item.icon}</span>
                    <span class="nav-label">${item.label}</span>
                </a>`;
        } else {
            li.innerHTML = `
                <a href="#" class="nav-link" id="${item.id}" data-view="${item.view}">
                    <span class="material-symbols-rounded">${item.icon}</span>
                    <span class="nav-label">${item.label}</span>
                </a>`;
        }

        primaryNav.appendChild(li);
    });

    // 5. LISTENERS DE NAVEGACIÓN — directo en cada link
    document.querySelectorAll("#sidebar-primary-nav a[data-view]").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            SAMI.navegar(this.getAttribute("data-view"));
        });
    });

    // 6. DROPDOWNS
    const sidebar = document.querySelector(".sidebar");

    document.getElementById("logo-trigger").addEventListener("click", e => {
        e.preventDefault();
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle("open-mobile");
        } else {
            sidebar.classList.toggle("collapsed");
            if (sidebar.classList.contains("collapsed")) cerrarDropdowns();
        }
    });

    document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
        toggle.addEventListener("click", e => {
            e.preventDefault();
            if (sidebar.classList.contains("collapsed") && window.innerWidth > 768)
                sidebar.classList.remove("collapsed");

            const container   = toggle.closest(".dropdown-container");
            const menu        = container.querySelector(".dropdown-menu");
            const estaAbierto = container.classList.contains("open");

            cerrarDropdowns(container);

            if (!estaAbierto) {
                container.classList.add("open");
                menu.style.height = `${menu.scrollHeight}px`;
            } else {
                container.classList.remove("open");
                menu.style.height = "0px";
            }
        });
    });

    function cerrarDropdowns(excepto = null) {
        document.querySelectorAll(".dropdown-container").forEach(c => {
            if (c !== excepto) {
                c.classList.remove("open");
                const m = c.querySelector(".dropdown-menu");
                if (m) m.style.height = "0px";
            }
        });
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) sidebar.classList.remove("open-mobile");
        else { sidebar.classList.remove("collapsed"); cerrarDropdowns(); }
    });

    // 7. LOGOUT — sidebar secondary-nav (Configuración dropdown)
    const logoutSidebar = document.getElementById("logout-btn");
    if (logoutSidebar) {
        logoutSidebar.addEventListener("click", e => {
            e.preventDefault();
            localStorage.removeItem("usuarioActivo");
            window.location.href = "../html/login-Marcacion.html";
        });
    }

    // 8. ROUTER — definido aquí mismo para evitar problemas de orden de carga
    const vistas = {
        //Vista del estudiante
        "horarios":          () => renderViewHorarios(main),
        //Submenú administación de usuarios
        "admin-usuarios":    () => renderViewAdminUsuarios(main),
        "admin-registrados": () => renderViewAdminRegistrados(main),
        //Submení maestro ver alumnos creo xd
        "maestro-alumnos":   () => renderViewMaestroAlumnos(main),
        //Submenú materias-clase
        "materias-agregar":  () => renderViewMateriasAgregar(main),
        "materias-ver":      () => renderViewMateriasVer(main),
        "clase-registrar":   () => renderViewRegistrarClase(main),
        "clase-ver":         () => renderViewVerClases(main),
        //Submenú perfil
        "mi-perfil":         () => renderViewMiPerfil(main),
        //Submenú tipo-clase
        "modalidad":         () => renderViewModalidad(main),
        "tipo-programa":     () => renderViewTipoPrograma(main),
        //Submenú ciclo-periodos
        "periodo-registrar":    () => renderViewRegistrarPeriodo(main),
        "tipo-ciclo-registrar": () => renderViewRegistrarTipoCiclo(main),
        "ciclo-registrar":      () => renderViewRegistrarCiclo(main),
        "ciclo-ver":         () => renderViewVerCiclos(main),
        //Submenú aulas
        "aula-registrar": () => renderViewRegistrarAula(main),
        "aula-ver":       () => renderViewVerAulas(main),
        //Submenú carreras
        "carrera-registrar": () => renderViewRegistrarCarrera(main),
        "carrera-ver":       () => renderViewVerCarreras(main),
        "carrera-mat-asignar":  () => renderViewAsignarMateriaCarrera(main),
        "carrera-mat-ver":      () => renderViewVerMateriasCarrera(main),
        //Submenú grupos
        "grupo-registrar": () => renderViewRegistrarGrupo(main),
        "grupo-ver":       () => renderViewVerGrupos(main),
        "grupo-clase-asignar": () => renderViewAsignarClaseGrupo(main),
        "grupo-clase-ver":     () => renderViewVerClasesGrupo(main),
        //Submenú inscripciones
        "inscripcion-registrar": () => renderViewRegistrarInscripcion(main),
        "inscripcion-ver":       () => renderViewVerInscripciones(main),
        //Submenú control de horarios
        "horario-asignar":   () => renderViewAsignarHorario(main),
        "horario-ver-global":() => renderViewVerHorariosGlobales(main),
        //Submenu inscripciones de alumnos para maestros
        "maestro-inscripcion-registrar": () => renderViewMaestroInscripcion(main),
        "maestro-inscripcion-ver":       () => renderViewMaestroVerInscripciones(main),
        // Vistas de docente
        "maestro-clase-grupo": () => renderViewMaestroClaseGrupo(main),
        "maestro-materias": () => renderViewMaestroMaterias(main),
        "maestro-clases": () => renderViewMaestroClases(main),
        "maestro-ciclos": () => renderViewMaestroCiclos(main),
        "maestro-aulas": () => renderViewMaestroAulas(main),
        "maestro-horarios": () => renderViewMaestroHorarios(main),
    };

    const main = document.getElementById("main-content");

    SAMI.navegar = function(viewId) {
        const fn = vistas[viewId];
        if (!fn) return;

        main.innerHTML = "";

        // Marcar activo en nav-links directos
        document.querySelectorAll("#sidebar-primary-nav a[data-view]").forEach(link => {
            link.classList.toggle("active", link.getAttribute("data-view") === viewId);
        });

        fn();
    };


    // 9. PANTALLA DE BIENVENIDA
    function renderViewBienvenida() {
        const primerNombre = usuarioActivo.primerNombre || usuarioActivo.nombre || "Usuario";
        const panelLabel   = esAdmin ? "Administrador" : esMaestro ? "Docente" : "Estudiante";
        const iconoPanel   = esAdmin ? "admin_panel_settings" : esMaestro ? "school" : "menu_book";

        const accesosRapidos = esAdmin
            ? [
                { icon: "manage_accounts", label: "Agregar Usuario", view: "admin-usuarios"    },
                { icon: "group",           label: "Ver Usuarios",     view: "admin-registrados" },
                { icon: "library_books",   label: "Agregar Materia",  view: "materias-agregar"  },
              ]
            : esMaestro
            ? [
                { id: "nav-mis-horarios", icon: "select_check_box", label: "Listas", view: "maestro-alumnos" },
                { label: "Ver Inscripciones", icon: "list_alt_check",    view: "maestro-inscripcion-ver"       }
              ]
            : [
                { id: "nav-horarios", icon: "today", label: "Clases", view: "horarios" },
              ];

        main.innerHTML = `
            <div style="
                min-height: calc(100vh - var(--header-height) - 80px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 40px 20px;
                gap: 32px;
            ">
                <div style="
                    width: 100px; height: 100px;
                    border-radius: 50%;
                    background: #eef1f9;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 20px rgba(59,89,152,0.12);
                ">
                    <span class="material-symbols-rounded" style="font-size: 3rem; color: var(--azul-sami);">
                        ${iconoPanel}
                    </span>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    <h1 style="font-size:2rem; color:var(--azul-sami); font-weight:700; line-height:1.2;">
                        ¡Bienvenido, ${primerNombre}!
                    </h1>
                    <p style="color:#888; font-size:1rem;">
                        Ingresaste como <strong style="color:var(--texto);">${panelLabel}</strong>.
                        Selecciona una opción del menú para comenzar.
                    </p>
                </div>

                <div style="display:flex; flex-wrap:wrap; gap:16px; justify-content:center; margin-top:8px;">
                    ${accesosRapidos.map(a => `
                        <button data-view="${a.view}" style="
                            display: flex; flex-direction: column; align-items: center; gap: 10px;
                            padding: 24px 32px;
                            background: white;
                            border: 1px solid var(--borde);
                            border-radius: 16px;
                            cursor: pointer;
                            font-family: inherit;
                            font-size: 0.9rem;
                            font-weight: 600;
                            color: var(--texto);
                            box-shadow: 0 4px 16px rgba(0,0,0,0.05);
                            transition: transform 0.2s, box-shadow 0.2s;
                            min-width: 140px;
                        "
                        onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(59,89,152,0.15)';"
                        onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.05)';">
                            <span class="material-symbols-rounded" style="font-size:2rem; color:var(--azul-sami);">${a.icon}</span>
                            ${a.label}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;

        main.querySelectorAll("button[data-view]").forEach(btn => {
            btn.addEventListener("click", () => SAMI.navegar(btn.dataset.view));
        });
    }

    // Vista inicial -> bienvenida
    renderViewBienvenida();
});