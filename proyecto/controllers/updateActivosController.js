
const pool = require('../config/db');
exports.updateActivo = async (req, res) => {
    const { placa } = req.params;
    const {
      nombre_cliente,
      cc_nit,
      celular,
      email,
      direccion,
      imei_gps,
      fecha_instalacion,
      pago_inicial,
      valor_mensualidad,
      valor_total,
      proximo_pago,
    } = req.body;
  
    try {
      // Construir la consulta SQL dinámica
      const fieldsToUpdate = [];
      const values = [];
      
      if (nombre_cliente) {
        fieldsToUpdate.push(`nombre_cliente = $${values.length + 1}`);
        values.push(nombre_cliente);
      }
      if (cc_nit) {
        fieldsToUpdate.push(`cc_nit = $${values.length + 1}`);
        values.push(cc_nit);
      }
      if (celular) {
        fieldsToUpdate.push(`celular = $${values.length + 1}`);
        values.push(celular);
      }
      if (email) {
        fieldsToUpdate.push(`email = $${values.length + 1}`);
        values.push(email);
      }
      if (direccion) {
        fieldsToUpdate.push(`direccion = $${values.length + 1}`);
        values.push(direccion);
      }
      
      // Solo permitir a los administradores actualizar el IMEI del GPS
      if (imei_gps) {
        if (req.user && req.user.role === 'admin') {
          fieldsToUpdate.push(`imei_gps = $${values.length + 1}`);
          values.push(imei_gps);
        } else {
          return res.status(403).json({ message: 'Solo los administradores pueden actualizar el IMEI del GPS' });
        }
      }
  
      if (fecha_instalacion) {
        fieldsToUpdate.push(`fecha_instalacion = $${values.length + 1}`);
        values.push(fecha_instalacion);
      }
      if (pago_inicial) {
        fieldsToUpdate.push(`pago_inicial = $${values.length + 1}`);
        values.push(pago_inicial);
      }
      if (valor_mensualidad) {
        fieldsToUpdate.push(`valor_mensualidad = $${values.length + 1}`);
        values.push(valor_mensualidad);
      }
      if (valor_total) {
        fieldsToUpdate.push(`valor_total = $${values.length + 1}`);
        values.push(valor_total);
      }
      if (proximo_pago) {
        fieldsToUpdate.push(`proximo_pago = $${values.length + 1}`);
        values.push(proximo_pago);
      }
  
      // Si no se proporcionaron campos para actualizar
      if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
      }
  
      // Agregar la condición WHERE y el valor de la placa
      const query = `
        UPDATE activos SET ${fieldsToUpdate.join(', ')} 
        WHERE placa = $${values.length + 1} 
        RETURNING *`;
      
      values.push(placa);
  
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Servicio activo no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el servicio activo' });
    }
  };