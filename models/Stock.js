const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
	{
		stockName: {
			type: String,
			required: true,
		},
		stockCategoryId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "StockCategory",
		},
		stockUnit: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
