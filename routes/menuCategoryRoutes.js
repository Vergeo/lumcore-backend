const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const menuCategoryController = require("../controllers/menuCategoryController");

router.use(verifyJWT);

router
	.route("/getAllMenuCategories")
	.get(menuCategoryController.getAllMenuCategories);
router
	.route("/getMenuCategory/:id")
	.get(menuCategoryController.getMenuCategory);
router
	.route("/createMenuCategory")
	.post(menuCategoryController.createMenuCategory);
router
	.route("/updateMenuCategory")
	.patch(menuCategoryController.updateMenuCategory);
router
	.route("/deleteMenuCategory")
	.delete(menuCategoryController.deleteMenuCategory);

module.exports = router;
