const Assignment = require('../models/Assignment');

// @desc    Get all assignments
// @route   GET /api/assignments
const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().select('-setupQuery -solutionQuery');
        res.json(assignments);
    } catch (error) {
        console.error('GetAll assignments error:', error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get single assignment by ID
// @route   GET /api/assignments/:id
const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).select('-setupQuery -solutionQuery');
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.json(assignment);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        console.error('GetById assignment error:', error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Seed assignments into the database
// @route   POST /api/assignments/seed
const seedAssignments = async (req, res) => {
    try {
        await Assignment.deleteMany({});

        const seedData = [
            {
                title: 'Basic SELECT Statements',
                difficulty: 'Easy',
                description: 'Learn how to retrieve data from a single table.',
                question: 'Find all users who joined after 2023-01-01.',
                schemaText: 'CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), join_date DATE);',
                setupQuery: "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100), join_date DATE); INSERT INTO users (name, join_date) VALUES ('Alice', '2022-05-10'), ('Bob', '2023-02-15'), ('Charlie', '2023-11-20');",
                solutionQuery: "SELECT * FROM users WHERE join_date > '2023-01-01';",
            },
            {
                title: 'Filtering with WHERE',
                difficulty: 'Easy',
                description: 'Filter records using conditions.',
                question: 'Find all products with a price greater than 50.',
                schemaText: 'CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2));',
                setupQuery: "CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2)); INSERT INTO products (name, price) VALUES ('Keyboard', 100.00), ('Mouse', 20.00), ('Monitor', 200.00);",
                solutionQuery: 'SELECT * FROM products WHERE price > 50;',
            },
        ];

        await Assignment.insertMany(seedData);
        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error.message);
        res.status(500).json({ error: 'Error seeding database' });
    }
};

module.exports = { getAllAssignments, getAssignmentById, seedAssignments };
