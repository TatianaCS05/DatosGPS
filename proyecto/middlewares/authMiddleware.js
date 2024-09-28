const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

// Verificación de que el JWT_SECRET está presente
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET no está definido. Verifica tu archivo .env');
  process.exit(1); // Detén la aplicación si el JWT_SECRET no está configurado
}

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'No se proporcionó un token' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Decodificar y verificar el token usando el JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar si el usuario es administrador
exports.isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Requiere rol de administrador' });
  }
  next();
};

// Middleware para verificar si el usuario es empleado
exports.isEmpleado = (req, res, next) => {
  if (req.user.rol !== 'empleado') {
    return res.status(403).json({ message: 'Requiere rol de empleado' });
  }
  next();
};

// Middleware para verificar si el usuario es administrador o empleado
exports.isAdminOrEmpleado = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.rol !== 'empleado') {
    return res.status(403).json({ message: 'Requiere rol de administrador o empleado' });
  }
  next();
};
