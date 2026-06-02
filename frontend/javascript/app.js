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

    // 2. HEADER
    document.getElementById("user-name").textContent =
        `${usuarioActivo.nombre} ${usuarioActivo.apellido}`;
    document.getElementById("avatar-circle").textContent =
        usuarioActivo.nombre.charAt(0).toUpperCase();

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
        { id: "nav-maestro-alumnos", icon: "groups", label: "Mis Alumnos", view: "maestro-alumnos" }
    ];

    const navItemsAdmin = [
        { id: "nav-admin-usuarios",    icon: "manage_accounts", label: "Admin. Usuarios", view: "admin-usuarios"    },
        { id: "nav-admin-registrados", icon: "group",           label: "Usuarios Registrados",        view: "admin-registrados" },
        { id: "nav-materias",          icon: "library_books",   label: "Materias Disponibles",        href: "WIP.html"          }
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
                    ${item.dropdown.map(d =>
                        `<li><a href="${d.href}" class="dropdown-link">${d.label}</a></li>`
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

    // 7. LOGOUT
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
        "maestro-alumnos":   () => renderViewMaestroAlumnos(main)
    };

    const main = document.getElementById("main-content");

    SAMI.navegar = function(viewId) {
        const fn = vistas[viewId];
        if (!fn) return;

        main.innerHTML = "";

        document.querySelectorAll("#sidebar-primary-nav a[data-view]").forEach(link => {
            link.classList.toggle("active", link.getAttribute("data-view") === viewId);
        });

        fn();
    };

    // Vista inicial
    const vistaInicial = esAdmin ? "admin-usuarios" : esMaestro ? "maestro-alumnos" : "horarios";
    SAMI.navegar(vistaInicial);
});