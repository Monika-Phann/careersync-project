const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/database');

// ✅ Import Routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes'); // 👈 ADD THIS

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Added PATCH
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve images

// ✅ Register Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes); // 👈 ADD THIS (Fixes 404)

// Database Connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Edu DB connected');
    
    // Keep as alter: true for normal running
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database Synced');
    
  } catch (error) {
    console.error('❌ Edu DB Failed:', error);
  }
};

module.exports = app;

if (require.main === module) {
  connectDB();
  app.listen(PORT, () => console.log(`🚀 Edu Server running on port ${PORT}`));
} else {
  connectDB();
}