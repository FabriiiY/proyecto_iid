// ============================================================
//  views/ciclos-periodos.js — Gestión de Periodos y Ciclos
// ============================================================

function renderViewRegistrarPeriodo(container) {
  container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">calendar_today</span> Periodos Lectivos</h1>
            <p>Configura un nuevo año o periodo lectivo y revisa los existentes.</p>
        </div>
        
        <div class="admin-card" style="max-width:800px; margin-bottom: 30px;">
            <h3><span class="material-symbols-rounded">add_circle</span> Crear Periodo</h3>
            <form id="form-periodo" novalidate>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre del Periodo <span class="req">*</span></label>
                        <input type="text" id="p-nombre" placeholder="Ej. Año Lectivo 2026" required autocomplete="off" class="input-uppercase" />
                    </div>
                    <div class="form-group">
                        <label>Descripción <span class="opt">(opcional)</span></label>
                        <input type="text" id="p-descripcion" placeholder="Detalles opcionales" autocomplete="off" class="form-input-full" />
                    </div>
                </div>

                <div class="form-group">
                    <label>Año <span class="req">*</span></label>
                    <input type="number" id="p-anio" placeholder="Ej. 2026" required min="2000" max="2100" />
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Inicio <span class="req">*</span></label>
                        <input type="date" id="p-fecha-inicio" required />
                    </div>
                    <div class="form-group">
                        <label>Fecha de Fin <span class="req">*</span></label>
                        <input type="date" id="p-fecha-fin" required />
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:15px;">
                    <button type="submit" class="btn-primary" style="width:auto; padding:12px 30px;">
                        <span class="material-symbols-rounded">save</span> Guardar Periodo
                    </button>
                </div>
            </form>
        </div>

        <div class="admin-card">
            <div class="students-table-wrapper">
                <table class="students-table" id="tabla-periodos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Año</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colspan="7" style="text-align:center; color:#999;">Cargando periodos...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

  const tbody = container.querySelector("#tabla-periodos tbody");

  function actualizarTablaLocal() {
    fetch("http://127.0.0.1:5000/periodos")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.periodos && data.periodos.length > 0) {
          tbody.innerHTML = data.periodos
            .map(
              (p) => `
                    <tr>
                        <td><b>#${p.id_periodo}</b></td>
                        <td>${p.nombre || "—"}</td>
                        <td>${p.anio}</td>
                        <td>${formatearFecha(p.fecha_inicio)}</td>
                        <td>${formatearFecha(p.fecha_fin)}</td>
                        <td style="max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${p.descripcion || ""}">
                            ${p.descripcion || '<span style="color:#aaa; font-size:0.85rem;">Sin descripción</span>'}
                        </td>
                        <td style="text-align:center;">
                            <span class="status-badge ${p.estado === 'ACTIVO' ? 'badge-activo' : 'badge-inactivo'}">${p.estado}</span>
                        </td>
                        <td style="text-align:center;">
                            <div style="display:flex;gap:6px;justify-content:center;">
                                <button class="btn-icon btn-edit" id="btn-edit-p-${p.id_periodo}" title="Editar periodo">
                                    <span class="material-symbols-rounded">edit</span>
                                </button>
                                <button class="btn-icon ${p.estado === 'ACTIVO' ? 'btn-icon-danger' : 'btn-icon-success'} btn-toggle-periodo"
                                    id="btn-toggle-p-${p.id_periodo}"
                                    data-id="${p.id_periodo}"
                                    data-estado="${p.estado}"
                                    title="${p.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}">
                                    <span class="material-symbols-rounded">${p.estado === 'ACTIVO' ? 'block' : 'check_circle'}</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `,
            )
            .join("");

          data.periodos.forEach((p) => {
            const btnEdit = container.querySelector(
              `#btn-edit-p-${p.id_periodo}`,
            );
            if (btnEdit) {
              btnEdit.addEventListener("click", () =>
                abrirModalEditarPeriodo(p, actualizarTablaLocal),
              );
            }

            // Botón toggle estado
            const btnToggle = container.querySelector(`#btn-toggle-p-${p.id_periodo}`);
            if (btnToggle) {
              btnToggle.addEventListener("click", () => {
                const nuevoEstado = p.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
                const confirmar = confirm(`¿${nuevoEstado === "ACTIVO" ? "Activar" : "Desactivar"} el periodo "${p.nombre}"?`);
                if (!confirmar) return;
                fetch(`http://127.0.0.1:5000/periodos/${p.id_periodo}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ estado: nuevoEstado })
                })
                .then(r => r.json())
                .then(data => {
                  if (data.success) actualizarTablaLocal();
                  else alert("Error: " + (data.mensaje || data.error));
                })
                .catch(err => console.error(err));
              });
            }
          });
        } else {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#999;">No hay periodos registrados.</td></tr>`;
        }
      })
      .catch((err) => {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#e74c3c;">Error al cargar periodos desde la API</td></tr>`;
      });
  }

  function formatearFecha(fecha) {

    const f = new Date(fecha);

    const dia = String(f.getUTCDate()).padStart(2, "0");
    const mes = String(f.getUTCMonth() + 1).padStart(2, "0");
    const anio = f.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
}

function fechaParaInput(fecha) {

    if (!fecha) return "";

    return fecha.substring(0, 10);
}

  actualizarTablaLocal();

  const form = container.querySelector("#form-periodo");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById("p-nombre").value,
      descripcion: document.getElementById("p-descripcion").value,
      anio: parseInt(document.getElementById("p-anio").value),
      fecha_inicio: document.getElementById("p-fecha-inicio").value,
      fecha_fin: document.getElementById("p-fecha-fin").value,
    };

    fetch("http://127.0.0.1:5000/periodos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Periodo lectivo creado exitosamente.");
          form.reset();
          actualizarTablaLocal();
        } else {
          alert("Error al crear periodo: " + (data.mensaje || data.error));
        }
      })
      .catch((err) => {
        console.error(err);
        alert("No se pudo conectar con el servidor Backend.");
      });
  });

  function fechaParaInput(fecha) {

    const f = new Date(fecha);

    const anio = f.getUTCFullYear();
    const mes = String(f.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(f.getUTCDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

  // ── FUNCIÓN PARA ABRIR MODAL Y EDITAR PERIODO ──
  function abrirModalEditarPeriodo(p, alTerminarDeActualizar) {
    let modal = document.getElementById("modal-editar-periodo");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-editar-periodo";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-card" style="max-width:600px;">
            <div class="modal-header">
                <h3><span class="material-symbols-rounded">edit</span> Editar Periodo #${p.id_periodo}</h3>
                <button class="modal-close-btn" onclick="document.getElementById('modal-editar-periodo').style.display='none'">
                    <span class="material-symbols-rounded">close</span>
                </button>
            </div>
            
            <form id="form-edit-periodo" novalidate>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre del Periodo <span class="req">*</span></label>
                        <input type="text" id="edit-p-nombre" value="${p.nombre || ""}" required class="input-uppercase" />
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <input type="text" id="edit-p-descripcion" value="${p.descripcion || ""}" class="form-input-full" />
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Año <span class="req">*</span></label>
                    <input type="number" id="edit-p-anio" value="${p.anio}" required min="2000" max="2100" />
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Inicio <span class="req">*</span></label>
                        <input type="date" id="edit-p-fecha-inicio" value="${fechaParaInput(p.fecha_inicio)}" required />
                    </div>
                    <div class="form-group">
                        <label>Fecha de Fin <span class="req">*</span></label>
                        <input type="date" id="edit-p-fecha-fin" value="${fechaParaInput(p.fecha_fin)}" required />
                    </div>
                </div>
                
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                    <button type="button" class="btn-secondary" onclick="document.getElementById('modal-editar-periodo').style.display='none'">Cancelar</button>
                    <button type="submit" class="btn-primary" style="width:auto;">
                        <span class="material-symbols-rounded">save</span> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    `;

    modal.style.display = "flex";

    document
      .getElementById("form-edit-periodo")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const datosActualizados = {
          nombre: document.getElementById("edit-p-nombre").value,
          descripcion: document.getElementById("edit-p-descripcion").value,
          anio: parseInt(document.getElementById("edit-p-anio").value),
          fecha_inicio: document.getElementById("edit-p-fecha-inicio").value,
          fecha_fin: document.getElementById("edit-p-fecha-fin").value,
        };

        fetch(`http://127.0.0.1:5000/periodos/${p.id_periodo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosActualizados),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert("Periodo actualizado correctamente");
              modal.style.display = "none";
              if (alTerminarDeActualizar) alTerminarDeActualizar();
            } else {
              alert("Error al actualizar: " + (data.mensaje || data.error));
            }
          })
          .catch((err) => console.error(err));
      });
  }
}

