document.addEventListener('DOMContentLoaded', () => {
    // Elemento donde se insertarán los datos
    const tableBody = document.querySelector('#dataTable tbody');

    // Función para obtener los servicios gps
    const fetchGps = async () => {
        try {
            const response = await fetch('http://localhost:3000/gps');  // URL de tu ruta en el back-end
            const data = await response.json();

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="13">No hay servicios gps disponibles</td></tr>';
            } else {
                renderTableRows(data);  // Renderiza los datos en la tabla
            }
        } catch (error) {
            console.error('Error al obtener los servicios gps:', error);
            tableBody.innerHTML = '<tr><td colspan="13">Error al cargar los servicios gps</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (gps) => {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar
        gps.forEach(gps => {
            const row = `
                <tr>
                    <td><input type="checkbox" class="select-checkbox" data-placa="${gps.placa}"></td>
                    <td>${gps.imei}</td>

                    <td>${gps.modelo_gps}</td>

                    <td>${gps.numero_dispositivo}</td>

                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Llamar a la función para obtener los datos cuando cargue la página
    fetchGps();
});