function initAdminPanel() {
  // NAVEGACIÓN ENTRE SUBMENÚS ADMIN
  const navAddStudents = document.getElementById("nav-add-students");
  const navAddUsers = document.getElementById("nav-add-users");

  const viewStudents = document.getElementById("admin-view-students");
  const viewUsers = document.getElementById("admin-view-users");

  // Mostrar vista estudiantes
  navAddStudents.addEventListener("click", (e) => {
    e.preventDefault();

    viewStudents.style.display = "block";
    viewUsers.style.display = "none";

    navAddStudents.classList.add("active");
    navAddUsers.classList.remove("active");
  });

  // Mostrar vista usuarios
  navAddUsers.addEventListener("click", (e) => {
    e.preventDefault();

    viewStudents.style.display = "none";
    viewUsers.style.display = "block";

    navAddUsers.classList.add("active");
    navAddStudents.classList.remove("active");
  });


// LÓGICA DE ESTUDIANTES
  const form = document.getElementById("add-student-form");
  const tbody = document.getElementById("students-tbody");
  const table = document.getElementById("students-table");
  const emptyMsg = document.getElementById("empty-students-msg");
  const clearBtn = document.getElementById("clear-students-btn");

  let estudiantesTemporales =
    JSON.parse(localStorage.getItem("sami_estudiantes")) || [];

  function saveStudents() {
    localStorage.setItem(
      "sami_estudiantes",
      JSON.stringify(estudiantesTemporales),
    );
  }

  function renderStudents() {
    tbody.innerHTML = "";

    if (estudiantesTemporales.length === 0) {
      emptyMsg.style.display = "block";
      table.style.display = "none";
      clearBtn.style.display = "none";
    } else {
      emptyMsg.style.display = "none";
      table.style.display = "table";
      clearBtn.style.display = "inline-flex";

      estudiantesTemporales.forEach((estudiante, index) => {
        const tr = document.createElement("tr");

        const materiasHtml = estudiante.materias
          .map((m) => `<span class="subject-tag">${m}</span>`)
          .join("");

        tr.innerHTML = `
                    <td>
                        <strong>${estudiante.nombre}</strong>
                    </td>

                    <td>
                        ${
                          materiasHtml ||
                          '<span style="color:#aaa; font-size:0.8rem;">Sin materias asignadas</span>'
                        }
                    </td>

                    <td style="text-align:center;">
                        <button
                            class="btn-danger delete-single"
                            data-index="${index}"
                            style="padding:6px; border-radius:6px;"
                            title="Borrar estudiante"
                        >
                            <span
                                class="material-symbols-rounded"
                                style="font-size:1.1rem; display:block;"
                            >
                                close
                            </span>
                        </button>
                    </td>
                `;

        tbody.appendChild(tr);
      });

      document.querySelectorAll(".delete-single").forEach((btn) => {
        btn.addEventListener("click", function () {
          const idx = this.getAttribute("data-index");

          estudiantesTemporales.splice(idx, 1);

          saveStudents();
          renderStudents();
        });
      });
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreInput = document.getElementById("student-name");

    const checkboxes = document.querySelectorAll(
      ".subject-checkbox input:checked",
    );

    const materias = Array.from(checkboxes).map((cb) => cb.value);

    estudiantesTemporales.push({
      nombre: nombreInput.value.trim(),
      materias: materias,
    });

    saveStudents();

    nombreInput.value = "";

    document
      .querySelectorAll(".subject-checkbox input")
      .forEach((cb) => (cb.checked = false));

    renderStudents();
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("¿Estás seguro de borrar todos los estudiantes temporales?")) {
      estudiantesTemporales = [];

      saveStudents();
      renderStudents();
    }
  });

  renderStudents();


  // LÓGICA DE USUARIOS
  const userForm = document.getElementById("add-user-form");
  const usersTbody = document.getElementById("users-tbody");
  const usersTable = document.getElementById("users-table");
  const emptyUsersMsg = document.getElementById("empty-users-msg");
  const clearUsersBtn = document.getElementById("clear-users-btn");

  let usuariosTemporales =
    JSON.parse(localStorage.getItem("sami_usuarios_credenciales")) || [];

  function saveUsers() {
    localStorage.setItem(
      "sami_usuarios_credenciales",
      JSON.stringify(usuariosTemporales),
    );
  }

  function renderUsers() {
    usersTbody.innerHTML = "";

    if (usuariosTemporales.length === 0) {
      emptyUsersMsg.style.display = "block";
      usersTable.style.display = "none";
      clearUsersBtn.style.display = "none";
    } else {
      emptyUsersMsg.style.display = "none";
      usersTable.style.display = "table";
      clearUsersBtn.style.display = "inline-flex";

      usuariosTemporales.forEach((user, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
                    <td>
                        <strong>${user.nombre}</strong><br>

                        <span
                            style="
                                font-size:0.8rem;
                                color:#888;
                            "
                        >
                            ${user.correo}
                        </span>
                    </td>

                    <td>${user.carnet}</td>

                    <td>
                        <span class="subject-tag">
                            ${user.grupo}
                        </span>
                    </td>

                    <td style="text-align:center;">
                        <button
                            class="btn-danger delete-user-single"
                            data-index="${index}"
                            style="padding:6px; border-radius:6px;"
                            title="Borrar usuario"
                        >
                            <span
                                class="material-symbols-rounded"
                                style="font-size:1.1rem; display:block;"
                            >
                                close
                            </span>
                        </button>
                    </td>
                `;

        usersTbody.appendChild(tr);
      });

      document.querySelectorAll(".delete-user-single").forEach((btn) => {
        btn.addEventListener("click", function () {
          const idx = this.getAttribute("data-index");

          usuariosTemporales.splice(idx, 1);

          saveUsers();
          renderUsers();
        });
      });
    }
  }

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    usuariosTemporales.push({
      nombre: document.getElementById("new-user-name").value.trim(),

      correo: document.getElementById("new-user-email").value.trim(),

      carnet: document.getElementById("new-user-carnet").value.trim(),

      grupo: document.getElementById("new-user-group").value.trim(),

      password: document.getElementById("new-user-password").value,
    });

    saveUsers();

    userForm.reset();

    renderUsers();
  });

  clearUsersBtn.addEventListener("click", () => {
    if (confirm("¿Estás seguro de borrar todas las credenciales?")) {
      usuariosTemporales = [];

      saveUsers();
      renderUsers();
    }
  });

  renderUsers();
}
