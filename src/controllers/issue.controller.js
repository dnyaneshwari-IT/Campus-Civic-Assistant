const issueService = require("../services/issue.service");

async function createIssue(req, res) {
    try {
        const {
            title,
            description,
            categoryId,
            departmentId,
            locationText,
            latitude,
            longitude
        } = req.body;

        if (!title || !description || !categoryId || !departmentId) {
            return res.status(400).json({
                success: false,
                message: "Title, description, categoryId and departmentId are required"
            });
        }

        const issue = await issueService.createIssue({
            title: title.trim(),
            description: description.trim(),
            categoryId,
            departmentId,
            locationText: locationText?.trim(),
            latitude,
            longitude,
            reportedBy: req.user.userId
        });

        return res.status(201).json({
            success: true,
            message: "Issue reported successfully",
            data: issue
        });
    } catch (error) {
        console.error("Create issue error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to report issue"
        });
    }
}

module.exports = {
    createIssue
};