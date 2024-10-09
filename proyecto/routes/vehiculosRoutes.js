const express = require('express');
const router = express.Router();
const vehiculosController= require('../controllers/vehiculosController');

router.get('/', vehiculosController.getAllVehiculos);


module.exports = router;