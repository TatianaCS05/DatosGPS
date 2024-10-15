const client = require('../config/db');

exports.getAllSuspendidos = async (req, res) => {
  console.log('Recibiendo solicitud para obtener todos los suspendidos'); // Mensaje al recibir la solicitud
  try {
    const result = await client.query('SELECT nombre_cliente, cc_nit, celular, email, direccion,placa, imei_gps, fecha_instalacion, pago_inicial, valor_mensualidad, valor_total, proximo_pago FROM suspendidos');
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
      // Primero, verifica si el servicio está en la tabla suspendidos
      const serviceInSuspendidos = await client.query(
          `SELECT * FROM suspendidos WHERE placa = $1`,
          [placa]
      );

      if (serviceInSuspendidos.rows.length === 0) {
          return res.status(404).json({ message: 'Servicio no encontrado en suspendidos' });
      }

      // Recupera el servicio que se reactivará
      const servicio = serviceInSuspendidos.rows[0];

      // Actualiza el estado del servicio en la tabla suspendidos a activo
      await client.query(
          `UPDATE suspendidos SET estado = 'activo' WHERE placa = $1`,
          [placa]
      );

      // Inserta el servicio reactivado en la tabla activos
      const insertResult = await client.query(
          `INSERT INTO activos (nombre_cliente, cc_nit, celular, email, direccion, placa, imei_gps,
          fecha_instalacion, pago_inicial, valor_mensualidad, valor_total, proximo_pago, estado)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'activo') RETURNING *`,
          [
              servicio.nombre_cliente,
              servicio.cc_nit,
              servicio.celular,
              servicio.email,
              servicio.direccion,
              servicio.placa,
              servicio.imei_gps,
              servicio.fecha_instalacion,
              servicio.pago_inicial,
              servicio.valor_mensualidad,
              servicio.valor_total,
              servicio.proximo_pago,
          ]
      );

      // (Opcional) Puedes eliminar el registro de la tabla suspendidos después de moverlo a activos
      await client.query(`DELETE FROM suspendidos WHERE placa = $1`, [placa]);

      res.json({ message: 'Servicio reactivado correctamente', servicio: insertResult.rows[0] });
  } catch (error) {
      console.error('Error al reactivar el servicio:', error);
      res.status(500).json({ message: 'Error al reactivar el servicio', error: error.message });
  }
};