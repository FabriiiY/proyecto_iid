// ============================================================
//  views/perfil.js — Vista "Mi Perfil"
// ============================================================
function renderViewMiPerfil(container) {

    const u         = SAMI.usuario;
    const esAdmin   = SAMI.esAdmin;
    const esMaestro = SAMI.esMaestro;
    const fotoKey   = `sami_foto_${u.correoInstitucional}`;
    const fotoActual = localStorage.getItem(fotoKey);

    const rolesLabel = { 1: "Administrador", 2: "Maestro", 3: "Estudiante" };
    const rolLabel   = rolesLabel[u.rol] || "Usuario";

    // Fila carnet/rol según el tipo de usuario
    const carnетFila = esAdmin
        ? `<div class="perfil-dato">
               <span class="material-symbols-rounded">badge</span>
               <div><small>Rol</small><p>${rolLabel}</p></div>
           </div>`
        : `<div class="perfil-dato">
               <span class="material-symbols-rounded">badge</span>
               <div><small>Carnet</small><p>${u.carnet || "—"}</p></div>
           </div>`;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">account_circle</span> Mi Perfil</h1>
            <p>Tu información personal y configuración de cuenta.</p>
        </div>

        <div class="perfil-layout">

            <!-- Columna izquierda: foto -->
            <div class="admin-card perfil-foto-card">
                <div class="perfil-avatar-wrap">
                    <div class="perfil-avatar" id="perfil-avatar-preview">
                        ${fotoActual
                            ? `<img src="${fotoActual}" alt="Foto de perfil" id="perfil-img" />`
                            : `<span id="perfil-inicial">${u.nombre.charAt(0).toUpperCase()}</span>`
                        }
                        <div class="perfil-avatar-overlay" id="perfil-avatar-trigger" title="Cambiar foto">
                            <span class="material-symbols-rounded">photo_camera</span>
                        </div>
                    </div>
                    <input type="file" id="perfil-file-input" accept="image/*" style="display:none;" />
                </div>
                <h2 class="perfil-nombre">${u.nombre} ${u.apellido || ""}</h2>
                <span class="subject-tag">${rolLabel}</span>

                <div class="perfil-foto-acciones">
                    <button class="btn-primary" id="btn-cambiar-foto" style="width:100%; margin-top:16px;">
                        <span class="material-symbols-rounded">upload</span> Cambiar Foto
                    </button>
                    <button class="btn-secondary" id="btn-quitar-foto" style="width:100%; margin-top:8px;
                        ${fotoActual ? "" : "display:none;"}">
                        <span class="material-symbols-rounded">delete</span> Quitar Foto
                    </button>
                </div>
            </div>

            <!-- Columna derecha: datos -->
            <div class="perfil-datos-col">

                <div class="admin-card">
                    <h3><span class="material-symbols-rounded">person</span> Información Personal</h3>
                    <div class="perfil-datos-grid">

                        <div class="perfil-dato">
                            <span class="material-symbols-rounded">account_circle</span>
                            <div>
                                <small>Nombre Completo</small>
                                <p>${[u.primerNombre, u.segundoNombre, u.primerApellido, u.segundoApellido].filter(Boolean).join(" ") || `${u.nombre} ${u.apellido || ""}`}</p>
                            </div>
                        </div>

                        ${carnетFila}

                        <div class="perfil-dato">
                            <span class="material-symbols-rounded">mail</span>
                            <div>
                                <small>Correo Institucional</small>
                                <p>${u.correoInstitucional || "—"}</p>
                            </div>
                        </div>

                        <div class="perfil-dato">
                            <span class="material-symbols-rounded">mail_outline</span>
                            <div>
                                <small>Correo Personal</small>
                                <p>${u.correoPersonal || "—"}</p>
                            </div>
                        </div>

                        <div class="perfil-dato">
                            <span class="material-symbols-rounded">phone_android</span>
                            <div>
                                <small>Teléfono Móvil</small>
                                <p>${u.telefonoMovil || "—"}</p>
                            </div>
                        </div>

                        ${u.telefonoFijo ? `
                        <div class="perfil-dato">
                            <span class="material-symbols-rounded">phone</span>
                            <div>
                                <small>Teléfono Fijo</small>
                                <p>${u.telefonoFijo}</p>
                            </div>
                        </div>` : ""}

                        ${u.genero ? `
                        <div class="perfil-dato">
                            <span class="material-symbols-rounded">wc</span>
                            <div>
                                <small>Género</small>
                                <p>${u.genero}</p>
                            </div>
                        </div>` : ""}

                        ${u.fechaNacimiento ? `
                        <div class="perfil-dato">
                            <span class="material-symbols-rounded">cake</span>
                            <div>
                                <small>Fecha de Nacimiento</small>
                                <p>${u.fechaNacimiento}</p>
                            </div>
                        </div>` : ""}

                    </div>
                </div>

            </div><!-- /perfil-datos-col -->
        </div><!-- /perfil-layout -->

        <!-- Toast de feedback -->
        <div id="perfil-toast" class="perfil-toast"></div>
    `;

    // ── Lógica de foto ──────────────────────────────────────
    const fileInput    = document.getElementById("perfil-file-input");
    const btnCambiar   = document.getElementById("btn-cambiar-foto");
    const btnQuitar    = document.getElementById("btn-quitar-foto");
    const avatarTrigger= document.getElementById("perfil-avatar-trigger");
    const preview      = document.getElementById("perfil-avatar-preview");
    const toast        = document.getElementById("perfil-toast");

    function mostrarToast(msg, tipo = "ok") {
        toast.textContent = msg;
        toast.className   = `perfil-toast perfil-toast-${tipo} show`;
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function aplicarFoto(dataUrl) {
        // Preview en la vista
        preview.innerHTML = `
            <img src="${dataUrl}" alt="Foto de perfil" id="perfil-img" />
            <div class="perfil-avatar-overlay" id="perfil-avatar-trigger-new" title="Cambiar foto">
                <span class="material-symbols-rounded">photo_camera</span>
            </div>`;
        document.getElementById("perfil-avatar-trigger-new")
            .addEventListener("click", () => fileInput.click());

        // Guardar y refrescar top-bar/dropdown
        localStorage.setItem(fotoKey, dataUrl);
        SAMI.refrescarAvatar(dataUrl);

        btnQuitar.style.display = "";
        mostrarToast("Foto actualizada correctamente.");
    }

    // Clic en overlay de la foto
    avatarTrigger?.addEventListener("click", () => fileInput.click());

    // Botón "Cambiar Foto"
    btnCambiar.addEventListener("click", () => fileInput.click());

    // Quitar foto
    btnQuitar.addEventListener("click", () => {
        localStorage.removeItem(fotoKey);
        SAMI.refrescarAvatar(null);
        const inicial = u.nombre.charAt(0).toUpperCase();
        preview.innerHTML = `
            <span id="perfil-inicial">${inicial}</span>
            <div class="perfil-avatar-overlay" id="perfil-avatar-trigger-new" title="Cambiar foto">
                <span class="material-symbols-rounded">photo_camera</span>
            </div>`;
        document.getElementById("perfil-avatar-trigger-new")
            .addEventListener("click", () => fileInput.click());
        btnQuitar.style.display = "none";
        mostrarToast("Foto eliminada.", "warn");
    });

    // Leer archivo
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        // Validar tamaño (máx 2 MB)
        if (file.size > 2 * 1024 * 1024) {
            mostrarToast("La imagen no puede superar los 2 MB.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = e => aplicarFoto(e.target.result);
        reader.readAsDataURL(file);
    });
}