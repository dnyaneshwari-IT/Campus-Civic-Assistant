const adminService = require("../services/admin.service");

async function getAllUsers(req, res) {
    try {
        const users = await adminService.getAllUsers();

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        console.error("Get all users error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve users"
        });
    }
}

module.exports = {
    getAllUsers
};