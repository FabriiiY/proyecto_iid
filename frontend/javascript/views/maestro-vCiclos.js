// ============================================================
//  views/maestro-ciclos.js — Ciclos y Periodos (Docente)
//
//  Solo lectura. Muestra únicamente los ciclos con estado ACTIVO.
//  El docente no puede editar ni cambiar estados.
//
//  BACKEND requerido:
//    GET /ciclos?estado=ACTIVO
//      → { success, ciclos: [{ id_ciclo, nombre, numero_ciclo,
//                              fecha_inicio, fecha_fin, estado,
//                              id_periodo, id_tipo_ciclo }] }
//    (la validación de ACTIVO también se hace en el cliente)
// ============================================================


// ── VISTA: CICLOS ACTIVOS (Docente) ───────────────────────────
function renderViewMaestroCiclos(container) {

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">format_list_bulleted</span> Ciclos y Periodos</h1>
            <p>Ciclos académicos activos vigentes en el sistema.</p>
        </div>

        <div class="admin-card">
            <div class="search-bar-wrapper">
                <span class="material-symbols-rounded search-icon">search</span>
                <input
                    type="text"
                    id="mci-search"
                    placeholder="Buscar por nombre de ciclo..."
                    class="search-input"
                    autocomplete="off"
                />
            </div>

            <div class="students-table-wrapper" style="margin-top:20px;">
                <table class="students-table" id="mci-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre Ciclo</th>
                            <th style="text-align:center;">N° Ciclo</th>
                            <th>Fechas de Vigencia</th>
                            <th style="text-align:center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="mci-tbody"></tbody>
                </table>
                <div id="mci-empty" class="empty-state">
                    <span class="material-symbols-rounded" style="font-size:2.5rem; color:#ccc;">
                        event_busy
                    </span>
                    <p>No hay ciclos activos registrados.</p>
                </div>
            </div>
        </div>
    `;

    const tbody    = document.getElementById("mci-tbody");
    const table    = document.getElementById("mci-table");
    const emptyMsg = document.getElementById("mci-empty");
    const search   = document.getElementById("mci-search");

    let ciclos = [];

    // ── Formatear fecha DD/MM/YYYY ────────────────────────────
    function formatFecha(fecha) {
        if (!fecha) return "—";
        return fecha.split("-").reverse().join("/");
    }

    // ── Badge estado ──────────────────────────────────────────
    function badgeEstado(estado) {
        const activo = estado === "ACTIVO";
        return `<span class="status-badge ${activo ? "badge-activo" : "badge-inactivo"}">
            ${estado}
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

        lista.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${c.nombre}</strong></td>
                <td style="text-align:center;">Ciclo ${c.numero_ciclo}</td>
                <td>${formatFecha(c.fecha_inicio)} al ${formatFecha(c.fecha_fin)}</td>
                <td style="text-align:center;">${badgeEstado(c.estado)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ── Filtrado ──────────────────────────────────────────────
    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q
            ? ciclos.filter(c => c.nombre.toLowerCase().includes(q))
            : [...ciclos];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // ── Carga inicial — solo ACTIVOS ──────────────────────────
    // BACKEND: GET /ciclos?estado=ACTIVO
    //   → { success, ciclos: [...] }
    fetch("https://proyectoiid-production.up.railway.app/ciclos?estado=ACTIVO")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Filtro en cliente como segunda capa de seguridad
                ciclos = (data.ciclos || []).filter(c => c.estado === "ACTIVO");
                renderTabla(ciclos);
            } else {
                emptyMsg.querySelector("p").textContent =
                    data.error || data.mensaje || "No se pudieron cargar los ciclos.";
                emptyMsg.style.display = "flex";
            }
        })
        .catch(err => {
            console.error(err);
            emptyMsg.querySelector("p").textContent = "Error al conectar con el servidor.";
            emptyMsg.style.display = "flex";
        });
}