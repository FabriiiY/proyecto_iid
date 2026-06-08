// ============================================================
//  views/maestro-clases.js — Mis Clases (Docente)
//
//  Solo lectura. Muestra únicamente las clases ACTIVAS
//  asignadas al docente en sesión.
//
//  BACKEND requerido:
//    GET /mis-clases?id_docente=X
//      → { success, clases: [{ id_clase, tipo_clase, estado,
//                              id_materia, id_docente }] }
//      Filtra: clase WHERE id_docente = X AND estado = 'ACTIVO'
//      (la validación de estado también se hace en el cliente)
// ============================================================


// ── VISTA: MIS CLASES (Docente) ───────────────────────────────
function renderViewMaestroClases(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idDocente = usuarioActivo.id;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">cast_for_education</span> Mis Clases</h1>
            <p>Clases activas que tienes asignadas en el sistema.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="mc-search"
                    placeholder="Buscar por materia o tipo..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="mc-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th style="text-align:center;">Tipo</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="mc-tbody"></tbody>
                </table>
                <div id="mc-empty" class="empty-state">
                    <span class="material-symbols-rounded" style="font-size:2.5rem; color:#ccc;">
                        cast_for_education
                    </span>
                    <p>No tienes clases activas asignadas.</p>
                </div>
            </div>
        </div>
    `;

    const tbody    = document.getElementById("mc-tbody");
    const table    = document.getElementById("mc-table");
    const emptyMsg = document.getElementById("mc-empty");
    const search   = document.getElementById("mc-search");

    let clases           = [];
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
            ${activo ? "Activa" : "Inactiva"}
        </span>`;
    }

    // ── Resolver nombre de materia ────────────────────────────
    function nombreMateria(id) {
        const m = catalogoMaterias.find(x => x.id_materia === id);
        return m ? m.nombre : `Materia #${id}`;
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

        lista.forEach(clase => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${nombreMateria(clase.id_materia)}</td>
                <td style="text-align:center;">${badgeTipo(clase.tipo_clase)}</td>
                <td style="text-align:center;">${badgeEstado(clase.estado)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? clases.filter(c =>
                nombreMateria(c.id_materia).toLowerCase().includes(q) ||
                c.tipo_clase.toLowerCase().includes(q)
            )
            : [...clases];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Carga inicial ─────────────────────────────────────────
    Promise.all([
        // Catálogo de materias para resolver nombres
        // BACKEND: GET /materias → { success, materias: [{ id_materia, nombre }] }
        fetch("http://127.0.0.1:5000/materias")
            .then(r => r.json())
            .then(d => { if (d.success) catalogoMaterias = d.materias || []; })
            .catch(() => {}),

        // Solo las clases activas del docente
        // BACKEND: GET /mis-clases?id_docente=X
        //   → { success, clases: [{ id_clase, tipo_clase, estado, id_materia, id_docente }] }
        fetch(`http://127.0.0.1:5000/mis-clases?id_docente=${idDocente}`)
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    // Filtro en cliente como segunda capa de seguridad
                    clases = (d.clases || []).filter(c => c.estado === "ACTIVO");
                }
            })
            .catch(() => {})
    ])
    .then(() => renderTabla(clases))
    .catch(err => {
        console.error(err);
        emptyMsg.querySelector("p").textContent = "Error al conectar con el servidor.";
        emptyMsg.style.display = "flex";
    });
}