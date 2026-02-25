const express = require('express');
const router = express.Router();
const { getHint } = require('../controllers/hintsController');

router.post('/', getHint);

module.exports = router;
