const pool = require('../config/db');

// Obtener todos los vehiculos
exports.getAllVehiculos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vehiculos');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los vehiculos' });
    }
};
