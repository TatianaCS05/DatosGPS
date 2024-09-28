const bcrypt = require('bcrypt');
const pool = require('./config/db');  // Asegúrate de que la conexión a la base de datos está bien

async function updatePasswords() {
    const users = [
        { id: 1, password: 'admin123456' },
        { id: 2, password: 'empleado1' },
        { id: 3, password: 'empleado2' },
        { id: 4, password: 'empleado3' },
        { id: 5, password: 'empleado4' },
        { id: 6, password: 'empleado5' }
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const query = 'UPDATE personal SET contraseña_hash = $1 WHERE id_personal = $2';
        await pool.query(query, [hashedPassword, user.id]);
        console.log(`Contraseña actualizada para el usuario con ID: ${user.id}`);
    }
}

updatePasswords().catch(console.error);