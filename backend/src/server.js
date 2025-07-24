const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/sessions', sessionRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Whiteboard backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
