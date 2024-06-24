document.addEventListener('DOMContentLoaded', () => {
    const usuarioForm = document.getElementById('usuario-form');
    const usernameInput = document.getElementById('username');
    const rolSelect = document.getElementById('rol');
    const usuarioIdInput = document.getElementById('usuario-id');
    const listaUsuariosDiv = document.getElementById('lista-usuarios');
    const cancelarBtn = document.getElementById('cancelar');

    const rolesDisponibles = [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'RRHH' },
        { id: 3, nombre: 'Empleado' },
        { id: 4, nombre: 'Proveedor' }
    ];

    // Precargar los roles en la listita de opciones
    rolesDisponibles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.id;
        option.textContent = rol.nombre;
        rolSelect.appendChild(option);
    });

    // Carga usuarios del localstorage
    function cargarUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        listaUsuariosDiv.innerHTML = '';
        usuarios.forEach(usuario => {
            agregarUsuarioALaLista(usuario);
        });
    }

    // Guardar un nuevo usuario o modificar uno existente
    function guardarUsuario(event) {
        event.preventDefault();

        const id = usuarioIdInput.value;
        const nombre = usernameInput.value;
        const rol = rolSelect.value;

        // Valida que no haya usuarios duplicados y que permite agregar 1 solo admin
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        if (usuarios.some(u => u.nombre === nombre && u.id !== id)) {
            alert('El nombre de usuario ya existe.');
            return;
        }

        if (rol == 1 && usuarios.some(u => u.rol == 1 && u.id !== id)) {
            alert('Solo puede haber un Administrador.');
            return;
        }

        if (id) {
            // Modificar usuario existente
            usuarios = usuarios.map(u => {
                if (u.id === id) {
                    return { id, nombre, rol };
                }
                return u;
            });
        } else {
            // Agregar un nuevo usuario
            const nuevoUsuario = {
                id: Date.now().toString(),
                nombre,
                rol
            };
            usuarios.push(nuevoUsuario);
        }

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        cargarUsuarios();
        usuarioForm.reset();
    }

    //  datos del usuario a modificar
    function mostrarFormulario(usuario) {
        usernameInput.value = usuario.nombre;
        rolSelect.value = usuario.rol;
        usuarioIdInput.value = usuario.id;
    }

    // Agregar usuario a la lista en la interfaz
    function agregarUsuarioALaLista(usuario) {
        const usuarioDiv = document.createElement('div');
        usuarioDiv.className = 'user';
        usuarioDiv.innerHTML = `
            <h3>${usuario.nombre} - ${rolesDisponibles.find(r => r.id == usuario.rol).nombre}</h3>
            <button class="editar-usuario">Editar</button>
            ${usuario.rol != 1 ? '<button class="eliminar-usuario">Eliminar</button>' : ''}
        `;

        usuarioDiv.querySelector('.editar-usuario').addEventListener('click', () => {
            mostrarFormulario(usuario);
        });

        if (usuario.rol != 1) {
            usuarioDiv.querySelector('.eliminar-usuario').addEventListener('click', () => {
                eliminarUsuario(usuario.id);
            });
        }

        listaUsuariosDiv.appendChild(usuarioDiv);
    }

    // Eliminar usuario
    function eliminarUsuario(id) {
        if (confirm('¿Seguro que queres eliminar este usuario?')) {
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            usuarios = usuarios.filter(u => u.id !== id);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            cargarUsuarios();
        }
    }

    // Inicializar la pagina con toda la info
    cargarUsuarios();
    usuarioForm.addEventListener('submit', guardarUsuario);
    cancelarBtn.addEventListener('click', () => {
        usuarioForm.reset();
        usuarioIdInput.value = '';
    });
});
