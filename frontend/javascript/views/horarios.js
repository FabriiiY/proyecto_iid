// ============================================================
//  views/horarios.js — Vista Estudiante: Carrusel de clases
// ============================================================
function renderViewHorarios(container) {

    container.innerHTML = `
        <div class="dashboard-header">
            <h1><span class="material-symbols-rounded">schedule</span> Clases de Hoy</h1>
            <p>Desliza para ver tus clases y marca tu asistencia al entrar al aula.</p>
        </div>

        <div class="carousel-wrapper">
            <button class="nav-btn prev" id="btn-prev">
                <span class="material-symbols-rounded">chevron_left</span>
            </button>
            <div class="carousel-track-container">
                <div class="carousel-track" id="carousel-track"></div>
            </div>
            <button class="nav-btn next" id="btn-next">
                <span class="material-symbols-rounded">chevron_right</span>
            </button>
        </div>
        <div class="carousel-indicators" id="carousel-indicators"></div>
    `;

    // TODO: reemplazar con fetch() GET /horarios cuando el backend esté listo
    const clases = [
        { id: "programacion", nombre: "Programación para la Industria 4.0", tipo: "Práctica", hora: "7:50 AM - 11:30 AM", docente: "Ing. Martínez",  aula: "Lab. 402"  },
        { id: "comunicacion", nombre: "Comunicación Oral y Escrita",         tipo: "Teoría",   hora: "11:30 AM - 2:00 PM", docente: "Lic. Hernández", aula: "Aula B-12" },
        { id: "redes",        nombre: "Escalabilidad en Redes",              tipo: "Teoría",   hora: "2:00 PM - 4:30 PM",  docente: "Ing. López",     aula: "Lab. 301"  }
    ];

    const track      = document.getElementById("carousel-track");
    const indicators = document.getElementById("carousel-indicators");

    clases.forEach((clase, i) => {
        const slide = document.createElement("div");
        slide.className = `class-slide ${clase.id}`;
        slide.innerHTML = `
            <div class="class-top-info">
                <span class="class-type">
                    <span class="material-symbols-rounded" style="font-size:1.1rem">
                        ${clase.tipo === "Práctica" ? "computer" : "menu_book"}
                    </span>
                    ${clase.tipo}
                </span>
                <span class="status-badge pending" id="badge-${i}">Pendiente</span>
            </div>
            <div class="class-main-info">
                <h2>${clase.nombre}</h2>
                <div class="class-time">
                    <span class="material-symbols-rounded">schedule</span> ${clase.hora}
                </div>
            </div>
            <div class="class-details">
                <div class="detail-item">
                    <span class="material-symbols-rounded icon">person</span>
                    <strong>Docente</strong>
                    <p>${clase.docente}</p>
                </div>
                <div class="detail-item">
                    <span class="material-symbols-rounded icon">room</span>
                    <strong>Ubicación</strong>
                    <p>${clase.aula}</p>
                </div>
            </div>
            <button class="attendance-btn" data-index="${i}">
                <span class="material-symbols-rounded">how_to_reg</span> Marcar Asistencia
            </button>
        `;
        track.appendChild(slide);

        const dot = document.createElement("div");
        dot.className = `dot ${i === 0 ? "active" : ""}`;
        indicators.appendChild(dot);
    });

    // Marcación
    track.querySelectorAll(".attendance-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const i     = this.getAttribute("data-index");
            const badge = document.getElementById(`badge-${i}`);
            this.classList.add("attended");
            this.innerHTML = `<span class="material-symbols-rounded">check_circle</span> Asistencia Confirmada`;
            badge.classList.replace("pending", "attended");
            badge.textContent = "Confirmada";
            // TODO: fetch POST /asistencia
        });
    });

    // Carrusel
    const dots    = indicators.querySelectorAll(".dot");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    let current   = 0;

    function goTo(index) {
        const slideW = track.querySelector(".class-slide").clientWidth + 20;
        track.scrollTo({ left: index * slideW, behavior: "smooth" });
        dots.forEach((d, i) => d.classList.toggle("active", i === index));
        current = index;
    }

    btnNext.addEventListener("click", () => { if (current < clases.length - 1) goTo(current + 1); });
    btnPrev.addEventListener("click", () => { if (current > 0) goTo(current - 1); });

    track.addEventListener("scroll", () => {
        const slideW    = track.querySelector(".class-slide").clientWidth + 20;
        const newIndex  = Math.round(track.scrollLeft / slideW);
        if (newIndex !== current) {
            current = newIndex;
            dots.forEach((d, i) => d.classList.toggle("active", i === current));
        }
    });
}