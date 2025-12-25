const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const roleController = require("../controllers/roleController");

router.use(verifyJWT);

router.route("/getAllRoles").get(roleController.getAllRoles);
router.route("/getRole/:id").get(roleController.getRole);
router.route("/createRole").post(roleController.createRole);
router.route("/updateRole").patch(roleController.updateRole);
router.route("/deleteRole").delete(roleController.deleteRole);

module.exports = router;
