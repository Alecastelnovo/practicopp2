document.getElementById("formulario-login").addEventListener("submit", function (event) {
    event.preventDefault();
    
    // para guardar lo que se pone en el input
    var usuario_login = document.getElementById("username").value;
    var usuario_pass = document.getElementById("password").value;

    mostrarMensajeValidando();

    setTimeout(() => {
        fetch('../modelo/ServidorTP.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el archivo JSON.');
                }
                return response.json();
            })
            .then(data => {

                // Compara lo que se puso en el input con lo que esta guardado en el json
                var usuarioValido = data.usuario.find(user => 
                    user.usuario_login === usuario_login && user.usuario_pass === usuario_pass
                );

                if (usuarioValido) {
                    mostrarMensajeIngresoCorrecto();
                    
                    localStorage.setItem('usuarioActual', JSON.stringify(usuarioValido));

                    // Redirigir segun el rol
                    setTimeout(() => {
                        switch (usuarioValido.id_rol) {
                            case 1:
                                window.location.href = "admin.html";
                                break;
                            case 2:
                                window.location.href = "rrhh.html";
                                break;
                            case 3:
                                window.location.href = "proveedor.html"
                                break;
                            case 4:
                                window.location.href = "empleado.html"
                                break;
                            default:
                                window.location.href = "menu.html";
                                break;
                        }
                    }, 1000);
                } else {
                    // Mensaje de error si no coinciden
                    mostrarMensajeError("Usuario o contraseña incorrectos");
                }
            })
            .catch(error => {
                // Tambien mensaje de error si el json no anda
                console.error('Error al cargar el archivo JSON:', error);
                mostrarMensajeError("Error al cargar el archivo JSON.");
            });
    }, 1500);
});

// Funciones para mostrar mensajes en la interfaz que carga

function mostrarMensajeValidando() {
    var mensajeError = document.getElementById("mensaje-error");
    mensajeError.textContent = "Validando credenciales...";
    mensajeError.style.color = "#fff";
}

function mostrarMensajeIngresoCorrecto() {
    var mensajeError = document.getElementById("mensaje-error");
    mensajeError.textContent = "Ingreso correcto";
    mensajeError.style.color = "green";
}

function mostrarMensajeError(mensaje) {
    var mensajeError = document.getElementById("mensaje-error");
    mensajeError.textContent = mensaje;
    mensajeError.style.color = "red";
}
