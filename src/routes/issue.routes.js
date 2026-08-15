const express = require("express");
const issueController = require("../controllers/issue.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../utils/roles");

const router = express.Router();

// Student: Create Issue
router.post(
    "/",
    authenticate,
    issueController.createIssue
);

// Student: Get My Issues
router.get(
    "/",
    authenticate,
    issueController.getMyIssues
);

// Admin: Get All Issues
// IMPORTANT: This must come BEFORE "/:id"
router.get(
    "/admin",
    authenticate,
    authorizeRoles(ROLES.ADMIN),
    issueController.getAdminIssues
);

// Authority: Get Department Issues
router.get(
    "/authority",
    authenticate,
    authorizeRoles(ROLES.AUTHORITY),
    issueController.getAuthorityIssues
);

// Authority: Assign Issue
router.patch(
    "/:id/assign",
    authenticate,
    authorizeRoles(ROLES.AUTHORITY),
    issueController.assignIssue
);

// Authority: Update Issue Status
router.patch(
    "/:id/status",
    authenticate,
    authorizeRoles(ROLES.AUTHORITY),
    issueController.updateIssueStatus
);

// Authority: Update Issue Priority
router.patch(
    "/:id/priority",
    authenticate,
    authorizeRoles(ROLES.AUTHORITY),
    issueController.updateIssuePriority
);

// Authority: Add Issue Update
router.post(
    "/:id/updates",
    authenticate,
    authorizeRoles(ROLES.AUTHORITY),
    issueController.addIssueUpdate
);

// Student/Authority: Get Issue Updates
router.get(
    "/:id/updates",
    authenticate,
    authorizeRoles(ROLES.STUDENT, ROLES.AUTHORITY),
    issueController.getIssueUpdates
);

// Student: Get My Issue By ID
// IMPORTANT: Keep this route AFTER /admin and /authority
router.get(
    "/:id",
    authenticate,
    issueController.getIssueById
);

module.exports = router;