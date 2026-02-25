const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    schemaText: {
        type: String,
        required: true,
    },
    setupQuery: {
        type: String,
    },
    solutionQuery: {
        type: String,
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
