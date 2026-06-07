// ============================================================
//  views/maestro-grupo-clase.js — Clases por Grupo (Docente)
//
//  Solo lectura. Muestra únicamente las asignaciones clase-grupo
//  ACTIVAS donde el docente en sesión es el responsable de la clase.
//
//  BACKEND requerido:
//    GET /clase-grupo?id_docente=X
//      → { success, clase_grupos: [{ id_clase_grupo, id_clase, id_grupo, estado }] }
//      Filtra: clase_grupo JOIN clase WHERE clase.id_docente = X AND clase_grupo.estado = 'ACTIVO'
// ============================================================


// ── VISTA: MIS CLASES POR GRUPO (Docente) ────────────────────
function renderViewMaestroClaseGrupo(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idDocente     = usuarioActivo.id_usuario;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">table_view</span> Mis Clases por Grupo</h1>
            <p>Grupos activos a los que estás asignado como docente.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="mcg-search"
                    placeholder="Buscar por grupo o materia..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="mcg-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Grupo</th>
                            <th>Materia</th>
                            <th style="text-align:center;">Tipo</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="mcg-tbody"></tbody>
                </table>
                <div id="mcg-empty" class="empty-state">
                    <span class="material-symbols-rounded" style="font-size:2.5rem; color:#ccc;">
                        folder_off
                    </span>
                    <p>No tienes clases asignadas a ningún grupo activo.</p>
                </div>
            </div>
        </div>
    `;

    const tbody    = document.getElementById("mcg-tbody");
    const table    = document.getElementById("mcg-table");
    const emptyMsg = document.getElementById("mcg-empty");
    const search   = document.getElementById("mcg-search");

    let asignaciones     = [];
    let catalogoGrupos   = [];
    let catalogoClases   = [];
    let catalogoMaterias = [];

    // ── Badges ────────────────────────────────────────────────
    function badgeTipo(tipo) {
        const esTeo = tipo === "TEORIA";
        return `<span style="
            display:inline-flex; align-items:center; gap:4px;
            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
            background:${esTeo ? "#eef1f9" : "#edfaf3"};
            color:${esTeo ? "var(--azul-sami)" : "#27ae60"};">
            <span class="material-symbols-rounded" style="font-size:0.9rem;">
                ${esTeo ? "menu_book" : "science"}
            </span>
            ${esTeo ? "Teoría" : "Práctica"}
        </span>`;
    }

    function badgeEstado(estado) {
        const activo = estado === "ACTIVO";
        return `<span style="
            display:inline-flex; align-items:center; gap:4px;
            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
            background:${activo ? "#e6f9f0" : "#fdecea"};
            color:${activo ? "#1a8a4a" : "#c0392b"};">
            <span class="material-symbols-rounded" style="font-size:0.85rem;">
                ${activo ? "check_circle" : "cancel"}
            </span>
            ${activo ? "Activo" : "Inactivo"}
        </span>`;
    }

    // ── Resolvers ─────────────────────────────────────────────
    function nombreGrupo(id) {
        const g = catalogoGrupos.find(x => x.id_grupo === id);
        return g ? g.nombre_grupo : `Grupo #${id}`;
    }

    function datosClase(id) {
        return catalogoClases.find(x => x.id_clase === id) || null;
    }

    function nombreMateria(id_materia) {
        const m = catalogoMaterias.find(x => x.id_materia === id_materia);
        return m ? m.nombre : `Materia #${id_materia}`;
    }

    // ── Renderizar tabla ──────────────────────────────────────
    function renderTabla(lista) {
        tbody.innerHTML = "";

        if (!lista.length) {
            emptyMsg.style.display = "flex";
            table.style.display    = "none";
            return;
        }
        emptyMsg.style.display = "none";
        table.style.display    = "table";

        lista.forEach(item => {
            const clase = datosClase(item.id_clase);
            const tr    = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${nombreGrupo(item.id_grupo)}</strong></td>
                <td>${clase ? nombreMateria(clase.id_materia) : `Clase #${item.id_clase}`}</td>
                <td style="text-align:center;">${clase ? badgeTipo(clase.tipo_clase) : "—"}</td>
                <td style="text-align:center;">${badgeEstado(item.estado)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        if (!q) return [...asignaciones];
        return asignaciones.filter(item => {
            const clase = datosClase(item.id_clase);
            return (
                nombreGrupo(item.id_grupo).toLowerCase().includes(q) ||
                (clase && nombreMateria(clase.id_materia).toLowerCase().includes(q))
            );
        });
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Carga inicial ─────────────────────────────────────────
    function cargarCatalogos() {
        return Promise.all([
            // Solo los grupos asignados al docente
            // BACKEND: GET /mis-grupos?id_docente=X
            //   → { success, grupos: [{ id_grupo, nombre_grupo }] }
            fetch(`http://127.0.0.1:5000/mis-grupos?id_docente=${idDocente}`)
                .then(r => r.json())
                .then(d => { if (d.success) catalogoGrupos = d.grupos || []; })
                .catch(() => {}),

            // Solo las clases del docente
            // BACKEND: GET /mis-clases?id_docente=X
            //   → { success, clases: [{ id_clase, tipo_clase, estado, id_materia, id_docente }] }
            fetch(`http://127.0.0.1:5000/mis-clases?id_docente=${idDocente}`)
                .then(r => r.json())
                .then(d => { if (d.success) catalogoClases = d.clases || []; })
                .catch(() => {}),

            // Materias (catálogo general, solo para resolver nombres)
            // BACKEND: GET /materias → { success, materias: [{ id_materia, nombre }] }
            fetch("http://127.0.0.1:5000/materias")
                .then(r => r.json())
                .then(d => { if (d.success) catalogoMaterias = d.materias || []; })
                .catch(() => {})
        ]);
    }

    function cargarAsignaciones() {
        // Solo asignaciones ACTIVAS del docente en sesión
        // BACKEND: GET /clase-grupo?id_docente=X
        //   → { success, clase_grupos: [{ id_clase_grupo, id_clase, id_grupo, estado }] }
        //   El backend filtra: clase_grupo JOIN clase
        //                      WHERE clase.id_docente = X
        //                        AND clase_grupo.estado = 'ACTIVO'
        fetch(`http://127.0.0.1:5000/clase-grupo?id_docente=${idDocente}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    asignaciones = (data.clase_grupos || []).filter(a => a.estado === "ACTIVO");
                    renderTabla(asignaciones);
                } else {
                    emptyMsg.querySelector("p").textContent =
                        data.error || data.mensaje || "No se pudieron cargar los datos.";
                    emptyMsg.style.display = "flex";
                    table.style.display    = "none";
                }
            })
            .catch(err => {
                console.error(err);
                emptyMsg.querySelector("p").textContent = "Error al conectar con el servidor.";
                emptyMsg.style.display = "flex";
                table.style.display    = "none";
            });
    }

    // Catálogos primero, luego tabla
    cargarCatalogos().then(cargarAsignaciones);
}