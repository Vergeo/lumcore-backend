const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const stockMovementController = require("../controllers/stockMovementController");

router.use(verifyJWT);

router
	.route("/getAllStockMovements")
	.get(stockMovementController.getAllStockMovements);
router.route("/getStockMovement").get(stockMovementController.getStockMovement);
router
	.route("/getStockMovementByStockAndTime/:stockId/:startTime/:endTime")
	.get(stockMovementController.getStockMovementByStockAndTime);
router
	.route("/createStockMovement")
	.post(stockMovementController.createStockMovement);
router
	.route("/updateStockMovement")
	.patch(stockMovementController.updateStockMovement);
router
	.route("/deleteStockMovement")
	.delete(stockMovementController.deleteStockMovement);

module.exports = router;
