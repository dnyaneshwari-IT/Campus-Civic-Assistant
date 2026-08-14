const express = require("express");
const issueController = require("../controllers/issue.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    issueController.createIssue
);

router.get(
    "/",
    authenticate,
    issueController.getMyIssues
);

module.exports = router;