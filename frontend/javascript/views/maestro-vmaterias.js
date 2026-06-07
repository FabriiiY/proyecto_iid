// ============================================================
//  views/maestro-materias.js — Mis Materias (Docente)
//
//  Solo lectura. Muestra las materias de las clases asignadas
//  al docente en sesión.
//
//  BACKEND requerido:
//    GET /materias?id_docente=X
//      → { success, materias: [{ id_materia, nombre, horas_teoricas,
//                                horas_practicas, unidades_valorativas,
//                                descripcion, estado }] }
//      Filtra: materia JOIN clase WHERE clase.id_docente = X
//      (puede devolver duplicados si el docente tiene varias clases
//       de la misma materia — el backend debería hacer DISTINCT)
// ============================================================


// ── VISTA: MIS MATERIAS (Docente) ─────────────────────────────
function renderViewMaestroMaterias(container) {

    const usuarioActivo = window.SAMI?.usuario || {};
    const idDocente     = usuarioActivo.id_usuario;

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">library_books</span> Mis Materias</h1>
            <p>Materias correspondientes a las clases que tienes asignadas.</p>
        </div>

        <div class="admin-card">

            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="mm-search"
                    placeholder="Buscar materia..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="mm-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th style="text-align:center;">H. Teóricas</th>
                            <th style="text-align:center;">H. Prácticas</th>
                            <th style="text-align:center;">UV</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="mm-tbody"></tbody>
                </table>
                <div id="mm-empty" class="empty-state">
                    <span class="material-symbols-rounded" style="font-size:2.5rem; color:#ccc;">
                        menu_book
                    </span>
                    <p>No tienes materias asignadas.</p>
                </div>
            </div>
        </div>
    `;

    const tbody    = document.getElementById("mm-tbody");
    const table    = document.getElementById("mm-table");
    const emptyMsg = document.getElementById("mm-empty");
    const search   = document.getElementById("mm-search");

    let materias = [];

    // ── Badge estado ──────────────────────────────────────────
    function badgeEstado(estado) {
        const activa = estado === "ACTIVA";
        return `<span class="status-badge ${activa ? "attended" : "pending"}">
            ${activa ? "Activa" : "Inactiva"}
        </span>`;
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

        lista.forEach(m => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <strong>${m.nombre}</strong>
                    ${m.descripcion
                        ? `<p style="font-size:0.8rem; color:#999; margin:2px 0 0; line-height:1.3;">
                               ${m.descripcion}
                           </p>`
                        : ""}
                </td>
                <td style="text-align:center;">${m.horas_teoricas ?? "—"}</td>
                <td style="text-align:center;">${m.horas_practicas ?? "—"}</td>
                <td style="text-align:center;">${m.unidades_valorativas ?? "—"}</td>
                <td style="text-align:center;">${badgeEstado(m.estado)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? materias.filter(m => m.nombre.toLowerCase().includes(q))
            : [...materias];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Carga inicial ─────────────────────────────────────────
    fetch(`http://127.0.0.1:5000/materias?id_docente=${idDocente}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                materias = data.materias || [];
                renderTabla(materias);
            } else {
                emptyMsg.querySelector("p").textContent =
                    data.error || data.mensaje || "No se pudieron cargar las materias.";
                emptyMsg.style.display = "flex";
            }
        })
        .catch(err => {
            console.error(err);
            emptyMsg.querySelector("p").textContent = "Error al conectar con el servidor.";
            emptyMsg.style.display = "flex";
        });
}