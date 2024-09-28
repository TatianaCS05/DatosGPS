function authenticateAdmin(req, res, next) {
    // Aquí debería haber una lógica real de autenticación (JWT, sesiones, etc.)
    // Simulamos que el usuario es admin
    req.user = { username: 'admin_user', role: 'admin' };
    next();
  }
  
  function verifyAdminRole(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo el admin puede realizar esta acción' });
    }
    next();
  }
  
  module.exports = { authenticateAdmin, verifyAdminRole };