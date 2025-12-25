const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const menuController = require("../controllers/menuController");

router.use(verifyJWT);

router.route("/getAllMenus").get(menuController.getAllMenus);
router.route("/getMenu/:id").get(menuController.getMenu);
router.route("/createMenu").post(menuController.createMenu);
router.route("/updateMenu").patch(menuController.updateMenu);
router.route("/deleteMenu").delete(menuController.deleteMenu);

module.exports = router;
