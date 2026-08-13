const express = require("express");
const departmentController = require("../controllers/department.controller");

const router = express.Router();

router.get("/", departmentController.getAllDepartments);

module.exports = router;