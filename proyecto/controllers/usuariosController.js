const pool = require('../config/db');

// Obtener todos los personal
exports.getAllUsuarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT nombre_personal, usuario, contraseña_hash, rol FROM personal');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los personal' });
    }
};
