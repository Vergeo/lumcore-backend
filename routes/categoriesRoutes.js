const express = require("express");
const router = express.Router();
const categoriesControllers = require("../controllers/categoriesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
	.route("/")
	.get(categoriesControllers.getCategories)
	.post(categoriesControllers.createCategory)
	.patch(categoriesControllers.updateCategory)
	.delete(categoriesControllers.deleteCategory);

module.exports = router;
