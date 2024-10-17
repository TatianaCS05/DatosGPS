document.addEventListener('DOMContentLoaded', () => {
    // Elemento donde se insertarán los datos
    const tableBody = document.querySelector('#dataTable tbody');

    // Función para obtener los servicios vehiculos
    const fetchVehiculos = async () => {
        try {
            const response = await fetch('http://localhost:3000/vehiculos');  // URL de tu ruta en el back-end
            const data = await response.json();

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="13">No hay servicios vehiculos disponibles</td></tr>';
            } else {
                renderTableRows(data);  // Renderiza los datos en la tabla
            }
        } catch (error) {
            console.error('Error al obtener los servicios vehiculos:', error);
            tableBody.innerHTML = '<tr><td colspan="13">Error al cargar los servicios vehiculos</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (vehiculos) => {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar
        vehiculos.forEach(vehiculos => {
            const row = `
                <tr>
                    <td><input type="checkbox" class="select-checkbox" data-placa="${vehiculos.placa}"></td>
                    <td>${vehiculos.placa}</td>

                    <td>${vehiculos.modelo}</td>

                    <td>${vehiculos.marca}</td>

                    <td>${vehiculos.tipo_vehiculo}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Llamar a la función para obtener los datos cuando cargue la página
    fetchVehiculos();
});