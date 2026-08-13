const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus Civic Assistant API is running"
    });
});

// Authentication routes
app.use("/api/v1/auth", authRoutes);

module.exports = app;