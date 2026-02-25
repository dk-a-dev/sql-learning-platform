const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err.message));

const DATABASE_URL = process.env.DATABASE_URL;

const pgPool = new Pool({ connectionString: DATABASE_URL });

pgPool.on('connect', () => console.log('PostgreSQL pool connected'));
pgPool.on('error', (err) => console.error('PostgreSQL pool error:', err.message));
app.set('pgPool', pgPool);

const authRoute = require('./src/routes/auth');
const assignmentsRoute = require('./src/routes/assignments');
const executeRoute = require('./src/routes/execute');
const hintRoute = require('./src/routes/hints');
const attemptsRoute = require('./src/routes/attempts');

app.use('/api/auth', authRoute);
app.use('/api/assignments', assignmentsRoute);
app.use('/api/execute', executeRoute);
app.use('/api/hints', hintRoute);
app.use('/api/attempts', attemptsRoute);

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'CipherSQLStudio API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
