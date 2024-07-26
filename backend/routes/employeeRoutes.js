const express = require("express");
const router = express.Router();
const employeeController = require("../controller/employeeController");

router.get("/", employeeController.getEmployees);

router.post("/post/", employeeController.postEmployee);

module.exports = router;
