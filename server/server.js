const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config();

connectDB();

const app = express();

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [
            process.env.FRONTEND_URL,
            'https://babu-tracker.onrender.com',
            'http://localhost',      // Android Capacitor
            'capacitor://localhost'  // iOS Capacitor
        ]
        : true, // Allow all in dev
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Basic Security
app.disable('x-powered-by');

// Debug logging
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`${req.method} ${req.originalUrl}`, req.body);
    }
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/tasks', require('./routes/tasks'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    // Serve static files from the compiled React app
    app.use(express.static(path.join(__dirname, '../dist')));

    // For any request that doesn't match an API route, send back the index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
