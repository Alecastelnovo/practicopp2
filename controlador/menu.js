document.addEventListener("DOMContentLoaded", function() {
    fetch('../modelo/ServidorTP.json')
        .then(response => response.json())
        .then(data => {
            const tablaBody = document.getElementById('tabla-menu-body');

            data.comida.forEach(comida => {
                const row = document.createElement('tr');

                // Columna del nombre del plato
                const platoCell = document.createElement('td');
                platoCell.textContent = comida.nombre_comida;
                row.appendChild(platoCell);

                // Columnas de las semanas
                for (let i = 1; i <= 4; i++) {
                    const semanaCell = document.createElement('td');
                    const semana = data.menu_semana.find(semana => semana.id_semana === i);
                    if (semana && semana.comida.includes(comida.id_comida)) {
                        semanaCell.textContent = 'X';
                        semanaCell.classList.add('disponible');
                    }
                    row.appendChild(semanaCell);
                }

                tablaBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
});


const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})

