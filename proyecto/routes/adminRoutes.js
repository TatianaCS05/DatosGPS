const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); // Asegúrate de importar correctamente

// Ruta para login
router.post('/login', authController.login);

// Ruta protegida
router.get('/admin', verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Acceso autorizado para administradores' });
});

module.exports = router;