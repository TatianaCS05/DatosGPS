const express = require('express');
const suspendidosControlles = require('../controllers/suspendidosController');

const router = express.Router();


router.get('/', suspendidosControlles.getAllSuspendidos);

router.put('/:placa/reactivar', suspendidosControlles.reactivarServicio);

module.exports = router;
