async function obtenerUltimoIdComida() {
    try {
        const response = await fetch('http://localhost:3000/comida');
        const comidas = await response.json();

        if (comidas.length > 0) {
            const ultimoIdComida = comidas[comidas.length - 1].id_comida;
            return ultimoIdComida + 1;
        } else {
            return 1;
        }
    } catch (error) {
        console.error('Error al obtener el último ID de comida:', error);
        return null;
    }
}

async function agregarPlato() {
    try {
        const nuevoIdComida = await obtenerUltimoIdComida();

        if (nuevoIdComida === null) {
            alert('Error al obtener el último ID de comida');
            return;
        }

        const nuevoPlato = {
            id_comida: nuevoIdComida,
            nombre_comida: prompt('Ingrese el nombre del nuevo plato:')
        };

        const response = await fetch('http://localhost:3000/comida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoPlato)
        });

        if (response.ok) {
            alert('Plato agregado exitosamente');
        } else {
            alert('Error al agregar el plato');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el plato');
    }
}


async function obtenerIdComidaPorNombre(nombreComida) {
    try {
        const response = await fetch('http://localhost:3000/comida');
        const comidas = await response.json();
        const comida = comidas.find(comida => comida.nombre_comida === nombreComida);

        return comida ? comida.id_comida : null;
    } catch (error) {
        console.error('Error al obtener el ID de la comida:', error);
        return null;
    }
}

async function modificarPlato() {
    try {
        const nombreComida = prompt('Ingrese el nombre del plato a modificar:');
        const idPlato = await obtenerIdComidaPorNombre(nombreComida);

        if (idPlato === null) {
            alert('Plato no encontrado');
            return;
        }

        const nuevoNombre = prompt('Ingrese el nuevo nombre del plato:');

        const response = await fetch(`http://localhost:3000/comida/${idPlato}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre_comida: nuevoNombre })
        });

        if (response.ok) {
            alert('Plato modificado exitosamente');
        } else {
            alert('Error al modificar el plato');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al modificar el plato');
    }
}

async function eliminarPlato() {
    try {
        const nombreComida = prompt('Ingrese el nombre del plato a eliminar:');
        const idPlato = await obtenerIdComidaPorNombre(nombreComida);

        if (idPlato === null) {
            alert('Plato no encontrado');
            return;
        }

        const response = await fetch(`http://localhost:3000/comida/${idPlato}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Plato eliminado exitosamente');
        } else {
            alert('Error al eliminar el plato');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el plato');
    }
}

async function gestionarDisponibilidad() {
    try {
        const nombreComida = prompt('Ingrese el nombre del plato:');
        const idPlato = await obtenerIdComidaPorNombre(nombreComida);

        if (idPlato === null) {
            alert('Plato no encontrado');
            return;
        }

        const semanas = prompt('Ingrese las semanas en las que estará disponible el plato (separadas por comas):').split(',').map(Number);

        // Obtener el menú actual para cada semana y actualizarlo
        for (const semana of semanas) {
            const response = await fetch(`http://localhost:3000/menu_semana/${semana}`);
            const menuSemana = await response.json();

            if (!menuSemana.comida.includes(idPlato)) {
                menuSemana.comida.push(idPlato);
            }

            await fetch(`http://localhost:3000/menu_semana/${semana}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comida: menuSemana.comida })
            });
        }

        alert('Disponibilidad gestionada exitosamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al gestionar la disponibilidad');
    }
}
