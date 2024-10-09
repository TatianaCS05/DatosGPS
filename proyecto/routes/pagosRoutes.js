
const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');


router.get('/pendientes', pagosController.recordarPagosPendientes);  


router.get('/:placa', pagosController.getPagosByPlaca); 
router.put('/:placa', pagosController.updatePagoByPlaca);  


router.get('/', pagosController.getAllPagos);  

module.exports = router;