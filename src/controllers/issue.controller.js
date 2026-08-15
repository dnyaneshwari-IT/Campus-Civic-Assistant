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

async function updateIssuePriority(req, res) {
    try {
        const issueId = Number(req.params.id);
        const { priority } = req.body;
        const departmentId = req.user.departmentId;

        if (!Number.isInteger(issueId) || issueId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue ID"
            });
        }

        if (!priority) {
            return res.status(400).json({
                success: false,
                message: "Priority is required"
            });
        }

        if (!departmentId) {
            return res.status(403).json({
                success: false,
                message: "Authority department is not assigned"
            });
        }

        const newPriority = priority.trim().toUpperCase();

        const issue = await issueService.updateIssuePriority(
            issueId,
            newPriority,
            departmentId
        );

        return res.status(200).json({
            success: true,
            message: "Issue priority updated successfully",
            data: issue
        });
    } catch (error) {
        console.error(
            "Update issue priority error:",
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

        if (error.message === "INVALID_PRIORITY") {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid priority. Allowed values: LOW, MEDIUM, HIGH, URGENT"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update issue priority"
        });
    }
}

async function addIssueUpdate(req, res) {
    try {
        const issueId = Number(req.params.id);
        const { message } = req.body;

        const updatedBy = req.user.userId;
        const departmentId = req.user.departmentId;

        if (!Number.isInteger(issueId) || issueId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue ID"
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Update message is required"
            });
        }

        if (message.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message:
                    "Update message cannot exceed 500 characters"
            });
        }

        if (!departmentId) {
            return res.status(403).json({
                success: false,
                message: "Authority department is not assigned"
            });
        }

        const update = await issueService.addIssueUpdate(
            issueId,
            updatedBy,
            departmentId,
            message.trim()
        );

        return res.status(201).json({
            success: true,
            message: "Issue update added successfully",
            data: update
        });
    } catch (error) {
        console.error(
            "Add issue update error:",
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
                    "You cannot add an update to an issue from another department"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add issue update"
        });
    }
}

async function getIssueUpdates(req, res) {
    try {
        const issueId = Number(req.params.id);
        const userId = req.user.userId;
        const userRole = req.user.role;
        const departmentId = req.user.departmentId;

        if (!Number.isInteger(issueId) || issueId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue ID"
            });
        }

        const updates = await issueService.getIssueUpdates(
            issueId,
            userId,
            userRole,
            departmentId
        );

        return res.status(200).json({
            success: true,
            message: "Issue updates retrieved successfully",
            data: updates
        });
    } catch (error) {
        console.error(
            "Get issue updates error:",
            error.message
        );

        if (error.message === "ISSUE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        if (error.message === "ACCESS_DENIED") {
            return res.status(403).json({
                success: false,
                message:
                    "You can only view updates for your own issues"
            });
        }

        if (error.message === "DEPARTMENT_ACCESS_DENIED") {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot view updates for another department"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve issue updates"
        });
    }
}

module.exports = {
    createIssue,
    getMyIssues,
    getIssueById,
    getAuthorityIssues,
    assignIssue,
    updateIssueStatus,
    updateIssuePriority,
    addIssueUpdate,
    getIssueUpdates
};