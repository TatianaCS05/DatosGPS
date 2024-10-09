const express = require('express');
const router = express.Router();
const revisionController= require('../controllers/revisionController');

router.get('/', revisionController.getAllRevision);


module.exports = router;