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

async function updateUserStatus(req, res) {
    try {
        const userId = Number(req.params.id);
        const { is_active } = req.body;

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (typeof is_active !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "is_active must be true or false"
            });
        }

        const user = await adminService.updateUserStatus(
            userId,
            is_active ? 1 : 0
        );

        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: user
        });
    } catch (error) {
        console.error("Update user status error:", error.message);

        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
}

module.exports = {
    getAllUsers,
    updateUserStatus
};