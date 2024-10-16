
const express = require('express');
const router = express.Router(); 
const { generatePdf } = require('../controllers/pdfController'); 

router.get('/', generatePdf); // Usa POST como en tu frontend

module.exports = router;
