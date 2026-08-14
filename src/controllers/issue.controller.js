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

async function getAuthorityIssues(req, res) {
    try {
        const departmentId = req.user.departmentId;

        if (!departmentId) {
            return res.status(403).json({
                success: false,
                message: "Authority department is not assigned"
            });
        }

        const issues = await issueService.getIssuesForAuthority(
            departmentId
        );

        return res.status(200).json({
            success: true,
            message: "Department issues retrieved successfully",
            data: issues
        });
    } catch (error) {
        console.error(
            "Get authority issues error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve department issues"
        });
    }
}

async function assignIssue(req, res) {
    try {
        const issueId = Number(req.params.id);
        const authorityId = req.user.userId;
        const departmentId = req.user.departmentId;

        if (!Number.isInteger(issueId) || issueId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue ID"
            });
        }

        if (!departmentId) {
            return res.status(403).json({
                success: false,
                message: "Authority department is not assigned"
            });
        }

        const issue = await issueService.assignIssue(
            issueId,
            authorityId,
            departmentId
        );

        return res.status(200).json({
            success: true,
            message: "Issue assigned successfully",
            data: issue
        });
    } catch (error) {
        console.error("Assign issue error:", error.message);

        if (error.message === "ISSUE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        if (error.message === "DEPARTMENT_ACCESS_DENIED") {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot assign an issue from another department"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to assign issue"
        });
    }
}

async function updateIssueStatus(req, res) {
    try {
        const issueId = Number(req.params.id);
        const { status } = req.body;
        const departmentId = req.user.departmentId;

        if (!Number.isInteger(issueId) || issueId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue ID"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        if (!departmentId) {
            return res.status(403).json({
                success: false,
                message: "Authority department is not assigned"
            });
        }

        const newStatus = status.trim().toUpperCase();

        const issue = await issueService.updateIssueStatus(
            issueId,
            newStatus,
            departmentId
        );

        return res.status(200).json({
            success: true,
            message: "Issue status updated successfully",
            data: issue
        });
    } catch (error) {
        console.error(
            "Update issue status error:",
            error.message
        );

        if (error.message === "ISSUE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        if (error.message === "DEPARTMENT_ACCESS_DENIED") {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot update an issue from another department"
            });
        }

        if (error.message === "INVALID_STATUS_TRANSITION") {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid status transition"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update issue status"
        });
    }
}

module.exports = {
    createIssue,
    getMyIssues,
    getIssueById,
    getAuthorityIssues,
    assignIssue,
    updateIssueStatus
};