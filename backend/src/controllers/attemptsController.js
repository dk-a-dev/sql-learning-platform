const Attempt = require('../models/Attempt');

// @desc    Save an attempt
// @route   POST /api/attempts
const saveAttempt = async (req, res) => {
    try {
        const { assignmentId, querySubmitted, status } = req.body;

        if (!assignmentId || !querySubmitted || !status) {
            return res.status(400).json({
                error: 'assignmentId, querySubmitted, and status are required.',
            });
        }

        const attempt = new Attempt({
            user: req.user.id,
            assignment: assignmentId,
            querySubmitted,
            status,
        });

        await attempt.save();
        res.status(201).json(attempt);
    } catch (error) {
        console.error('Save attempt error:', error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get attempts for a specific assignment
// @route   GET /api/attempts/assignment/:assignmentId
const getAttemptsByAssignment = async (req, res) => {
    try {
        const attempts = await Attempt.find({
            user: req.user.id,
            assignment: req.params.assignmentId,
        }).sort({ createdAt: -1 });

        res.json(attempts);
    } catch (error) {
        console.error('Get attempts error:', error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get all attempts for the logged-in user
// @route   GET /api/attempts/me
const getMyAttempts = async (req, res) => {
    try {
        const attempts = await Attempt.find({ user: req.user.id })
            .populate('assignment', 'title difficulty')
            .sort({ createdAt: -1 });

        res.json(attempts);
    } catch (error) {
        console.error('Get user attempts error:', error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { saveAttempt, getAttemptsByAssignment, getMyAttempts };
