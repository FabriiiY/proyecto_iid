// ============================================================
//  views/perfil.js — Vista "Mi Perfil"
//
//  Campos que vienen del backend en usuarioActivo:
//  { id, nombre, apellido, correo, rol,
//    primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
//    correo_institucional, correo_personal,
//    telefono_movil, telefono_fijo,
//    fecha_nacimiento, sexo,
//    dui, dui_tipo,
//    carnet, carnet_minoridad,
//    direccion, foto_perfil, estado }
//
//  TODO — cuando el backend exponga GET /usuarios/:id con todos
//  los campos extendidos, reemplazar la línea marcada abajo.
// ============================================================
function renderViewMiPerfil(container) {

    const rolesLabel = { 1: "Administrador", 2: "Maestro", 3: "Estudiante" };

    // ── Mostrar skeleton mientras carga ──────────────────────
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">account_circle</span> Mi Perfil</h1>
            <p>Tu información personal y configuración de cuenta.</p>
        </div>
        <div style="text-align:center; padding:60px; color:#aaa;">
            <span class="material-symbols-rounded" style="font-size:2rem;">hourglass_top</span>
            <p style="margin-top:8px;">Cargando perfil...</p>
        </div>
    `;

    // ── TODO: reemplazar con fetch() GET /usuarios/:id ────────
    // fetch(`https://proyectoiid-production.up.railway.app/usuarios/${SAMI.usuario.id}`)
    //     .then(res => res.json())
    //     .then(data => { if (data.success) renderPerfil(data.usuario); })
    //     .catch(() => renderPerfil(SAMI.usuario));
    //
    // Por ahora usamos directamente el usuarioActivo del localStorage:

    fetch(`https://proyectoiid-production.up.railway.app/usuarios/${SAMI.usuario.id}`)
    .then(res => res.json())
    .then(data => {

        if(data.success){

            renderPerfil(data.usuario, container);

        }else{

            alert(data.mensaje);

        }

    })
    .catch(error => {

        console.error(error);

        alert("Error al cargar perfil");

    });

    // ── Función principal de render ───────────────────────────
    function renderPerfil(u, cont) {

        const rolLabel = rolesLabel[u.id_rol] || "Usuario";

        // Nombre completo: intentar con campos extendidos, fallback al básico
        const nombreCompleto = [
            u.primer_nombre, u.segundo_nombre,
            u.primer_apellido, u.segundo_apellido
        ].filter(Boolean).join(" ") || `${u.nombre || ""} ${u.apellido || ""}`.trim();

        // Foto: prioridad → campo del backend → localStorage (legacy)
        const fotoKey    = `sami_foto_${u.correo_institucional || u.correo}`;
        const fotoFuente = u.foto_perfil || localStorage.getItem(fotoKey);

        // Formatear DUI con guión si viene limpio (9 dígitos)
        function fmtDui(raw) {
            if (!raw) return "—";
            const d = raw.replace(/\D/g, "");
            return d.length === 9 ? d.slice(0,8) + "-" + d.slice(8) : raw;
        }

        // Formatear teléfono con guión si viene sin él (8 dígitos)
        function fmtTel(raw) {
            if (!raw) return null;
            const d = raw.replace(/\D/g, "");
            return d.length === 8 ? d.slice(0,4) + "-" + d.slice(4) : raw;
        }

        const duiLabel = u.dui_tipo === "RESPONSABLE"
            ? "DUI del Responsable"
            : "DUI";

        const telMovil = fmtTel(u.telefono_movil);
        const telFijo  = fmtTel(u.telefono_fijo);

        cont.innerHTML = `
            <div class="dashboard-header">
                <h1><span class="material-symbols-rounded">account_circle</span> Mi Perfil</h1>
                <p>Tu información personal y configuración de cuenta.</p>
            </div>

            <div class="perfil-layout">

                <!-- Columna izquierda: foto + nombre -->
                <div class="admin-card perfil-foto-card">
                    <div class="perfil-avatar-wrap">
                        <div class="perfil-avatar" style="cursor:default;">
                            ${fotoFuente
                                ? `<img src="${fotoFuente}" alt="Foto de perfil" />`
                                : `<span>${(u.primer_nombre || u.nombre || "?").charAt(0).toUpperCase()}</span>`
                            }
                        </div>
                    </div>
                    <h2 class="perfil-nombre">${nombreCompleto}</h2>
                    <span class="subject-tag">${rolLabel}</span>
                    ${u.estado ? `
                    <span class="status-badge ${
                        u.estado === "ACTIVO"
                            ? "attended"
                            : "pending"
                    }" style="margin-top:8px;">
                        ${u.estado.charAt(0) + u.estado.slice(1).toLowerCase()}
                    </span>` : ""}
                </div>

                <!-- Columna derecha: datos -->
                <div class="perfil-datos-col">

                    <!-- Información Personal -->
                    <div class="admin-card">
                        <h3><span class="material-symbols-rounded">person</span> Información Personal</h3>
                        <div class="perfil-datos-grid">

                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">account_circle</span>
                                <div><small>Nombre Completo</small><p>${nombreCompleto || "—"}</p></div>
                            </div>

                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">badge</span>
                                <div>
                                    <small>Carnet</small>
                                    <p>${u.carnet || "—"}</p>
                                </div>
                            </div>

                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">admin_panel_settings</span>
                                <div>
                                    <small>Rol</small>
                                    <p>${rolLabel}</p>
                                </div>
                            </div>

                            ${u.fecha_nacimiento ? `
                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">cake</span>
                                <div><small>Fecha de Nacimiento</small><p>${u.fecha_nacimiento ? new Date(u.fecha_nacimiento).toLocaleDateString("es-SV"): "—"}</p></div>
                            </div>` : ""}

                            ${u.sexo ? `
                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">wc</span>
                                <div><small>Género</small><p>${u.sexo}</p></div>
                            </div>` : ""}

                        </div>
                    </div>

                    <!-- Contacto -->
                    <div class="admin-card">
                        <h3><span class="material-symbols-rounded">contact_phone</span> Contacto</h3>
                        <div class="perfil-datos-grid">

                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">mail</span>
                                <div><small>Correo Institucional</small>
                                    <p>${u.correo_institucional || u.correo || "—"}</p></div>
                            </div>

                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">mail_outline</span>
                                <div><small>Correo Personal</small>
                                    <p>${u.correo_personal || "—"}</p></div>
                            </div>

                            ${telMovil ? `
                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">phone_android</span>
                                <div><small>Teléfono Móvil</small><p>${telMovil}</p></div>
                            </div>` : ""}

                            ${telFijo ? `
                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">phone</span>
                                <div><small>Teléfono Fijo</small><p>${telFijo}</p></div>
                            </div>` : ""}

                            ${u.direccion ? `
                            <div class="perfil-dato" style="grid-column: span 2;">
                                <span class="material-symbols-rounded">home</span>
                                <div><small>Dirección</small><p>${u.direccion}</p></div>
                            </div>` : ""}

                        </div>
                    </div>

                    <!-- Documentos -->
                    <div class="admin-card">
                        <h3><span class="material-symbols-rounded">folder_shared</span> Documentos</h3>
                        <div class="perfil-datos-grid">

                            ${u.dui ? `
                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">contact_page</span>
                                <div><small>${duiLabel}</small><p>${fmtDui(u.dui)}</p></div>
                            </div>` : ""}

                            ${u.dui_tipo ? `
                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">info</span>
                                <div><small>Tipo de DUI</small>
                                    <p>${u.dui_tipo === "RESPONSABLE" ? "Del Responsable" : "Personal"}</p></div>
                            </div>` : ""}

                            ${u.carnet_minoridad ? `
                            <div class="perfil-dato">
                                <span class="material-symbols-rounded">recent_actors</span>
                                <div><small>Carnet de Minoridad</small><p>${u.carnet_minoridad}</p></div>
                            </div>` : ""}

                        </div>
                        ${!u.dui && !u.carnet_minoridad ? `
                        <p class="empty-state" style="padding:20px;">No hay documentos registrados.</p>` : ""}
                    </div>

                </div><!-- /perfil-datos-col -->
            </div><!-- /perfil-layout -->
        `;
    }
}