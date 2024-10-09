document.addEventListener('DOMContentLoaded', () => {
    // Elemento donde se insertarán los datos
    const tableBody = document.querySelector('#dataTable tbody');

    // Función para obtener los servicios personal
    const fetchPersonal = async () => {
        try {
            const response = await fetch('http://localhost:3000/personal');  // URL de tu ruta en el back-end
            const data = await response.json();

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="13">No hay servicios personal disponibles</td></tr>';
            } else {
                renderTableRows(data);  // Renderiza los datos en la tabla
            }
        } catch (error) {
            console.error('Error al obtener los servicios personal:', error);
            tableBody.innerHTML = '<tr><td colspan="13">Error al cargar los servicios personal</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (personal) => {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar
        personal.forEach(personal => {
            const row = `
                <tr>
                    <td><input type="checkbox"</td>
                    <td>${personal.nombre_personal}</td>

                    <td>${personal.usuario}</td>

                    <td>${personal.contraseña_hash}</td>

                    <td>${personal.rol}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Llamar a la función para obtener los datos cuando cargue la página
    fetchPersonal();
});