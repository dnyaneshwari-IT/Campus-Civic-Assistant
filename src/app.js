const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus Civic Assistant API is running"
    });
});

app.use("/api/v1/auth", authRoutes);

module.exports = app;