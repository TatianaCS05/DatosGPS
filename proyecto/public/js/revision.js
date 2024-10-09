document.addEventListener('DOMContentLoaded', () => {
    // Elemento donde se insertarán los datos
    const tableBody = document.querySelector('#dataTable tbody');

    // Función para obtener los servicios revision
    const fetchRevision = async () => {
        try {
            const response = await fetch('http://localhost:3000/revision');  // URL de tu ruta en el back-end
            const data = await response.json();

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="13">No hay servicios revision disponibles</td></tr>';
            } else {
                renderTableRows(data);  // Renderiza los datos en la tabla
            }
        } catch (error) {
            console.error('Error al obtener los servicios revision:', error);
            tableBody.innerHTML = '<tr><td colspan="13">Error al cargar los servicios revision</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (revision) => {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar
        revision.forEach(revision => {
            const row = `
                <tr>
                    <td><input type="checkbox" class="select-checkbox" data-placa="${revision.placa}"></td>
                    <td>${revision.imei_gps}</td>

                    <td>${revision.placa}</td>

                    <td>${revision.fecha_instalacion}</td>

                    <td>${revision.observaciones}</td>

                    <td>${revision.fecha_revision}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Llamar a la función para obtener los datos cuando cargue la página
    fetchRevision();
});