const express = require('express');
const router = express.Router();
const activosController = require('../controllers/activosController');
const newActivosController = require ('../controllers/newActivosController');
const updateActivosController = require ('../controllers/updateActivosController');
const { verifyToken, isAdmin, isEmpleado, isAdminOrEmpleado } = require('../middlewares/authMiddleware'); // Importar isAdminOrEmpleado aquí




// /activos...

router.post('/', newActivosController.createActivo); // crear un activo
router.get('/', verifyToken, isAdminOrEmpleado, activosController.getAllActivos); // ver todos 
router.get('/:placa',activosController.getActivoByPlaca); //ver un activo por el id http://localhost:3000/auth/activos/74
router.put('/:placa',  updateActivosController.updateActivo); // hacer un update
router.put('/:id/suspender',  activosController.suspendActivo); // pasar un servicio a supendidos
router.delete('/:placa', activosController.deleteActivo); // Solo admin puede eliminar

module.exports = router;