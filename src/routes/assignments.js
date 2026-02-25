const express = require('express');
const router = express.Router();
const { getAllAssignments, getAssignmentById, seedAssignments } = require('../controllers/assignmentsController');

router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.post('/seed', seedAssignments);

module.exports = router;
