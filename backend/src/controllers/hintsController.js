const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Get an LLM hint (not the solution) for a SQL assignment
// @route   POST /api/hints
const getHint = async (req, res) => {
    const { question, schema, attempt } = req.body;

    if (!question || !schema || !attempt) {
        return res.status(400).json({
            error: 'Question, schema, and current attempt are required for a hint.',
        });
    }

    const prompt = `
You are an AI assistant for a SQL learning platform called CipherSQLStudio.
A student is trying to solve the following SQL assignment:
"${question}"

The database schema they are working with is:
${schema}

Their current SQL query attempt is:
\`\`\`sql
${attempt}
\`\`\`

Your task is to provide a helpful hint to guide them towards the correct solution. 
CRITICAL RULES:
1. DO NOT provide the complete, correct SQL query under any circumstances.
2. Point out specific syntax errors or logical flaws in their current attempt.
3. Suggest which SQL keywords or clauses (e.g., WHERE, JOIN, GROUP BY) they might need to use, but don't write the line for them.
4. Keep the hint concise and encouraging (max 2 sentences).
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ hint: response.text });
    } catch (error) {
        console.error('LLM Hint Error:', error.message);
        res.status(500).json({ error: 'Failed to generate hint.' });
    }
};

module.exports = { getHint };
