const express = require('express');
const router = express.Router();
const gpsController= require('../controllers/gpsController');

router.get('/', gpsController.getAllGps);


module.exports = router;