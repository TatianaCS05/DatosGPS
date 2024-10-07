document.addEventListener('DOMContentLoaded', () => {
    // Elemento donde se insertarán los datos
    const tableBody = document.querySelector('#dataTable tbody');

    // Función para obtener los servicios pagos
    const fetchPagos = async () => {
        try {
            const response = await fetch('http://localhost:3000/pagos');  // URL de tu ruta en el back-end
            const data = await response.json();

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="13">No hay servicios pagos disponibles</td></tr>';
            } else {
                renderTableRows(data.data);  // Renderiza los datos en la tabla
            }
        } catch (error) {
            console.error('Error al obtener los servicios pagos:', error);
            tableBody.innerHTML = '<tr><td colspan="13">Error al cargar los servicios pagos</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (pagos) => {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar
        pagos.forEach(pagos => {
            const row = `
                <tr>
                    <td><input type="checkbox" class="select-checkbox" data-placa="${pagos.placa}"></td>
                    <td>${pagos.nombre_cliente}</td>
                    <td>${pagos.placa}</td>
                    <td>${pagos.fecha_pago}</td>
                    <td>${pagos.valor_pagado}</td>
                    <td>${pagos.proximo_pago}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Llamar a la función para obtener los datos cuando cargue la página
    fetchPagos();
});