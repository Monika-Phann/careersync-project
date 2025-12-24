require("dotenv").config();
// DB
const db = require("./models");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
// ✅ FIX: Configure CORS to allow cookies from your Frontend
app.use(cors({
  // Allow these specific origins (standard Vite/React ports)
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true // <--- CRITICAL: Allows the browser to save the cookie
}));

app.use(express.json());

// ✅ ADDED: JSON Syntax Error Handler
// This stops the server from crashing if the Frontend sends bad JSON (like double quotes)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error("❌ JSON Syntax Error:", err.message);
    return res.status(400).json({ message: "Invalid data format sent from frontend. Check your API call." });
  }
  next();
});

app.use(cookieParser());

// Routes
const mentorRoutes = require("./routes/mentor.route");
const sessionRoutes = require("./routes/mentor.session");
const bookingRoutes = require("./routes/mentor.booking");
const authRoutes = require("./routes/auth.route");
const userRoute = require("./routes/user.routes");
const userbookingRoutes = require('./routes/booking.routes');

app.use("/api/bookings", bookingRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/bookings', userbookingRoutes);
app.use("/api/user", userRoute);
app.use("/api/mentors", mentorRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Database connection logic
const { sequelize } = require('./models');

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Careersync DB connected');

    // Safe Mode: Update tables without deleting data
    console.log("🔄 Syncing Database (Safe Mode)...");
    await sequelize.sync({ alter: true }); 
    console.log("✅ Database Synced!");

  } catch (error) {
    console.error('❌ Database error:', error);
  }
};

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// === MODIFIED STARTUP LOGIC ===

// 1. Export the app (Critical for Super Server)
module.exports = app;

// 2. Only start listening if running this file directly
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  
  // Connect DB then start server
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Careersync Server running on port ${PORT}`);
    });
  });
} else {
  // If imported by Super Server, just connect to DB
  connectToDatabase();
}