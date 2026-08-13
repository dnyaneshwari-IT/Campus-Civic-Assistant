const departmentService = require("../services/department.service");

async function getAllDepartments(req, res) {
    try {
        const departments = await departmentService.getAllDepartments();

        return res.status(200).json({
            success: true,
            message: "Departments retrieved successfully",
            data: departments
        });
    } catch (error) {
        console.error("Get departments error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve departments"
        });
    }
}

module.exports = {
    getAllDepartments
};