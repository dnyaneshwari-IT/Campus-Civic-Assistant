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

// Authority/Admin: Get Department Issues
router.get(
    "/authority",
    authenticate,
    authorizeRoles(ROLES.AUTHORITY, ROLES.ADMIN),
    issueController.getAuthorityIssues
);

// Student: Get My Issue By ID
router.get(
    "/:id",
    authenticate,
    issueController.getIssueById
);

module.exports = router;