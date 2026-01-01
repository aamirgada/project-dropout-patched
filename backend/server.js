const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/* =======================
   Middleware
======================= */
app.use(cors({
  origin: '*', // you can restrict this to your Vercel domain later
  credentials: true
}));
app.use(express.json());

/* =======================
   API Routes
======================= */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

/* =======================
   Health Check Route
======================= */
app.get('/', (req, res) => {
  res.json({ message: 'API is running 🚀' });
});

/* =======================
   Global Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

/* =======================
   Start Server
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