// ── VISTA 2: REGISTRAR TIPO DE CICLO (Formulario + Tabla + Editar) ──
function renderViewRegistrarTipoCiclo(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">category</span> Tipos de Ciclo</h1>
            <p>Gestiona las modalidades académicas (Ordinario, Extraordinario, etc.)</p>
        </div>
        
        <div class="admin-card" style="max-width:600px; margin-bottom: 30px;">
            <h2 style="margin-top:0; margin-bottom:15px; font-size:1.1rem; color:var(--texto-oscuro);">Crear Tipo de Ciclo</h2>
            <form id="form-tipo-ciclo">
                <div class="form-group">
                    <label>Nombre del Tipo <span class="req">*</span></label>
                    <input type="text" id="tc-nombre" placeholder="Ej. ORDINARIO" required style="text-transform:uppercase;" />
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="tc-descripcion" placeholder="Detalles opcionales..." rows="3"></textarea>
                </div>
                <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                    <button type="submit" class="btn-primary">
                        <span class="material-symbols-rounded">save</span> Guardar Tipo
                    </button>
                </div>
            </form>
        </div>

        <div class="admin-card">
            <h2 style="margin-top:0; margin-bottom:15px; font-size:1.1rem; color:var(--texto-oscuro);">Tipos Registrados</h2>
            <div class="students-table-wrapper">
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Modalidad</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-tipos">
                        <tr><td colspan="5" style="text-align:center; color:#888;">Cargando modalidades...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="modal-edit-tipo" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:500px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Tipo de Ciclo</h3>
                    <button type="button" class="modal-close-btn" id="btn-cerrar-modal-tipo">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <form id="form-edit-tipo">
                    <input type="hidden" id="edit-tc-id" />
                    <div class="form-group">
                        <label>Nombre del Tipo <span class="req">*</span></label>
                        <input type="text" id="edit-tc-nombre" required style="text-transform:uppercase;" />
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="edit-tc-descripcion" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Estado <span class="req">*</span></label>
                        <select id="edit-tc-estado" class="form-select" required>
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" class="btn-secondary" id="btn-cancelar-modal-tipo">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("tc-nombre").addEventListener("input", function() { this.value = this.value.toUpperCase(); });
    document.getElementById("edit-tc-nombre").addEventListener("input", function() { this.value = this.value.toUpperCase(); });

    let tiposLocales = [];

    const cargarTablaTipos = () => {
        fetch("http://127.0.0.1:5000/tipos-ciclo")
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("tbody-tipos");
            if (data.success && data.tipos && data.tipos.length > 0) {
                tiposLocales = data.tipos;
                tbody.innerHTML = tiposLocales.map((t, index) => `
                    <tr>
                        <td>${t.id_tipo_ciclo}</td>
                        <td><strong>${t.nombre}</strong></td>
                        <td>${t.descripcion || '—'}</td>
                        <td style="text-align:center;">
                            <span class="status-badge ${t.estado === 'ACTIVO' ? 'badge-activo' : 'badge-inactivo'}">${t.estado}</span>
                        </td>
                        <td style="text-align:center;">
                            <button class="btn-icon btn-edit" data-idx="${index}" title="Editar tipo">
                                <span class="material-symbols-rounded">edit</span>
                            </button>
                        </td>
                    </tr>
                `).join("");
            } else {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay tipos de ciclo registrados.</td></tr>`;
            }
        })
        .catch(err => console.error(err));
    };

    cargarTablaTipos();

    // ── GUARDAR NUEVO TIPO ──
    document.getElementById("form-tipo-ciclo").addEventListener("submit", function (e) {
        e.preventDefault();
        const payload = {
            nombre: document.getElementById("tc-nombre").value.trim(),
            descripcion: document.getElementById("tc-descripcion").value.trim()
        };

        fetch("http://127.0.0.1:5000/tipos-ciclo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("¡Tipo de ciclo guardado exitosamente!");
                document.getElementById("form-tipo-ciclo").reset();
                cargarTablaTipos(); 
            } else {
                alert("Error: " + (data.mensaje || data.error));
            }
        }).catch(err => console.error(err));
    });

    // ── ABRIR MODAL EDITAR ──
    const modalTipo = document.getElementById("modal-edit-tipo");
    
    document.getElementById("tbody-tipos").addEventListener("click", e => {
        const btn = e.target.closest(".btn-edit");
        if (!btn) return;
        
        const idx = btn.dataset.idx;
        const t = tiposLocales[idx];
        
        document.getElementById("edit-tc-id").value = t.id_tipo_ciclo;
        document.getElementById("edit-tc-nombre").value = t.nombre;
        document.getElementById("edit-tc-descripcion").value = t.descripcion || "";
        document.getElementById("edit-tc-estado").value = t.estado || 'ACTIVO';
        
        modalTipo.style.display = "flex";
    });

    const cerrarModalTipo = () => modalTipo.style.display = "none";
    document.getElementById("btn-cerrar-modal-tipo").addEventListener("click", cerrarModalTipo);
    document.getElementById("btn-cancelar-modal-tipo").addEventListener("click", cerrarModalTipo);

    // ── GUARDAR EDICIÓN (PUT) ──
    document.getElementById("form-edit-tipo").addEventListener("submit", function (e) {
        e.preventDefault();
        const id_tipo = document.getElementById("edit-tc-id").value;
        const payload = {
            nombre: document.getElementById("edit-tc-nombre").value.trim(),
            descripcion: document.getElementById("edit-tc-descripcion").value.trim(),
            estado: document.getElementById("edit-tc-estado").value
        };

        fetch(`http://127.0.0.1:5000/tipos-ciclo/${id_tipo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("¡Tipo de ciclo actualizado correctamente!");
                cerrarModalTipo();
                cargarTablaTipos();
            } else {
                alert("Error: " + (data.mensaje || data.error));
            }
        }).catch(err => console.error(err));
    });
}

