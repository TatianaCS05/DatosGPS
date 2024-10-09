document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#dataTable tbody');
    let selectedPlaca = null;  // Para almacenar la placa seleccionada

    // Función para obtener los servicios pagos
    const fetchPagos = async () => {
        try {
            console.log('Intentando obtener servicios pagos...');
            const response = await fetch('http://localhost:3000/pagos');
            
            // Verificar si la respuesta es correcta
            if (!response.ok) {
                console.error('Error en la respuesta del servidor:', response.statusText);
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos:', data); // Verifica los datos recibidos

            // Limpia la tabla antes de insertar nuevos datos
            tableBody.innerHTML = '';

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6">No hay servicios pagos disponibles</td></tr>';
            } else {
                renderTableRows(data);  // Renderiza los datos en la tabla
            }
        } catch (error) {
            console.error('Error al obtener los servicios pagos:', error);
            tableBody.innerHTML = '<tr><td colspan="6">Error al cargar los servicios pagos</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (pagos) => {
        console.log('Renderizando filas de la tabla...');

        // Limpia el contenido de la tabla antes de insertar nuevas filas
        tableBody.innerHTML = ''; 

        pagos.forEach(pago => {
            const row = `
                <tr>
                    <td><input type="checkbox" class="select-checkbox" data-placa="${pago.placa}"></td>
                    <td>${pago.nombre_cliente}</td>
                    <td>${pago.placa}</td>
                    <td>${pago.fecha_pago}</td>
                    <td>${pago.valor_pagado}</td>
                    <td>${pago.proximo_pago}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // Agregar eventos a los checkboxes después de que se renderizan
        attachCheckboxEvents();
    };

    // Función para gestionar la selección de un solo checkbox
    const attachCheckboxEvents = () => {
        const checkboxes = document.querySelectorAll('.select-checkbox');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                // Si se selecciona un checkbox, desmarcar todos los demás
                checkboxes.forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    }
                });

                // Guardar la placa seleccionada si el checkbox está marcado
                if (this.checked) {
                    selectedPlaca = this.getAttribute('data-placa');
                    console.log('Placa seleccionada:', selectedPlaca);
                } else {
                    selectedPlaca = null; // Desmarcar placa si se quita la selección
                }
            });
        });
    };

    // Modal y formulario
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('modal');
    const updatePagoForm = document.getElementById('updatePagoForm');

    // Abrir el modal cuando se presione el botón
    openModalBtn.addEventListener('click', () => {
        if (!selectedPlaca) {
            alert('Por favor selecciona una placa para actualizar');
            return;
        }
        modal.style.display = 'flex';
        // Cargar los datos del pago seleccionado para mostrar en el modal
        loadPagoData(selectedPlaca);
    });

    // Función para cargar los datos del pago en el modal
    const loadPagoData = async (placa) => {
        try {
            console.log('Cargando datos del pago para la placa:', placa);
            const response = await fetch(`http://localhost:3000/pagos/${placa}`);
            
            if (!response.ok) {
                console.error('Error al obtener datos del pago:', response.statusText);
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                alert('No se encontraron datos para esta placa');
                return;
            }

            console.log('Datos del pago cargados:', data);
            document.getElementById('fechaPago').value = data.fecha_pago;
            document.getElementById('Pago').value = data.valor_pagado;
            document.getElementById('proximoPago').value = data.proximo_pago;
        } catch (error) {
            console.error('Error al cargar los datos del pago:', error);
        }
    };

    // Cerrar el modal cuando se haga clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Lógica para enviar los datos del formulario al backend
    updatePagoForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar recargar la página

        // Obtener los valores de los inputs
        const fechaPago = document.getElementById('fechaPago').value;
        const pago = document.getElementById('Pago').value;
        const proximoPago = document.getElementById('proximoPago').value;

        // Validar que haya una placa seleccionada
        if (!selectedPlaca) {
            alert('No hay una placa seleccionada');
            return;
        }

        // Preparar los datos para enviar
        const data = {
            fecha_pago: fechaPago,
            valor_pagado: pago,
            proximo_pago: proximoPago
        };

        try {
            console.log('Enviando datos para actualizar el pago:', data);
            const response = await fetch(`http://localhost:3000/pagos/${selectedPlaca}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Pago actualizado correctamente');
                modal.style.display = 'none'; // Cerrar modal
                fetchPagos(); // Recargar los datos en la tabla
            } else {
                console.error('Error al actualizar el pago:', response.statusText);
                alert('Error al actualizar el pago');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });

    // Llamar a la función para obtener los datos cuando cargue la página
    fetchPagos();

    // Función para verificar y mostrar el recordatorio de pagos pendientes
    const checkPagosPendientes = async () => {
        try {
            const response = await fetch('http://localhost:3000/pagos/pendientes');
            const data = await response.json();
            
            const recordatorioContainer = document.getElementById('recordatorioContainer');
            recordatorioContainer.style.display = 'none'; // Ocultar inicialmente

            if (data.recordatorios && data.recordatorios.length > 0) {
                recordatorioContainer.innerHTML = data.recordatorios.join('<br/>'); // Mostrar recordatorios
                recordatorioContainer.style.display = 'block'; // Mostrar contenedor
            } else {
                recordatorioContainer.innerHTML = 'No hay pagos pendientes para hoy.';
                recordatorioContainer.style.display = 'block'; // Mostrar contenedor
            }
        } catch (error) {
            console.error('Error al obtener los pagos pendientes:', error);
            const recordatorioContainer = document.getElementById('recordatorioContainer');
            recordatorioContainer.innerHTML = 'Error al cargar los pagos pendientes.';
            recordatorioContainer.style.display = 'block'; // Mostrar contenedor
        }
    };

    // Llamar a la función para verificar los pagos pendientes
    checkPagosPendientes();

    // Nueva función para mostrar el mensaje de recordatorio
    const showReminderMessage = (mensaje) => {
        const recordatorioContainer = document.getElementById('recordatorioContainer');
        recordatorioContainer.innerHTML = mensaje; // Insertar el mensaje en el contenedor
        recordatorioContainer.style.display = 'block'; // Mostrar el contenedor
    };

    // Mostrar recordatorio si hay pagos pendientes
    const mostrarRecordatorioPagosPendientes = async () => {
        try {
            const response = await fetch('http://localhost:3000/pagos/pendientes');
            const data = await response.json();
            
            const pagosPendientes = data.recordatorios || []; // Asegúrate de que sea una lista

            if (pagosPendientes.length > 0) {
                const mensaje = pagosPendientes.join('<br/>'); // Formatea los recordatorios
                showReminderMessage(mensaje); // Mostrar el mensaje
            }
        } catch (error) {
            console.error('Error al obtener los pagos pendientes:', error);
        }
    };

    // Llamar a la función para mostrar recordatorios de pagos pendientes
    mostrarRecordatorioPagosPendientes();
});
