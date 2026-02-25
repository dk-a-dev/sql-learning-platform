// @desc    Execute a SQL query against the PostgreSQL sandbox
// @route   POST /api/execute
const executeQuery = async (req, res) => {
    const { query } = req.body;
    const pool = req.app.get('pgPool');

    if (!query || !query.trim()) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const trimmed = query.trim().replace(/;+$/, '').trim();
    const lowerQuery = trimmed.toLowerCase();

    const forbiddenKeywords = [
        'drop', 'truncate', 'delete', 'update', 'insert',
        'alter', 'grant', 'revoke', 'create', 'exec',
    ];

    for (const keyword of forbiddenKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowerQuery)) {
            return res.status(403).json({
                error: 'Forbidden Operation',
                details: `The keyword '${keyword.toUpperCase()}' is not allowed in this sandbox. Only SELECT queries are permitted.`,
            });
        }
    }

    if (!lowerQuery.startsWith('select')) {
        return res.status(403).json({
            error: 'Forbidden Operation',
            details: 'Only SELECT queries are allowed in this sandbox.',
        });
    }

    try {
        const client = await pool.connect();
        try {
            await client.query('SET statement_timeout = 5000');
            const result = await client.query(trimmed);

            res.json({
                success: true,
                command: result.command,
                rowCount: result.rowCount,
                fields: result.fields.map(f => f.name),
                rows: result.rows,
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Query Error:', error.message);

        let details = error.message;
        let suggestion = '';

        if (error.message.includes('does not exist')) {
            suggestion = 'Check the table or column name for typos.';
        } else if (error.message.includes('syntax error')) {
            suggestion = 'Review your SQL syntax near the indicated position.';
        } else if (error.message.includes('statement timeout')) {
            suggestion = 'Your query took too long. Try simplifying it.';
        }

        res.status(400).json({ error: 'Query Execution Error', details, suggestion });
    }
};

// @desc    Submit a query and validate against the assignment's solution
// @route   POST /api/execute/submit
const Assignment = require('../models/Assignment');

const submitQuery = async (req, res) => {
    const { query, assignmentId } = req.body;
    const pool = req.app.get('pgPool');

    if (!query || !query.trim() || !assignmentId) {
        return res.status(400).json({ error: 'Query and assignmentId are required' });
    }

    const trimmed = query.trim().replace(/;+$/, '').trim();
    const lowerQuery = trimmed.toLowerCase();

    if (!lowerQuery.startsWith('select')) {
        return res.status(403).json({
            error: 'Forbidden Operation',
            details: 'Only SELECT queries are allowed.',
        });
    }

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment || !assignment.solutionQuery) {
            return res.status(404).json({ error: 'Assignment or solution not found' });
        }

        const solutionTrimmed = assignment.solutionQuery.trim().replace(/;+$/, '').trim();

        const client = await pool.connect();
        try {
            await client.query('SET statement_timeout = 5000');

            const userResult = await client.query(trimmed);

            const solutionResult = await client.query(solutionTrimmed);

            const userRows = JSON.stringify(
                userResult.rows.map(r => JSON.stringify(r)).sort()
            );
            const solutionRows = JSON.stringify(
                solutionResult.rows.map(r => JSON.stringify(r)).sort()
            );

            const isCorrect = userRows === solutionRows;

            res.json({
                success: true,
                isCorrect,
                command: userResult.command,
                rowCount: userResult.rowCount,
                expectedRowCount: solutionResult.rowCount,
                fields: userResult.fields.map(f => f.name),
                rows: userResult.rows,
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Submit Error:', error.message);
        res.status(400).json({
            error: 'Query Execution Error',
            details: error.message,
        });
    }
};

module.exports = { executeQuery, submitQuery };
