const express = require('express');
const router = express.Router();
const { executeQuery } = require('../controllers/executeController');

router.post('/', executeQuery);

module.exports = router;
