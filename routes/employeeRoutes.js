const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const employeeController = require("../controllers/employeeController");

// router.use(verifyJWT);

router.route("/getAllEmployees").get(employeeController.getAllEmployees);
router.route("/getEmployee/:id").get(employeeController.getEmployee);
router.route("/createEmployee").post(employeeController.createEmployee);
router.route("/updateEmployee").patch(employeeController.updateEmployee);
router.route("/deleteEmployee").delete(employeeController.deleteEmployee);

module.exports = router;
