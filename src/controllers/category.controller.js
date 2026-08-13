const categoryService = require("../services/category.service");

async function getAllCategories(req, res) {
    try {
        const categories = await categoryService.getAllCategories();

        return res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories
        });
    } catch (error) {
        console.error("Get categories error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve categories"
        });
    }
}

module.exports = {
    getAllCategories
};