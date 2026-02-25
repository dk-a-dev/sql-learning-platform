const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { saveAttempt, getAttemptsByAssignment, getMyAttempts } = require('../controllers/attemptsController');

router.post('/', authMiddleware, saveAttempt);
router.get('/assignment/:assignmentId', authMiddleware, getAttemptsByAssignment);
router.get('/me', authMiddleware, getMyAttempts);

module.exports = router;
