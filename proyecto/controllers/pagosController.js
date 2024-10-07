const pool = require('../config/db');

// Obtener todos los pagos
exports.getAllPagos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pagos');
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


// Actualizar un pago por placa
exports.updatePagoByPlaca = async (req, res) => {
    const { placa } = req.params;
    const { nombre_cliente, fecha_pago, valor_pagado, proximo_pago } = req.body; // Eliminar id_servicio
    try {
        const result = await pool.query(
            'UPDATE pagos SET nombre_cliente = $1, fecha_pago = $2, valor_pagado = $3, proximo_pago = $4 WHERE placa = $5 RETURNING *',
            [nombre_cliente, fecha_pago, valor_pagado, proximo_pago, placa] // Actualizar consulta para excluir id_servicio
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
