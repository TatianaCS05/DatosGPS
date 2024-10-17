document.addEventListener('DOMContentLoaded', () => {
    // Elemento donde se insertarán los datos
    const tableBody = document.querySelector('#dataTable tbody');

    // Función para obtener los servicios instalaciones
    const fetchInstalaciones = async () => {
        try {
            const response = await fetch('http://localhost:3000/instalaciones');  // URL de tu ruta en el back-end
            const data = await response.json();

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="13">No hay servicios instalaciones disponibles</td></tr>';
            } else {
                renderTableRows(data);  // Renderiza los datos en la tabla
            }
        } catch (error) {
            console.error('Error al obtener los servicios instalaciones:', error);
            tableBody.innerHTML = '<tr><td colspan="13">Error al cargar los servicios instalaciones</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (instalaciones) => {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar
        instalaciones.forEach(instalaciones => {
            const row = `
                <tr>
                    <td><input type="checkbox" class="select-checkbox" data-placa="${instalaciones.placa}"></td>
                    <td>${instalaciones.placa}</td>

                    <td>${instalaciones.nombre_instalador}</td>

                    <td>${instalaciones.apagado}</td>

                    <td>${instalaciones.buzzer}</td>

                    <td>${instalaciones.microfono}</td>
                    

                    <td>${instalaciones.boton_panico}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Llamar a la función para obtener los datos cuando cargue la página
    fetchInstalaciones();
});