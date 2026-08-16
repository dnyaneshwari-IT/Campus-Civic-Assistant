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

async function updateAuthorityDepartment(req, res) {
    try {
        const userId = Number(req.params.id);
        const { department_id } = req.body;

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (
            !Number.isInteger(department_id) ||
            department_id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "department_id must be a valid positive integer"
            });
        }

        const user = await adminService.updateAuthorityDepartment(
            userId,
            department_id
        );

        return res.status(200).json({
            success: true,
            message: "Authority department updated successfully",
            data: user
        });
    } catch (error) {
        console.error(
            "Update authority department error:",
            error.message
        );

        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (error.message === "USER_NOT_AUTHORITY") {
            return res.status(400).json({
                success: false,
                message: "User is not an authority"
            });
        }

        if (error.message === "DEPARTMENT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update authority department"
        });
    }
}

async function updateUserRole(req, res) {
    try {
        const userId = Number(req.params.id);
        const { role } = req.body;

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (!role || typeof role !== "string") {
            return res.status(400).json({
                success: false,
                message: "Role is required"
            });
        }

        const newRole = role.trim().toUpperCase();

        const user = await adminService.updateUserRole(
            userId,
            newRole
        );

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user
        });
    } catch (error) {
        console.error(
            "Update user role error:",
            error.message
        );

        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (error.message === "INVALID_ROLE") {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid role. Allowed values: STUDENT, AUTHORITY, ADMIN"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update user role"
        });
    }
}

module.exports = {
    getAllUsers,
    updateUserStatus,
    updateAuthorityDepartment,
    updateUserRole
};