const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
	{
		stockId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Stock",
		},
		stockQuantityChange: {
			type: Number,
			required: true,
		},
		movementDate: {
			type: Date,
			required: true,
		},
		movementType: {
			type: String,
			required: true,
		},
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
		},
		employeeId: {
			type: mongoose.Schema.Types.ObjectId,
			red: "Employee",
		},
		comment: {
			type: String,
		},
		news: {
			type: String,
		},
	},
	{ timestamps: true }
);

stockMovementSchema.index({ stockId: 1, movementDate: -1 });

module.exports = mongoose.model("StockMovement", stockMovementSchema);
