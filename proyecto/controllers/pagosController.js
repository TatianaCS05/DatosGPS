const pool = require('../config/db');

// Obtener todos los pagos
exports.getAllPagos = async (req, res) => {
    try {
        const result = await pool.query('SELECT nombre_cliente, placa, fecha_pago, valor_pagado, proximo_pago FROM pagos');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los pagos' });
    }
};

exports.getPagosByPlaca = async (req, res) => {
    const { placa } = req.params;
    try {
        const result = await pool.query('SELECT * FROM pagos WHERE placa = $1', [placa]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pagos para esta placa' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los pagos' });
    }
};




exports.updatePagoByPlaca = async (req, res) => {
    const { placa } = req.params;
    const { fecha_pago, valor_pagado, proximo_pago } = req.body;

    try {
        const result = await pool.query(
            'UPDATE pagos SET fecha_pago = $1, valor_pagado = $2, proximo_pago = $3 WHERE placa = $4 RETURNING *',
            [fecha_pago, valor_pagado, proximo_pago, placa]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pago no encontrado para esta placa' });
        }
        res.status(200).json({ message: 'Pago actualizado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el pago' });
    }
};


const predictAction = (pagoPendiente, clienteRecordado, tiempoDePago) => {
    // Aquí iría la lógica que determina si se debe enviar un recordatorio.
    // En este ejemplo, devolveremos una predicción simple con dos posibles acciones.
    return [1, 0]; // Simular que siempre se elige la acción "recordar"
};

exports.recordarPagosPendientes = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const result = await pool.query('SELECT * FROM pagos WHERE proximo_pago = $1', [hoy]);

        if (result.rows.length === 0) {
            return res.status(200).json({ mensaje: 'No hay pagos pendientes para hoy.' });
        }

        const mensajes = result.rows.map(pago => {
            // Definir características para la predicción
            const pagoPendiente = 1; // Ejemplo de que hay un pago pendiente
            const clienteRecordado = 1; // Ejemplo de que el cliente debe ser recordado
            const tiempoDePago = 0; // Modifica según tu lógica

            // Llama a la función predictAction para obtener la acción recomendada
            const action = predictAction(pagoPendiente, clienteRecordado, tiempoDePago);

            // Si la red neuronal (o función) indica que se debe recordar al cliente
            if (action[0] > action[1]) {
                return `Recordatorio: El cliente ${pago.nombre_cliente} con placa ${pago.placa} tiene un pago pendiente para hoy (${pago.proximo_pago}).`;
            }
            return null; // No recordar
        }).filter(Boolean); // Filtrar mensajes nulos

        res.status(200).json({ recordatorios: mensajes });
    } catch (error) {
        console.error('Error al obtener pagos pendientes:', error);
        res.status(500).json({ error: 'Error al obtener pagos pendientes' });
    }
};