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
                message:
                    "Title, description, categoryId and departmentId are required"
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

async function getMyIssues(req, res) {
    try {
        const userId = req.user.userId;

        const issues = await issueService.getIssuesByUser(userId);

        return res.status(200).json({
            success: true,
            message: "Issues retrieved successfully",
            data: issues
        });
    } catch (error) {
        console.error("Get issues error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve issues"
        });
    }
}

async function getIssueById(req, res) {
    try {
        const issueId = Number(req.params.id);
        const userId = req.user.userId;

        if (!Number.isInteger(issueId) || issueId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue ID"
            });
        }

        const issue = await issueService.getIssueById(
            issueId,
            userId
        );

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Issue retrieved successfully",
            data: issue
        });
    } catch (error) {
        console.error("Get issue by ID error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve issue"
        });
    }
}

module.exports = {
    createIssue,
    getMyIssues,
    getIssueById
};