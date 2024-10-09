const express = require('express');
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { usuario, contraseña } = req.body;
    console.log('Intentando iniciar sesión con usuario:', usuario); // Log de entrada

    try {
        const query = 'SELECT * FROM personal WHERE usuario = $1';
        const result = await pool.query(query, [usuario]);

        if (result.rows.length === 0) {
            console.log('Usuario no encontrado:', usuario); // Log de usuario no encontrado
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        console.log('Usuario encontrado:', user); // Log del usuario encontrado

        const passwordIsValid = await bcrypt.compare(contraseña, user.contraseña_hash);
        console.log('Contraseña válida:', passwordIsValid); // Log de contraseña válida

        if (!passwordIsValid) {
            console.log('Contraseña incorrecta para usuario:', usuario); // Log de contraseña incorrecta
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id_personal: user.id_personal, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Token generado:', token); // Log del token generado

        res.status(200).json({
            message: 'Login exitoso',
            token: token,
            rol: user.rol,
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};
