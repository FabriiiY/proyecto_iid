function initMarcacionCarousel() {
            // Datos extraídos de tu Horario.txt (Filtramos solo un día para el ejemplo del carrusel)
            const clasesDeHoy = [
                { id: "programacion", nombre: "Programación para la Industria 4.0", tipo: "Práctica", hora: "7:50 AM - 11:30 AM", docente: "Ing. Martínez", aula: "Lab. 402" },
                { id: "comunicacion", nombre: "Comunicación Oral y Escrita", tipo: "Teoría", hora: "11:30 AM - 2:00 PM", docente: "Lic. Hernández", aula: "Aula B-12" },
                { id: "redes", nombre: "Escalabilidad en Infraestructura de Redes", tipo: "Teoría", hora: "2:00 PM - 4:30 PM", docente: "Ing. López", aula: "Lab. 301" }
            ];

            const track = document.getElementById("carousel-track");
            const indicatorsContainer = document.getElementById("carousel-indicators");

            // 1. Generar tarjetas dinámicamente
            clasesDeHoy.forEach((clase, index) => {
                // Crear Tarjeta
                const slide = document.createElement("div");
                slide.className = `class-slide ${clase.id}`;
                slide.innerHTML = `
                    <div class="class-top-info">
                        <span class="class-type">
                            <span class="material-symbols-rounded" style="font-size: 1.1rem;">
                                ${clase.tipo === 'Práctica' ? 'computer' : 'menu_book'}
                            </span>
                            ${clase.tipo}
                        </span>
                        <span class="status-badge pending" id="status-${index}">Pendiente</span>
                    </div>

                    <div class="class-main-info">
                        <h2>${clase.nombre}</h2>
                        <div class="class-time">
                            <span class="material-symbols-rounded">schedule</span>
                            ${clase.hora}
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

                    <button class="attendance-btn" data-index="${index}">
                        <span class="material-symbols-rounded">how_to_reg</span>
                        Marcar Asistencia
                    </button>
                `;
                track.appendChild(slide);

                // Crear Puntito indicador
                const dot = document.createElement("div");
                dot.className = `dot ${index === 0 ? 'active' : ''}`;
                indicatorsContainer.appendChild(dot);
            });

            // 2. Lógica de Marcación
            const attendanceBtns = document.querySelectorAll('.attendance-btn');
            attendanceBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    const badge = document.getElementById(`status-${index}`);
                    
                    // Cambiar botón
                    this.classList.add('attended');
                    this.innerHTML = `<span class="material-symbols-rounded">check_circle</span> Asistencia Confirmada`;
                    
                    // Cambiar badge superior
                    badge.classList.remove('pending');
                    badge.classList.add('attended');
                    badge.textContent = 'Confirmada';
                });
            });

            // 3. Navegación del Carrusel
            const btnPrev = document.getElementById("btn-prev");
            const btnNext = document.getElementById("btn-next");
            const dots = document.querySelectorAll('.dot');
            
            let currentIndex = 0;

            function updateCarousel(index) {
                const slides = document.querySelectorAll('.class-slide');
                if(slides.length === 0) return;
                
                const slideWidth = slides[0].clientWidth + 20; // +20 por el gap
                track.scrollTo({
                    left: index * slideWidth,
                    behavior: 'smooth'
                });

                // Actualizar puntitos
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }

            btnNext.addEventListener("click", () => {
                if (currentIndex < clasesDeHoy.length - 1) {
                    currentIndex++;
                    updateCarousel(currentIndex);
                }
            });

            btnPrev.addEventListener("click", () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel(currentIndex);
                }
            });

            // Actualizar índice si el usuario hace swipe/scroll manualmente
            track.addEventListener('scroll', () => {
                const slides = document.querySelectorAll('.class-slide');
                if(slides.length === 0) return;
                const slideWidth = slides[0].clientWidth + 20;
                
                // Calcular qué tarjeta está más visible
                const newIndex = Math.round(track.scrollLeft / slideWidth);
                
                if(newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }
            });
}