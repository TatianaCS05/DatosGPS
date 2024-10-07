

document.addEventListener('DOMContentLoaded', () => {
    // Elemento donde se insertarán los datos
    const tableBody = document.querySelector('#dataTable tbody');

    // Función para obtener los servicios activos
    const fetchActivos = async () => {
        try {
            const response = await fetch('http://localhost:3000/activos');  // URL de tu ruta en el back-end
            const data = await response.json();

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="13">No hay servicios activos disponibles</td></tr>';
            } else {
                renderTableRows(data.data);  // Renderiza los datos en la tabla
            }
        } catch (error) {
            console.error('Error al obtener los servicios activos:', error);
            tableBody.innerHTML = '<tr><td colspan="13">Error al cargar los servicios activos</td></tr>';
        }
    };

    // Función para renderizar los datos en la tabla
    const renderTableRows = (activos) => {
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar
        activos.forEach(activo => {
            const row = `
                <tr>
                    <td><input type="checkbox" class="select-checkbox" data-placa="${activo.placa}"></td>
                    <td>${activo.nombre_cliente}</td>
                    <td>${activo.cc_nit}</td>
                    <td>${activo.celular}</td>
                    <td>${activo.email}</td>
                    <td>${activo.direccion}</td>
                    <td>${activo.placa}</td>
                    <td>${activo.imei_gps}</td>
                    <td>${activo.fecha_instalacion}</td>
                    <td>${activo.pago_inicial}</td>
                    <td>${activo.valor_mensualidad}</td>
                    <td>${activo.valor_total}</td>
                    <td>${activo.proximo_pago}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Llamar a la función para obtener los datos cuando cargue la página
    fetchActivos();
 // Configuración del modal
 // Configuración del modal
    const openModalBtn = document.getElementById("openModalBtn");
    openModalBtn.onclick = function() {
        fetch('http://localhost:3000/formularioNuevoView/formularioNuevo.html') // Ruta del archivo HTML
            .then(response => {
                if (!response.ok) {
                    console.error('Error al cargar el formulario:', response.statusText);
                    throw new Error('Error al cargar el formulario');
                }
                return response.text();
            })
            .then(data => {
                newServiceModal.innerHTML = `<div class="modal-content">${data}</div>`; // Cargar el contenido
                newServiceModal.style.display = "block"; // Mostrar el modal
                // Añadir eventos para el formulario dentro del modal
                attachModalEvents();
            })
            .catch(error => {
                console.error('Error al abrir el modal:', error);
            });
    };

    // Función para manejar el evento de envío del formulario
    const attachModalEvents = () => {
        const form = newServiceModal.querySelector('#addServiceForm');
        if (form) {
            form.addEventListener('submit', async function(event) {
                event.preventDefault(); // Evita que se recargue la página
                // Recopila los datos del formulario
                const formData = {
                    nombre_cliente: document.getElementById('nombreCliente').value,
                    cc_nit: document.getElementById('cedula').value,
                    placa: document.getElementById('placa').value,
                    valor_total: document.getElementById('valorTotal').value,
                    email: document.getElementById('correo').value,
                    numero_dispositivo: document.getElementById('dispositivo').value,
                    celular: document.getElementById('celular').value,
                    direccion: document.getElementById('direccion').value,
                    pago_inicial: document.getElementById('inicial').value,
                    valor_mensualidad: document.getElementById('mensualidad').value,
                    proximo_pago: document.getElementById('proximoPago').value,
                    fecha_instalacion: document.getElementById('fechaInstalacion').value,
                    nombre_instalador: document.getElementById('nombreInstalador').value,
                    tipo_vehiculo: document.getElementById('tipo').value,
                    marca_vehiculo: document.getElementById('marca').value,
                    modelo_vehiculo: document.getElementById('modelo').value,
                    apagado: document.getElementById('conApagado').checked,
                    buzzer: document.getElementById('conBuzzer').checked,
                    boton_panico: document.getElementById('conPanico').checked
                };
                try {
                    // Realiza la solicitud al backend
                    const response = await fetch('http://localhost:3000/activos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    // Maneja la respuesta del servidor
                    if (response.ok) {
                        const result = await response.json();
                        alert('Servicio añadido con éxito: ' + result.message); // Muestra el mensaje de éxito
                        this.reset(); // Reinicia el formulario
                        newServiceModal.style.display = 'none'; // Cierra el modal después de añadir
                        fetchActivos(); // Vuelve a cargar la tabla de servicios
                    } else {
                        const error = await response.json();
                        console.error('Error al añadir el servicio:', error);
                        alert('Error al añadir el servicio: ' + error.message); // Muestra el mensaje de error
                    }
                } catch (err) {
                    console.error('Error de red o servidor:', err);
                    alert('Error de red o servidor: ' + err.message); // Muestra un error si la solicitud falla
                }
            });
        }
    };

    // Cerrar el modal si se hace clic fuera de él
    window.onclick = function(event) {
        if (event.target === newServiceModal) {
            newServiceModal.style.display = 'none';
        }
    };



  // SUSPENDER POR PLACA

     
    const addCheckboxEvent = () => {
        const checkboxes = document.querySelectorAll('.select-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const selectedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
                
                if (selectedCheckboxes.length > 1) {
                    // Si hay más de un checkbox seleccionado, deseleccionamos el último y mostramos un error
                    this.checked = false;
                    alert('Solo puedes suspender un servicio a la vez.');
                }
            });
        });
    };

    document.getElementById('suspendSelectedBtn').addEventListener('click', async () => {
        const selectedCheckbox = document.querySelector('.select-checkbox:checked');

        if (!selectedCheckbox) {
            alert('Debes seleccionar un servicio para suspender.');
            return;
        }

        const placa = selectedCheckbox.getAttribute('data-placa');

        try {
            const response = await fetch(`http://localhost:3000/activos/${placa}/suspender`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert(`Servicio con placa ${placa} suspendido con éxito.`);
            } else {
                const error = await response.json();
                console.error('Error al suspender el servicio:', error);
                alert('Error al suspender el servicio: ' + error.message);
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
            alert('Error de red o servidor: ' + error.message);
        }

        // Recargar la tabla después de suspender el servicio
        fetchActivos();
    });
});












