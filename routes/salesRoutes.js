const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

router
	.route("/")
	.get(salesController.getAllSales)
	.post(salesController.createSale)
	.patch(salesController.updateSale)
	.delete(salesController.deleteSale);

router.route("/:id").get(salesController.getSale);

module.exports = router;
