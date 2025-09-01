const express = require("express");
const router = express.Router();
const itemsControllers = require("../controllers/itemsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
	.route("/")
	.get(itemsControllers.getItems)
	.post(itemsControllers.createItem)
	.patch(itemsControllers.updateItem)
	.delete(itemsControllers.deleteItem);

router.route("/:id").get(itemsControllers.getItem);

module.exports = router;