// ── VISTA 3: REGISTRAR CICLO ────────────────────────────────
function renderViewRegistrarCiclo(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">event_repeat</span> Registrar Ciclo</h1>
            <p>Abre un nuevo ciclo vinculándolo a su Periodo Lectivo y a su Tipo.</p>
        </div>
        <div class="admin-card" style="max-width:800px;">
            <form id="form-ciclo">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre del Ciclo <span class="req">*</span></label>
                        <input type="text" id="c-nombre" placeholder="Ej. Ciclo 1" required />
                    </div>
                    <div class="form-group">
                        <label>Número de Ciclo <span class="req">*</span></label>
                        <input type="number" id="c-numero" placeholder="Ej. 1 o 2" required min="1" />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Periodo Lectivo (Año) <span class="req">*</span></label>
                        <select id="c-periodo" required class="form-select">
                            <option value="" disabled selected>Cargando periodos...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tipo de Ciclo <span class="req">*</span></label>
                        <select id="c-tipo" required class="form-select">
                            <option value="" disabled selected>Cargando tipos...</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Inicio <span class="req">*</span></label>
                        <input type="date" id="c-fecha-inicio" required />
                    </div>
                    <div class="form-group">
                        <label>Fecha de Fin <span class="req">*</span></label>
                        <input type="date" id="c-fecha-fin" required />
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                    <button type="submit" class="btn-primary">
                        <span class="material-symbols-rounded">save</span> Guardar Ciclo
                    </button>
                </div>
            </form>
        </div>
    `;

    cargarSelectsCiclo('c-periodo', 'c-tipo');

    document.getElementById("form-ciclo").addEventListener("submit", function (e) {
        e.preventDefault();

        const payload = {
            nombre: document.getElementById("c-nombre").value.trim(),
            numero_ciclo: parseInt(document.getElementById("c-numero").value),
            fecha_inicio: document.getElementById("c-fecha-inicio").value,
            fecha_fin: document.getElementById("c-fecha-fin").value,
            id_periodo: parseInt(document.getElementById("c-periodo").value),
            id_tipo_ciclo: parseInt(document.getElementById("c-tipo").value)
        };

        fetch("http://127.0.0.1:5000/ciclos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("¡Ciclo guardado exitosamente!");
                document.getElementById("form-ciclo").reset();
            } else {
                alert("Error: " + (data.mensaje || data.error));
            }
        })
        .catch(err => console.error(err));
    });
}

// ── VISTA 4: VER REGISTROS Y EDITAR CICLOS ──────────────────
function renderViewVerCiclos(container) {
    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">format_list_bulleted</span> Ciclos Registrados</h1>
            <p>Historial y control de ciclos académicos completos creados en el sistema.</p>
        </div>
        <div class="admin-card">
            <div class="students-table-wrapper">
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>Nombre Ciclo</th>
                            <th>N° Ciclo</th>
                            <th>Fechas de Vigencia</th>
                            <th style="text-align:center;">Estado</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-ciclos">
                        <tr><td colspan="5" style="text-align:center; color:#888;">Cargando ciclos...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="modal-edit-ciclo" class="modal-overlay" style="display:none;">
            <div class="modal-card" style="max-width:700px;">
                <div class="modal-header">
                    <h3><span class="material-symbols-rounded">edit</span> Editar Ciclo</h3>
                    <button type="button" class="modal-close-btn" id="btn-cerrar-modal-ciclo">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <form id="form-edit-ciclo">
                    <input type="hidden" id="edit-c-id" />
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nombre del Ciclo <span class="req">*</span></label>
                            <input type="text" id="edit-c-nombre" required />
                        </div>
                        <div class="form-group">
                            <label>Número de Ciclo <span class="req">*</span></label>
                            <input type="number" id="edit-c-numero" required min="1" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Periodo Lectivo <span class="req">*</span></label>
                            <select id="edit-c-periodo" required class="form-select"></select>
                        </div>
                        <div class="form-group">
                            <label>Tipo de Ciclo <span class="req">*</span></label>
                            <select id="edit-c-tipo" required class="form-select"></select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Fecha de Inicio <span class="req">*</span></label>
                            <input type="date" id="edit-c-inicio" required />
                        </div>
                        <div class="form-group">
                            <label>Fecha de Fin <span class="req">*</span></label>
                            <input type="date" id="edit-c-fin" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Estado <span class="req">*</span></label>
                        <select id="edit-c-estado" class="form-select" required>
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" class="btn-secondary" id="btn-cancelar-modal-ciclo">Cancelar</button>
                        <button type="submit" class="btn-primary" style="width:auto;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    let ciclosLocales = [];

    // Pre-cargar los selects del modal de edición
    cargarSelectsCiclo('edit-c-periodo', 'edit-c-tipo');

    const cargarTablaCiclos = () => {
        fetch("http://127.0.0.1:5000/ciclos")
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("tbody-ciclos");
            if (data.success && data.ciclos && data.ciclos.length > 0) {
                ciclosLocales = data.ciclos;
                tbody.innerHTML = ciclosLocales.map((c, index) => `
                    <tr>
                        <td><strong>${c.nombre}</strong></td>
                        <td>Ciclo ${c.numero_ciclo}</td>
                        <td>${c.fecha_inicio} al ${c.fecha_fin}</td>
                        <td style="text-align:center;">
                            <span class="status-badge ${c.estado === 'ACTIVO' ? 'badge-activo' : 'badge-inactivo'}">${c.estado}</span>
                        </td>
                        <td style="text-align:center;">
                            <div style="display:flex;gap:6px;justify-content:center;">
                                <button class="btn-icon btn-edit" data-idx="${index}" title="Editar ciclo">
                                    <span class="material-symbols-rounded">edit</span>
                                </button>
                                <button class="btn-icon ${c.estado === 'ACTIVO' ? 'btn-icon-danger' : 'btn-icon-success'} btn-toggle-ciclo"
                                    data-idx="${index}"
                                    data-id="${c.id_ciclo}"
                                    data-estado="${c.estado}"
                                    title="${c.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}">
                                    <span class="material-symbols-rounded">${c.estado === 'ACTIVO' ? 'block' : 'check_circle'}</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join("");
            } else {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay ciclos registrados.</td></tr>`;
            }
        })
        .catch(err => console.error(err));
    };

    cargarTablaCiclos();

    // ── ABRIR MODAL EDITAR ──
    const modalCiclo = document.getElementById("modal-edit-ciclo");
    
    document.getElementById("tbody-ciclos").addEventListener("click", e => {
        // Toggle estado
        const btnToggle = e.target.closest(".btn-toggle-ciclo");
        if (btnToggle) {
            const idx      = btnToggle.dataset.idx;
            const id_ciclo = btnToggle.dataset.id;
            const c        = ciclosLocales[idx];
            const nuevoEstado = c.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
            const confirmar = confirm(`¿${nuevoEstado === "ACTIVO" ? "Activar" : "Desactivar"} el ciclo "${c.nombre}"?`);
            if (!confirmar) return;

            fetch(`http://127.0.0.1:5000/ciclos/${id_ciclo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) cargarTablaCiclos();
                else alert("Error: " + (data.mensaje || data.error));
            })
            .catch(err => console.error(err));
            return;
        }

        const btn = e.target.closest(".btn-edit");
        if (!btn) return;
        
        const idx = btn.dataset.idx;
        const c = ciclosLocales[idx];
        
        document.getElementById("edit-c-id").value = c.id_ciclo;
        document.getElementById("edit-c-nombre").value = c.nombre;
        document.getElementById("edit-c-numero").value = c.numero_ciclo;
        document.getElementById("edit-c-inicio").value = c.fecha_inicio;
        document.getElementById("edit-c-fin").value = c.fecha_fin;
        document.getElementById("edit-c-estado").value = c.estado || 'ACTIVO';
        
        // Seleccionar los valores correspondientes en los dropdowns
        document.getElementById("edit-c-periodo").value = c.id_periodo;
        document.getElementById("edit-c-tipo").value = c.id_tipo_ciclo;
        
        modalCiclo.style.display = "flex";
    });

    const cerrarModalCiclo = () => modalCiclo.style.display = "none";
    document.getElementById("btn-cerrar-modal-ciclo").addEventListener("click", cerrarModalCiclo);
    document.getElementById("btn-cancelar-modal-ciclo").addEventListener("click", cerrarModalCiclo);

    // ── GUARDAR EDICIÓN (PUT) ──
    document.getElementById("form-edit-ciclo").addEventListener("submit", function (e) {
        e.preventDefault();
        const id_ciclo = document.getElementById("edit-c-id").value;
        const payload = {
            nombre: document.getElementById("edit-c-nombre").value.trim(),
            numero_ciclo: parseInt(document.getElementById("edit-c-numero").value),
            fecha_inicio: document.getElementById("edit-c-inicio").value,
            fecha_fin: document.getElementById("edit-c-fin").value,
            id_periodo: parseInt(document.getElementById("edit-c-periodo").value),
            id_tipo_ciclo: parseInt(document.getElementById("edit-c-tipo").value),
            estado: document.getElementById("edit-c-estado").value
        };

        fetch(`http://127.0.0.1:5000/ciclos/${id_ciclo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("¡Ciclo actualizado correctamente!");
                cerrarModalCiclo();
                cargarTablaCiclos();
            } else {
                alert("Error: " + (data.mensaje || data.error));
            }
        }).catch(err => console.error(err));
    });
}

// ── FUNCIÓN GLOBAL PARA LLENAR LOS SELECTS ──────────────────
function cargarSelectsCiclo(idSelectPeriodo, idSelectTipo) {
    const selPeriodo = document.getElementById(idSelectPeriodo);
    const selTipo = document.getElementById(idSelectTipo);

    if (selPeriodo) {
        fetch("http://127.0.0.1:5000/periodos")
        .then(r => r.json())
        .then(data => {
            selPeriodo.innerHTML = '<option value="" disabled selected>Selecciona un periodo...</option>';
            if (data.success && data.periodos) {
                data.periodos.forEach(p => {
                    selPeriodo.innerHTML += `<option value="${p.id_periodo}">${p.anio} (${p.fecha_inicio} a ${p.fecha_fin})</option>`;
                });
            }
        }).catch(e => console.error(e));
    }

    if (selTipo) {
        fetch("http://127.0.0.1:5000/tipos-ciclo")
        .then(r => r.json())
        .then(data => {
            selTipo.innerHTML = '<option value="" disabled selected>Selecciona un tipo...</option>';
            if (data.success && data.tipos) {
                data.tipos.forEach(t => {
                    selTipo.innerHTML += `<option value="${t.id_tipo_ciclo}">${t.nombre}</option>`;
                });
            }
        }).catch(e => console.error(e));
    }
}