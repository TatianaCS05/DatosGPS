const express = require('express');
const router = express.Router(); 
const { generatePdf } = require('../controllers/pdfController'); 

router.get('/', generatePdf); 

module.exports = router;