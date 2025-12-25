const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const stockSnapshotController = require("../controllers/stockSnapshotController");

router.use(verifyJWT);

router
	.route("/getAllStockSnapshots")
	.get(stockSnapshotController.getAllStockSnapshots);
router.route("/getStockSnapshot").get(stockSnapshotController.getStockSnapshot);
router
	.route("/getLatestStockSnapshot/:stockId")
	.get(stockSnapshotController.getLatestStockSnapshot);
router
	.route("/createStockSnapshot")
	.post(stockSnapshotController.createStockSnapshot);
router
	.route("/updateStockSnapshot")
	.patch(stockSnapshotController.updateStockSnapshot);
router
	.route("/deleteStockSnapshot")
	.delete(stockSnapshotController.deleteStockSnapshot);

module.exports = router;
