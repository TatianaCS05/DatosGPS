const client = require('../config/db');

// Obtener todos los vehiculos
exports.getAllRevision = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM revision');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los vehiculos' });
    }
};
