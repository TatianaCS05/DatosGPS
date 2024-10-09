const pool = require('../config/db');

exports.getAllSuspendidos = async (req, res) => {
  console.log('Recibiendo solicitud para obtener todos los suspendidos'); // Mensaje al recibir la solicitud
  try {
    const result = await pool.query('SELECT nombre_cliente, cc_nit, celular, email, direccion,placa, imei_gps, fecha_instalacion, pago_inicial, valor_mensualidad, valor_total, proximo_pago FROM suspendidos');
    console.log('Consulta ejecutada, resultados:'); // Mostrar resultados obtenidos

    if (result.rows.length === 0) {
      console.log('No hay suspendidos disponibles'); // Mensaje si no hay datos
      return res.status(200).json({ message: 'No hay suspendidos disponibles', data: [] });
    }

    console.log('Suspendidos recuperados con éxito'); // Mensaje de éxito
    res.status(200).json({
      message: 'Suspendidos recuperados con éxito',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al recuperar los suspendidos:', error); // Mensaje de error
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.reactivarServicio = async (req, res) => {
    const { placa } = req.params;

    try {
        // Actualiza el estado del servicio en la tabla suspendidos a activo
        const updateResult = await pool.query(
            `UPDATE suspendidos SET estado = 'activo' WHERE placa = $1 RETURNING *`,
            [placa]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ message: 'Servicio no encontrado en suspendidos' });
        }

        // (Opcional) Puedes mover el registro a la tabla de activos si es necesario.

        res.json({ message: 'Servicio reactivado correctamente', servicio: updateResult.rows[0] });
    } catch (error) {
        console.error('Error al reactivar el servicio:', error);
        res.status(500).json({ message: 'Error al reactivar el servicio', error: error.message });
    }
};
