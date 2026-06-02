// ============================================================
//  views/maestro.js — Vista del Maestro
// ============================================================
function renderViewMaestroAlumnos(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">groups</span> Mis Alumnos</h1>
            <p>Consulta los estudiantes registrados en el sistema.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper" style="margin-bottom:20px;">
                <span class="material-symbols-rounded search-icon">search</span>
                <input type="text" id="search-alumnos" placeholder="Buscar por nombre o carnet..." class="search-input" autocomplete="off" />
            </div>

            <div class="students-table-wrapper">
                <table class="students-table" id="alumnos-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre Completo</th>
                            <th>Correo Institucional</th>
                            <th>Carnet</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="alumnos-tbody"></tbody>
                </table>
                <div id="empty-alumnos" class="empty-state">No hay estudiantes registrados.</div>
            </div>
        </div>
    `;

    const tbody    = document.getElementById("alumnos-tbody");
    const table    = document.getElementById("alumnos-table");
    const emptyMsg = document.getElementById("empty-alumnos");
    const search   = document.getElementById("search-alumnos");

    // TODO: reemplazar con fetch() GET /usuarios?rol=3
    const todos      = JSON.parse(localStorage.getItem("sami_usuarios_v2")) || [];
    const estudiantes = todos.filter(u => u.rol === 3);

    function nombreCompleto(u) {
        return [u.primerNombre, u.segundoNombre, u.primerApellido, u.segundoApellido]
            .filter(Boolean).join(" ");
    }

    function renderTabla(lista) {
        tbody.innerHTML = "";
        if (lista.length === 0) {
            emptyMsg.style.display = "block";
            table.style.display    = "none";
            return;
        }
        emptyMsg.style.display = "none";
        table.style.display    = "table";

        lista.forEach(u => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${nombreCompleto(u)}</strong></td>
                <td>${u.correoInstitucional}</td>
                <td>${u.carnet}</td>
                <td style="text-align:center;">
                    <span class="status-badge ${u.activo ? "attended" : "pending"}">
                        ${u.activo ? "Activo" : "Inactivo"}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    search.addEventListener("input", () => {
        const q = search.value.toLowerCase().trim();
        renderTabla(q ? estudiantes.filter(u =>
            nombreCompleto(u).toLowerCase().includes(q) ||
            u.carnet.toLowerCase().includes(q)
        ) : estudiantes);
    });

    renderTabla(estudiantes);
}