document.addEventListener('DOMContentLoaded', () => {
    const agregarPedidoBtn = document.getElementById('agregar-pedido');
    const formularioPedidoDiv = document.getElementById('formulario-pedido');
    const pedidoForm = document.getElementById('pedido-form');
    const listaPedidosDiv = document.getElementById('lista-pedidos');
    const mensajeErrorDiv = document.getElementById('mensaje-error');
    const selectPlato = document.getElementById('plato');
    const selectDia = document.getElementById('dia');
    const cancelarPedidoBtn = document.getElementById('cancelar-pedido');

    // Variable para almacenar platos disponibles
    let platosDisponibles = [];

    // Variable para almacenar pedidos
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Cargar platos disponibles desde el JSON
    function cargarPlatosDisponibles() {
        fetch('/modelo/ServidorTP.json')
            .then(response => response.json())
            .then(data => {
                platosDisponibles = data.comida; // Guardamos los platos en la variable global
                platosDisponibles.forEach(plato => {
                    const option = document.createElement('option');
                    option.value = plato.id_comida.toString(); // El valor del option es el id_comida
                    option.textContent = plato.nombre_comida;
                    selectPlato.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar los platos:', error);
                mostrarMensajeError('Error al cargar los platos disponibles.');
            });
    }

    // Cargar la lista de pedidos
    function cargarPedidos() {
        listaPedidosDiv.innerHTML = ''; // Limpiar la lista de pedidos
        pedidos.forEach(pedido => {
            agregarPedidoALaLista(pedido);
        });
    }

    // Mostrar formulario de pedido para agregar o modificar
    function mostrarFormulario(pedido) {
        formularioPedidoDiv.style.display = 'block';
        if (pedido) {
            selectPlato.value = pedido.plato;
            selectDia.value = pedido.dia;
        } else {
            pedidoForm.reset();
        }
    }

    // Ocultar formulario de pedido
    function ocultarFormulario() {
        formularioPedidoDiv.style.display = 'none';
        pedidoForm.reset();
    }

    // Guardar pedido (simulado)
    function guardarPedido(event) {
        event.preventDefault();
        const platoId = selectPlato.value;
        const dia = selectDia.value;

        if (!platoId || !dia) {
            mostrarMensajeError('Tenes que elegir un plato y un dia.');
            return;
        }

        const platoNombre = platosDisponibles.find(plato => plato.id_comida.toString() === platoId).nombre_comida;

        const nuevoPedido = {
            usuario: JSON.parse(localStorage.getItem('usuarioActual')).usuario_login, // Usar el usuario logueado
            plato: platoNombre, // Guardar el nombre del plato en vez del ID
            dia: dia,
            fecha: new Date().toISOString()
        };

        // Agregar el nuevo pedido a la lista local
        pedidos.push(nuevoPedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        mostrarMensajeExito('Pedido guardado exitosamente.');
        agregarPedidoALaLista(nuevoPedido);
        ocultarFormulario();
    }

    // Agregar pedido a la lista en la interfaz
    function agregarPedidoALaLista(pedido) {
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'pedido';
        pedidoDiv.innerHTML = `
            <h3>${pedido.usuario} - ${pedido.fecha.split('T')[0]}</h3>
            <p>${pedido.plato} para ${pedido.dia}</p>
            <button class="modificar-pedido">Modificar</button>
            <button class="eliminar-pedido">Eliminar</button>
        `;
        listaPedidosDiv.appendChild(pedidoDiv);

        // Esto sirve para agregar funcionalidad a los botones de modificar y eliminar
        pedidoDiv.querySelector('.modificar-pedido').addEventListener('click', () => {
            mostrarFormulario(pedido);
        });
        pedidoDiv.querySelector('.eliminar-pedido').addEventListener('click', () => {
            eliminarPedido(pedidoDiv, pedido);
        });
    }

    // Eliminar pedido (Solamente lo simula)
    function eliminarPedido(pedidoDiv, pedido) {
        if (confirm(`¿Seguro que desea eliminar el pedido de ${pedido.usuario} para ${pedido.dia}?`)) {
            // Eliminar el pedido de la lista local
            pedidos = pedidos.filter(p => p !== pedido);
            localStorage.setItem('pedidos', JSON.stringify(pedidos)); // Para guardarlo en localStorage

            mostrarMensajeExito('Pedido eliminado exitosamente.');
            pedidoDiv.remove();
        }
    }

    // Mostrar mensaje de error
    function mostrarMensajeError(mensaje) {
        mensajeErrorDiv.textContent = mensaje;
        mensajeErrorDiv.style.color = 'red';
        setTimeout(() => {
            mensajeErrorDiv.textContent = '';
        }, 5000);
    }

    // Mostrar mensaje de éxito
    function mostrarMensajeExito(mensaje) {
        mensajeErrorDiv.textContent = mensaje;
        mensajeErrorDiv.style.color = 'green';
        setTimeout(() => {
            mensajeErrorDiv.textContent = '';
        }, 5000);
    }

    // Eventos
    agregarPedidoBtn.addEventListener('click', () => mostrarFormulario(null));
    pedidoForm.addEventListener('submit', guardarPedido);
    cancelarPedidoBtn.addEventListener('click', ocultarFormulario);

    // Inicializar
    cargarPlatosDisponibles();
    cargarPedidos();
});
