require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', analyzeRoutes);

// Root
app.get('/', (req, res) => {
    res.json({ message: 'Resume Screener API v1.0.0', status: 'running' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Resume Screener API running at http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
