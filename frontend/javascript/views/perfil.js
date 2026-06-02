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
                    <div class="perfil-avatar" id="perfil-avatar-preview" style="cursor:default;">
                        ${fotoActual
                            ? `<img src="${fotoActual}" alt="Foto de perfil" id="perfil-img" />`
                            : `<span id="perfil-inicial">${u.nombre.charAt(0).toUpperCase()}</span>`
                        }
                    </div>
                </div>
                <h2 class="perfil-nombre">${u.nombre} ${u.apellido || ""}</h2>
                <span class="subject-tag">${rolLabel}</span>
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
    `;
}