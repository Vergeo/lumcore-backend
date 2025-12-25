const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const stockController = require("../controllers/stockController");

router.use(verifyJWT);

router.route("/getAllStocks").get(stockController.getAllStocks);
router.route("/getStock/:id").get(stockController.getStock);
router.route("/getStockRecap/:date").get(stockController.getStockRecap);
router.route("/createStock").post(stockController.createStock);
router.route("/updateStock").patch(stockController.updateStock);
router.route("/deleteStock").delete(stockController.deleteStock);

module.exports = router;
