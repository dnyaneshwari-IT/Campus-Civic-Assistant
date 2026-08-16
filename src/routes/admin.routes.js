const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../utils/roles");

const router = express.Router();

// Admin: Get all users
router.get(
    "/users",
    authenticate,
    authorizeRoles(ROLES.ADMIN),
    adminController.getAllUsers
);

// Admin: Activate / Deactivate user
router.patch(
    "/users/:id/status",
    authenticate,
    authorizeRoles(ROLES.ADMIN),
    adminController.updateUserStatus
);

module.exports = router;