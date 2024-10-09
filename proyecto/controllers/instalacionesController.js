const pool = require('../config/db');

// Obtener todos los instalaciones
exports.getAllInstalaciones = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM instalaciones');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los instalaciones' });
    }
};



