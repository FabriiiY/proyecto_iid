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
    const nombreCompleto = `${usuarioActivo.nombre} ${usuarioActivo.apellido}`;
    document.getElementById("user-name").textContent = nombreCompleto;

    const avatarCircle = document.getElementById("avatar-circle");

    // Foto guardada o inicial
    const fotoPerfil = localStorage.getItem(`sami_foto_${usuarioActivo.correoInstitucional}`);
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
        { id: "nav-horarios",   icon: "calendar_month", label: "Mis Horarios", view: "horarios" },
        { id: "nav-reportes",   icon: "history",        label: "Reportes",
          dropdown: [
            { label: "Asistencia Diaria", href: "WIP.html" },
            { label: "Resumen Mensual",   href: "WIP.html" }
          ]
        }
    ];

    const navItemsMaestro = [
        { id: "nav-maestro-alumnos", icon: "groups", label: "Mis Alumnos", view: "maestro-alumnos" },
        { id: "nav-materias-maestro", icon: "library_books", label: "Materias",
          dropdown: [
            { label: "Agregar Materia", view: "materias-agregar" },
            { label: "Ver Materias",    view: "materias-ver"     }
          ]
        }
    ];

    const navItemsAdmin = [
        { id: "nav-admin-usuarios",    icon: "manage_accounts", label: "Admin Usuarios", view: "admin-usuarios"    },
        { id: "nav-admin-registrados", icon: "group",           label: "Usuarios Registrados",        view: "admin-registrados" },
        { id: "nav-materias-admin",    icon: "library_books",   label: "Materias",
          dropdown: [
            { label: "Agregar Materia", view: "materias-agregar" },
            { label: "Ver Materias",    view: "materias-ver"     }
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

    // 7. LOGOUT — manejado desde el dropdown del perfil (ver sección 2)
    // Se mantiene el botón de sidebar como fallback
    document.getElementById("logout-btn").addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("usuarioActivo");
        window.location.href = "../html/login-Marcacion.html";
    });

    // 8. ROUTER — definido aquí mismo para evitar problemas de orden de carga
    const vistas = {
        "horarios":          () => renderViewHorarios(main),
        "admin-usuarios":    () => renderViewAdminUsuarios(main),
        "admin-registrados": () => renderViewAdminRegistrados(main),
        "maestro-alumnos":   () => renderViewMaestroAlumnos(main),
        "materias-agregar":  () => renderViewMateriasAgregar(main),
        "materias-ver":      () => renderViewMateriasVer(main),
        "mi-perfil":         () => renderViewMiPerfil(main)
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
                { icon: "groups",        label: "Mis Alumnos",  view: "maestro-alumnos" },
                { icon: "library_books", label: "Ver Materias", view: "materias-ver"    },
              ]
            : [
                { icon: "calendar_month", label: "Mis Horarios", view: "horarios" },
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