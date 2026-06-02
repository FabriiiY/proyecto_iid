// ============================================================
//  views/materias.js — Gestión de Materias (Admin & Maestro)
// ============================================================

const MATERIAS_KEY = "sami_materias_v1";

// ── Helpers ──────────────────────────────────────────────────
function getMaterias() {
    return JSON.parse(localStorage.getItem(MATERIAS_KEY)) || [];
}

function saveMaterias(lista) {
    localStorage.setItem(MATERIAS_KEY, JSON.stringify(lista));
}

// ── VISTA: AGREGAR MATERIA ────────────────────────────────────
function renderViewMateriasAgregar(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">library_add</span> Agregar Materia</h1>
            <p>Registra una nueva materia con su carga horaria y descripción.</p>
        </div>

        <div class="admin-card" style="max-width:860px;">
            <h3><span class="material-symbols-rounded">menu_book</span> Nueva Materia</h3>

            <form id="form-materia">

                <!-- Nombre (ancho completo) -->
                <div class="form-group" style="margin-bottom:16px;">
                    <label>Nombre de la Materia <span class="req">*</span></label>
                    <input type="text" id="m-nombre" placeholder="Ej. Programación para la Industria 4.0"
                           required autocomplete="off" class="form-input-full" />
                </div>

                <!-- Horas Teóricas / Horas Prácticas / UV -->
                <div class="form-row form-row-3">
                    <div class="form-group">
                        <label>Horas Teóricas <span class="req">*</span></label>
                        <input type="number" id="m-horas-teoricas" placeholder="Ej. 2" min="0" required />
                    </div>
                    <div class="form-group">
                        <label>Horas Prácticas <span class="req">*</span></label>
                        <input type="number" id="m-horas-practicas" placeholder="Ej. 3" min="0" required />
                    </div>
                    <div class="form-group">
                        <label>Unidades Valorativas <span class="req">*</span></label>
                        <input type="number" id="m-uv" placeholder="Ej. 4" min="0" required />
                    </div>
                </div>

                <!-- Descripción -->
                <div class="form-group" style="margin-bottom:16px;">
                    <label>Descripción <span class="opt">(opcional)</span></label>
                    <textarea id="m-descripcion" rows="3"
                              placeholder="Breve descripción del contenido y objetivos de la materia..."
                              class="form-input-full materia-textarea"></textarea>
                </div>

                <!-- Estado -->
                <div class="form-group" style="margin-bottom:20px;">
                    <label>Estado <span class="req">*</span></label>
                    <select id="m-estado" required class="form-select">
                        <option value="" disabled selected>Selecciona...</option>
                        <option value="ACTIVA">ACTIVA</option>
                        <option value="INACTIVA">INACTIVA</option>
                    </select>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:5px;">
                    <button type="button" id="btn-ver-materias" class="btn-secondary">
                        <span class="material-symbols-rounded" style="font-size:1.1rem;vertical-align:middle;">list</span>
                        Ver Materias
                    </button>
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Materia
                    </button>
                </div>

            </form>
        </div>
    `;

    // Acceso rápido a ver materias
    document.getElementById("btn-ver-materias").addEventListener("click", () => {
        SAMI.navegar("materias-ver");
    });

    // Submit
    document.getElementById("form-materia").addEventListener("submit", e => {
        e.preventDefault();

        const nueva = {

    nombre: document.getElementById("m-nombre").value.trim(),

    horas_teoricas: parseInt(
        document.getElementById("m-horas-teoricas").value
    ) || 0,

    horas_practicas: parseInt(
        document.getElementById("m-horas-practicas").value
    ) || 0,

    unidades_valorativas: parseInt(
        document.getElementById("m-uv").value
    ) || 0,

    descripcion: document.getElementById("m-descripcion").value.trim(),

    estado: document.getElementById("m-estado").value

};

        // TODO: reemplazar con fetch() POST /materias
        fetch("http://127.0.0.1:5000/materias", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(nueva)

})

.then(res => res.json())

.then(data => {

    if(data.success){

        e.target.reset();

        alert("Materia registrada correctamente");

    }else{

        alert(data.mensaje);

    }

})

.catch(error => {

    console.error(error);

    alert("Error al registrar materia");

});




        // Feedback visual
    
        const btn = e.target.querySelector(".btn-primary");
        btn.innerHTML = `<span class="material-symbols-rounded">check_circle</span> ¡Materia Guardada!`;
        btn.style.background = "#4CAF50";
        setTimeout(() => {
            btn.innerHTML = `<span class="material-symbols-rounded">save</span> Guardar Materia`;
            btn.style.background = "";
        }, 2500);
    });
}


// ── VISTA: VER MATERIAS ───────────────────────────────────────
function renderViewMateriasVer(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">library_books</span> Materias Disponibles</h1>
            <p>Consulta, edita o cambia el estado de las materias registradas.</p>
        </div>

        <div class="admin-card">

            <!-- Barra superior: búsqueda + botón agregar -->
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:20px; flex-wrap:wrap;">
                <div class="search-bar-wrapper" style="flex:1; min-width:200px;">
                    <span class="material-symbols-rounded search-icon">search</span>
                    <input type="text" id="search-materias"
                           placeholder="Buscar materia..."
                           class="search-input" autocomplete="off" />
                </div>
                <button id="btn-agregar-materia" class="btn-primary" style="width:auto; padding:11px 22px; white-space:nowrap;">
                    <span class="material-symbols-rounded">add</span> Nueva Materia
                </button>
            </div>

            <div class="students-table-wrapper">
                <table class="students-table" id="materias-table" style="display:none;">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th style="text-align:center;">H. Teóricas</th>
                            <th style="text-align:center;">H. Prácticas</th>
                            <th style="text-align:center;">UV</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="materias-tbody"></tbody>
                </table>
                <div id="empty-materias" class="empty-state">
                    No hay materias registradas. <br>
                    <button id="btn-empty-agregar" class="btn-primary"
                            style="width:auto; padding:10px 22px; margin-top:14px;">
                        <span class="material-symbols-rounded">add</span> Agregar primera materia
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL EDITAR MATERIA -->
        <div id="modal-materia" class="modal-overlay" style="display:none;">
            <div class="modal-card">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Materia</h3>
                    <button id="modal-materia-close" class="modal-close-btn">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <form id="edit-materia-form">
                    <input type="hidden" id="edit-m-id" />

                    <div class="form-group" style="margin-bottom:16px;">
                        <label>Nombre <span class="req">*</span></label>
                        <input type="text" id="edit-m-nombre" required autocomplete="off" class="form-input-full" />
                    </div>

                    <div class="form-row form-row-3">
                        <div class="form-group">
                            <label>Horas Teóricas</label>
                            <input type="number" id="edit-m-teoricas" min="0" />
                        </div>
                        <div class="form-group">
                            <label>Horas Prácticas</label>
                            <input type="number" id="edit-m-practicas" min="0" />
                        </div>
                        <div class="form-group">
                            <label>Unidades Valorativas</label>
                            <input type="number" id="edit-m-uv" min="0" />
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom:16px;">
                        <label>Descripción</label>
                        <textarea id="edit-m-descripcion" rows="3"
                                  class="form-input-full materia-textarea"></textarea>
                    </div>

                    <div class="form-group" style="margin-bottom:20px;">
                        <label>Estado</label>
                        <select id="edit-m-estado" class="form-select">
                            <option value="ACTIVA">Activa</option>
                            <option value="INACTIVA">INACTIVA</option>
                        </select>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:5px;">
                        <button type="button" id="modal-materia-cancel" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">
                            <span class="material-symbols-rounded">save</span> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("btn-agregar-materia").addEventListener("click", () => {
        SAMI.navegar("materias-agregar");
    });

    const emptyBtn = document.getElementById("btn-empty-agregar");
    if (emptyBtn) emptyBtn.addEventListener("click", () => SAMI.navegar("materias-agregar"));

    const tbody   = document.getElementById("materias-tbody");
    const table   = document.getElementById("materias-table");
    const emptyEl = document.getElementById("empty-materias");
    const search  = document.getElementById("search-materias");
    const modal   = document.getElementById("modal-materia");
    const editForm= document.getElementById("edit-materia-form");

    // TODO: reemplazar con fetch() GET /materias
    let materias = getMaterias();

    function renderTabla(lista) {
        tbody.innerHTML = "";
        if (lista.length === 0) {
            emptyEl.style.display = "block";
            table.style.display   = "none";
            return;
        }
        emptyEl.style.display = "none";
        table.style.display   = "table";

        lista.forEach(m => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <strong>${m.nombre}</strong>
                    ${m.descripcion
                        ? `<p style="font-size:0.8rem;color:#999;margin:2px 0 0;line-height:1.3;">${m.descripcion}</p>`
                        : ""}
                </td>
                <td style="text-align:center;">${m.horasTeorica}</td>
                <td style="text-align:center;">${m.horasPractica}</td>
                <td style="text-align:center;">${m.uv}</td>
                <td style="text-align:center;">
                    <span class="status-badge ${m.estado === "ACTIVA" ? "attended" : "pending"}">
                        ${m.estado === "ACTIVA" ? "Activa" : "Inactiva"}
                    </span>
                </td>
                <td style="text-align:center;">
                    <div style="display:flex;gap:6px;justify-content:center;">
                        <button class="btn-icon btn-edit-materia" data-id="${m.id}" title="Editar">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="btn-icon ${m.estado === "ACTIVA" ? "btn-icon-danger" : "btn-icon-success"} btn-toggle-materia"
                                data-id="${m.id}"
                                title="${m.estado === "ACTIVA" ? "Desactivar" : "Activar"}">
                            <span class="material-symbols-rounded">${m.estado === "ACTIVA" ? "block" : "check_circle"}</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Editar
        tbody.querySelectorAll(".btn-edit-materia").forEach(btn => {
            btn.addEventListener("click", () => abrirModal(parseInt(btn.dataset.id)));
        });

        // Toggle estado
        tbody.querySelectorAll(".btn-toggle-materia").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                const idx = materias.findIndex(x => x.id === id);
                if (idx === -1) return;
                materias[idx].estado = materias[idx].estado === "activa" ? "inactiva" : "activa";
                saveMaterias(materias);
                renderTabla(filtrar());
            });
        });
    }

    function filtrar() {
        const q = search.value.toLowerCase().trim();
        return q ? materias.filter(m => m.nombre.toLowerCase().includes(q)) : [...materias];
    }

    search.addEventListener("input", () => renderTabla(filtrar()));

    // Modal
    function abrirModal(id) {
        const m = materias.find(x => x.id === id);
        if (!m) return;
        document.getElementById("edit-m-id").value          = m.id;
        document.getElementById("edit-m-nombre").value      = m.nombre;
        document.getElementById("edit-m-teoricas").value    = m.horasTeorica;
        document.getElementById("edit-m-practicas").value   = m.horasPractica;
        document.getElementById("edit-m-uv").value          = m.uv;
        document.getElementById("edit-m-descripcion").value = m.descripcion || "";
        document.getElementById("edit-m-estado").value      = m.estado;
        modal.style.display = "flex";
    }

    function cerrarModal() { modal.style.display = "none"; }

    document.getElementById("modal-materia-close").addEventListener("click",  cerrarModal);
    document.getElementById("modal-materia-cancel").addEventListener("click", cerrarModal);
    modal.addEventListener("click", e => { if (e.target === modal) cerrarModal(); });

    editForm.addEventListener("submit", e => {
        e.preventDefault();
        const id  = parseInt(document.getElementById("edit-m-id").value);
        const idx = materias.findIndex(x => x.id === id);
        if (idx === -1) return;

        materias[idx] = {
            ...materias[idx],
            nombre:        document.getElementById("edit-m-nombre").value.trim(),
            horasTeorica:  parseInt(document.getElementById("edit-m-teoricas").value)  || 0,
            horasPractica: parseInt(document.getElementById("edit-m-practicas").value) || 0,
            uv:            parseInt(document.getElementById("edit-m-uv").value)         || 0,
            descripcion:   document.getElementById("edit-m-descripcion").value.trim(),
            estado:        document.getElementById("edit-m-estado").value
        };

        // TODO: reemplazar con fetch() PUT /materias/:id
        saveMaterias(materias);
        cerrarModal();
        renderTabla(filtrar());
    });

    renderTabla(materias);
}