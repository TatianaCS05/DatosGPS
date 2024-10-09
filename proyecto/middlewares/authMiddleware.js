const jwt = require('jsonwebtoken'); // Importar jsonwebtoken

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Header de autorización:', authHeader); // Log del header de autorización

  if (!authHeader) {
      console.log('No se proporcionó un token'); // Log de token no proporcionado
      return res.status(403).json({ message: 'No se proporcionó un token' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
      req.user = decoded;
      console.log('Usuario decodificado:', req.user); // Log del usuario decodificado
      next();
  } catch (error) {
      console.error('Error al verificar el token:', error);
      return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

exports.isAdminOrEmpleado = (req, res, next) => {
  if (!req.user || !req.user.rol) {
      console.log('Usuario no autenticado o rol no encontrado'); // Log de usuario no autenticado
      return res.status(403).json({ message: 'Usuario no autenticado o rol no encontrado' });
  }

  console.log('Rol del usuario:', req.user.rol); // Log del rol del usuario

  if (req.user.rol !== 'admin' && req.user.rol !== 'empleado') {
      console.log('Acceso denegado. Rol insuficiente:', req.user.rol); // Log de rol insuficiente
      return res.status(403).json({ message: 'Requiere rol de administrador o empleado' });
  }

  next();
};
