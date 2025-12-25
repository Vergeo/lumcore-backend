const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const stockCategoryController = require("../controllers/stockCategoryController");

router.use(verifyJWT);

router
	.route("/getAllStockCategories")
	.get(stockCategoryController.getAllStockCategories);
router
	.route("/getStockCategory/:id")
	.get(stockCategoryController.getStockCategory);
router
	.route("/createStockCategory")
	.post(stockCategoryController.createStockCategory);
router
	.route("/updateStockCategory")
	.patch(stockCategoryController.updateStockCategory);
router
	.route("/deleteStockCategory")
	.delete(stockCategoryController.deleteStockCategory);

module.exports = router;
