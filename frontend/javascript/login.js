const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    try {

        const respuesta = await fetch(
            "http://127.0.0.1:5000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo,
                    password
                })
            }
        );

        const datos = await respuesta.json();

        if(datos.success){

            localStorage.setItem(
                "usuarioActivo",
                JSON.stringify(datos.usuario)
            );

            window.location.href =
                "../html/main-dashboard.html";

        } else {

            alert(datos.mensaje);

        }

    } catch(error){

        console.error(error);

        alert(
            "No se pudo conectar con el servidor."
        );

    }

});