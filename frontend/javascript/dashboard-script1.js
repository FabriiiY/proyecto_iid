document.addEventListener("DOMContentLoaded", () => {
            const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo")); //cambio fabri 30 de mayor de 2026
            

if(!usuarioActivo){
    window.location.href ="../html/login.html";
    return;
}

let rolSistema = "estudiante";

if(usuarioActivo.rol === 1){
    rolSistema = "admin";
}

document.body.setAttribute(
    "data-role", rolSistema
);



            const userNameElement = document.getElementById("user-name");
            const avatarElement = document.getElementById("avatar-circle");

            // --- Lógica para probar el cambio de roles en el Front-End ---
            const roleSelector = document.getElementById("role-selector");
            if (roleSelector) {
                roleSelector.value = usuarioActivo.rol;
                
                roleSelector.addEventListener("change", (e) => {
                    const nuevoRol = e.target.value;
                    // Cambiamos el atributo data-role del body, esto oculta/muestra todo automáticamente con CSS
                    document.body.setAttribute('data-role', nuevoRol);
                    
                    // Solo para que se vea más real, cambiamos el nombre en la barra superior
                    if (nuevoRol === 'admin') {
                        userNameElement.textContent = "Admin Sistema";
                        avatarElement.textContent = "A";
                    } else {
                        userNameElement.textContent = "Usuario SAMI";
                        avatarElement.textContent = "U";
                    }
                    
                    // Cerramos los dropdowns si quedaron abiertos al cambiar de rol
                    cerrarTodosLosDropdowns();
                });
            }
            // ------------------------------------------------------------------

            if (userNameElement && avatarElement) {
            const nombreCompleto = usuarioActivo.nombre + " " + usuarioActivo.apellido;
            userNameElement.textContent = nombreCompleto;
            avatarElement.textContent = usuarioActivo.nombre.charAt(0).toUpperCase();
        }

            const logoTrigger = document.getElementById("logo-trigger");
            const sidebar = document.querySelector(".sidebar");
            const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

            if (logoTrigger && sidebar) {
                logoTrigger.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (window.innerWidth <= 768) {
                        sidebar.classList.toggle("open-mobile");
                    } else {
                        sidebar.classList.toggle("collapsed");
                        if (sidebar.classList.contains("collapsed")) cerrarTodosLosDropdowns();
                    }
                });
            }

            dropdownToggles.forEach(toggle => {
                toggle.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (sidebar.classList.contains("collapsed") && window.innerWidth > 768) {
                        sidebar.classList.remove("collapsed");
                    }
                    const container = toggle.closest(".dropdown-container");
                    const menu = container.querySelector(".dropdown-menu");
                    const estaAbierto = container.classList.contains("open");

                    cerrarTodosLosDropdowns(container);

                    if (!estaAbierto) {
                        container.classList.add("open");
                        menu.style.height = `${menu.scrollHeight}px`;
                    } else {
                        container.classList.remove("open");
                        menu.style.height = "0px";
                    }
                });
            });

            function cerrarTodosLosDropdowns(exceptoEste = null) {
                document.querySelectorAll(".dropdown-container").forEach(item => {
                    if (item !== exceptoEste) {
                        item.classList.remove("open");
                        const m = item.querySelector(".dropdown-menu");
                        if (m) m.style.height = "0px";
                    }
                });
            }

            window.addEventListener("resize", () => {
                if (window.innerWidth > 768) {
                    sidebar.classList.remove("open-mobile");
                } else {
                    sidebar.classList.remove("collapsed");
                    cerrarTodosLosDropdowns();
                }
            });

            // Iniciar lógica del nuevo carrusel
            initMarcacionCarousel();

            // Iniciar lógica del Panel de Administrador
            initAdminPanel();
        });

//ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA


const logoutBtn =
    document.getElementById("logout-btn");

if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "usuarioActivo"
            );

            window.location.href =
                "../html/login.html";

        }
    );

}
