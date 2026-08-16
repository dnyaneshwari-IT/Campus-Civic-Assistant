const express = require("express");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const departmentRoutes = require("./routes/department.routes");
const issueRoutes = require("./routes/issue.routes");
const adminRoutes = require("./routes/admin.routes");

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

// Category routes
app.use("/api/v1/categories", categoryRoutes);

// Department routes
app.use("/api/v1/departments", departmentRoutes);

// Issue routes
app.use("/api/v1/issues", issueRoutes);

// Admin routes
app.use("/api/v1/admin", adminRoutes);

module.exports = app;