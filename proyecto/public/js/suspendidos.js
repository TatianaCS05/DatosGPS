document.addEventListener('DOMContentLoaded', () => {
    // Elemento donde se insertarán los datos
    const tableBody = document.querySelector('#dataTable tbody');

    // Función para obtener los servicios suspendidos
    const fetchSuspendidos = async () => {
        try {
            const response = await fetch('http://localhost:3000/suspendidos'); // URL de tu ruta en el back-end
            const data = await response.json();

            if (data.data.length === 0) { // Cambiar a data.data.length
                tableBody.innerHTML = '<tr><td colspan="13">No hay servicios suspendidos disponibles</td></tr>';
            } else {
                renderTableRows(data.data); // Renderiza los datos en la tabla
                addCheckboxEvent(); // Añadir evento después de renderizar
            }
        } catch (error) {
            console.error('Error al obtener los servicios suspendidos:', error);
            tableBody.innerHTML = '<tr><td colspan="13">Error al cargar los servicios suspendidos</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (suspendidos) => {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar
        suspendidos.forEach((suspendido) => {
            const row = `
                <tr>
                    <td><input type="checkbox" class="select-checkbox" data-placa="${suspendido.placa}"></td>
                    <td>${suspendido.nombre_cliente}</td>
                    <td>${suspendido.cc_nit}</td>
                    <td>${suspendido.celular}</td>
                    <td>${suspendido.email}</td>
                    <td>${suspendido.direccion}</td>
                    <td>${suspendido.placa}</td>
                    <td>${suspendido.imei_gps}</td>
                    <td>${suspendido.fecha_instalacion}</td>
                    <td>${suspendido.pago_inicial}</td>
                    <td>${suspendido.valor_mensualidad}</td>
                    <td>${suspendido.valor_total}</td>
                    <td>${suspendido.proximo_pago}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Lógica para permitir solo un checkbox seleccionado
    const addCheckboxEvent = () => {
        const checkboxes = document.querySelectorAll('.select-checkbox');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const selectedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);

                if (selectedCheckboxes.length > 1) {
                    // Si hay más de un checkbox seleccionado, deseleccionamos el último y mostramos un error
                    this.checked = false;
                    alert('Solo puedes seleccionar un servicio a la vez.');
                }
            });
        });
    };

    // Evento para reactivar el servicio
    document.getElementById('activarSelectedBtn').addEventListener('click', async () => {
        const selectedCheckbox = document.querySelector('.select-checkbox:checked');

        if (!selectedCheckbox) {
            alert('Debes seleccionar un servicio para reactivar.'); // Corregir mensaje
            return;
        }

        const placa = selectedCheckbox.getAttribute('data-placa');

        try {
            const response = await fetch(`http://localhost:3000/suspendidos/${placa}/reactivar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert(`Servicio con placa ${placa} reactivado con éxito.`); // Corregir mensaje
                fetchSuspendidos(); // Recargar la tabla después de reactivar el servicio
            } else {
                const error = await response.json();
                console.error('Error al reactivar el servicio:', error);
                alert('Error al reactivar el servicio: ' + error.message);
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
            alert('Error de red o servidor: ' + error.message);
        }
    });

    // Cargar los datos al cargar la página
    fetchSuspendidos();
});
