const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware'); 

// Ruta para iniciar sesión y obtener el token
router.post('/login', authController.login);

// Ruta protegida para verificar autenticación y autorización
router.get('/activos', verifyToken, (req, res) => {
  res.json({ message: 'Acceso concedido', userId: req.userId, rol: req.userRole });
});

module.exports = router;