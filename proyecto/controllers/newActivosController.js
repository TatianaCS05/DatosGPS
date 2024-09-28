const pool = require('../config/db');

exports.createActivo = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Inicia la transacción

    const {
      nombre_cliente, cc_nit, celular, email, direccion, placa, numero_dispositivo, fecha_instalacion,
      pago_inicial, valor_mensualidad, valor_total, proximo_pago, modelo_vehiculo, marca_vehiculo, 
      tipo_vehiculo, nombre_instalador, buzzer, microfono, apagado, boton_panico
    } = req.body;

    // Buscar el IMEI correspondiente al numero_dispositivo en la tabla gps
    const gpsResult = await client.query(
      `SELECT imei FROM gps WHERE numero_dispositivo = $1`, 
      [numero_dispositivo]
    );

    
    if (gpsResult.rows.length === 0) {
      await client.query('ROLLBACK'); // Si no se encuentra el GPS, hacemos rollback
      return res.status(404).json({ message: 'GPS no encontrado con el número de dispositivo proporcionado' });
    }

    const imei_gps = gpsResult.rows[0].imei; // Obtenemos el IMEI correspondiente

    // Insertar en la tabla de vehiculos
    await client.query(
        `INSERT INTO vehiculos (placa, modelo, marca, tipo_vehiculo) 
         VALUES ($1, $2, $3, $4)`,
        [placa, modelo_vehiculo, marca_vehiculo, tipo_vehiculo]
      );
  

    // Insertar en la tabla de activos utilizando el IMEI encontrado
    const activoResult = await client.query(
      `INSERT INTO activos (nombre_cliente, cc_nit, celular, email, direccion, placa, imei_gps, fecha_instalacion,
        pago_inicial, valor_mensualidad, valor_total, proximo_pago)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id_servicio`,
      [nombre_cliente, cc_nit, celular, email, direccion, placa, imei_gps, fecha_instalacion,
        pago_inicial, valor_mensualidad, valor_total, proximo_pago]
    );

    const id_servicio = activoResult.rows[0].id_servicio;

    
    // Insertar en la tabla de instalaciones
    await client.query(
      `INSERT INTO instalaciones (placa, nombre_instalador, buzzer, microfono, apagado, boton_panico)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [placa, nombre_instalador, buzzer, microfono, apagado, boton_panico]
    );

    // Insertar en la tabla de pagos (registro inicial)
    await client.query(
      `INSERT INTO pagos (id_servicio, nombre_cliente, placa, fecha_pago, valor_pagado, proximo_pago)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id_servicio, nombre_cliente, placa, fecha_instalacion, pago_inicial, proximo_pago]
    );

    await client.query('COMMIT'); // Finaliza la transacción exitosamente
    res.json({ message: 'Activo creado exitosamente y todos los datos relacionados fueron insertados' });

  } catch (error) {
    await client.query('ROLLBACK'); // Si hay un error, se deshacen todas las operaciones
    console.error('Error creando el activo y los datos relacionados:', error);
    res.status(500).json({ message: 'Error al crear el servicio activo y los datos relacionados' });
  } finally {
    client.release(); // Liberamos el cliente de la conexión
  }
};