const pool = require('../config/db'); 

exports.getAllActivos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activos');
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No hay activos disponibles', data: [] });
    }
    res.status(200).json({
      message: 'Activos recuperados con éxito',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al recuperar los activos:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.getActivoByPlaca = async (req, res) => {
  const { placa } = req.params;
  try {
    const result = await pool.query('SELECT * FROM activos WHERE placa = $1', [placa]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Servicio activo no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el servicio activo:', error);
    res.status(500).json({ message: 'Error al obtener el servicio activo', error: error.message });
  }
};


exports.suspendActivo = async (req, res) => {
  const { placa } = req.params; 
  const { motivo_suspension } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO suspendidos (id_servicio, nombre_cliente, cc_nit, celular, email, direccion, placa, imei_gps, 
        fecha_instalacion, pago_inicial, valor_mensualidad, valor_total, proximo_pago, motivo_suspension)
       SELECT id_servicio, nombre_cliente, cc_nit, celular, email, direccion, placa, imei_gps, fecha_instalacion, 
        pago_inicial, valor_mensualidad, valor_total, proximo_pago, $1
       FROM activos WHERE id_servicio = $2 RETURNING *`,
      [motivo_suspension, placa]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Servicio activo no encontrado' });
    }

    await pool.query('DELETE FROM activos WHERE placa = $1', [placa]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al suspender el servicio:', error);
    res.status(500).json({ message: 'Error al suspender el servicio', error: error.message });
  }
};


exports.deleteActivo = async (req, res) => {
  const { placa } = req.params;

  try {
    const result = await pool.query('DELETE FROM activos WHERE placa = $1 RETURNING *', [placa]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Servicio activo no encontrado' });
    }

    res.json({ message: 'Servicio activo eliminado con éxito', servicio: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar el servicio activo:', error);
    res.status(500).json({ message: 'Error al eliminar el servicio activo', error: error.message });
  }
};