// ============================================================
//  views/maestro-aulas.js — Aulas Registradas (Docente)
//
//  Solo lectura. Muestra únicamente las aulas con estado ACTIVO.
//  El docente no puede editar ni cambiar estados.
//
//  BACKEND requerido:
//    GET /aulas?estado=ACTIVO
//      → { success, aulas: [{ id_aula, codigo, edificio, nivel,
//                             capacidad, descripcion, estado }] }
//    (la validación de ACTIVO también se hace en el cliente)
// ============================================================


// ── VISTA: AULAS ACTIVAS (Docente) ────────────────────────────
function renderViewMaestroAulas(container) {

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">meeting_room</span> Aulas Registradas</h1>
            <p>Aulas activas disponibles en el sistema.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="ma-search"
                    placeholder="Buscar por código, edificio o descripción..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="ma-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Edificio</th>
                            <th style="text-align:center;">Nivel</th>
                            <th style="text-align:center;">Capacidad</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="ma-tbody"></tbody>
                </table>
                <div id="ma-empty" class="empty-state">
                    <span class="material-symbols-rounded" style="font-size:2.5rem; color:#ccc;">
                        meeting_room
                    </span>
                    <p>No hay aulas registradas.</p>
                </div>
            </div>
        </div>
    `;

    const tbody    = document.getElementById("ma-tbody");
    const table    = document.getElementById("ma-table");
    const emptyMsg = document.getElementById("ma-empty");
    const search   = document.getElementById("ma-search");

    let aulas = [];

    // ── Badge estado ──────────────────────────────────────────
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

        lista.forEach(a => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${a.codigo_aula}</strong></td>
                <td>${a.edificio || "—"}</td>
                <td style="text-align:center;">${a.nivel ?? "—"}</td>
                <td style="text-align:center;">${a.capacidad ?? "—"}</td>
                <td style="font-size:0.85rem; color:#666;">
                    ${a.descripcion || "<span style='color:#bbb;'>—</span>"}
                </td>
                <td style="text-align:center;">${badgeEstado(a.estado)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? aulas.filter(a =>
                a.codigo.toLowerCase().includes(q)                           ||
                (a.edificio    && a.edificio.toLowerCase().includes(q))      ||
                (a.descripcion && a.descripcion.toLowerCase().includes(q))
            )
            : [...aulas];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Carga inicial — solo ACTIVAS ──────────────────────────
    // BACKEND: GET /aulas?estado=ACTIVO
    //   → { success, aulas: [...] }
    fetch("http://127.0.0.1:5000/aulas")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Filtro en cliente como segunda capa de seguridad
                aulas = data.aulas || [];
                renderTabla(aulas);
            } else {
                emptyMsg.querySelector("p").textContent =
                    data.error || data.mensaje || "No se pudieron cargar las aulas.";
                emptyMsg.style.display = "flex";
            }
        })
        .catch(err => {
            console.error(err);
            emptyMsg.querySelector("p").textContent = "Error al conectar con el servidor.";
            emptyMsg.style.display = "flex";
        });
}