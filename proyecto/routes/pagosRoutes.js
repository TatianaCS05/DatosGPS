
const express = require('express');
const router = express.Router();
const pagosController= require('../controllers/pagosController');

router.get('/', pagosController.getAllPagos);

router.get('/:placa', pagosController.getPagosByPlaca);

router.put('/:placa', pagosController.updatePagoByPlaca);


module.exports = router;