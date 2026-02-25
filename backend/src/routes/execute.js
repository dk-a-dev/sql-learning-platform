const express = require('express');
const router = express.Router();
const { executeQuery, submitQuery } = require('../controllers/executeController');

router.post('/', executeQuery);
router.post('/submit', submitQuery);

module.exports = router;
