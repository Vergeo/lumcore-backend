const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const orderController = require("../controllers/orderController");

// router.use(verifyJWT);

router.route("/getAllOrders").get(orderController.getAllOrders);
router.route("/getOrder/:id").get(orderController.getOrder);
router.route("/getOrderByDate/:date").get(orderController.getOrderByDate);
router.route("/createOrder").post(orderController.createOrder);
router.route("/updateOrder").patch(orderController.updateOrder);
router.route("/deleteOrder").delete(orderController.deleteOrder);

module.exports = router;
