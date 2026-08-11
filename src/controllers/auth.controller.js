const authService = require("../services/auth.service");

async function register(req, res) {
    try {
        const user = await authService.registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    register
};