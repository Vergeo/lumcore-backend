const mongoose = require("mongoose");

const stockCategorySchema = new mongoose.Schema(
	{
		stockCategoryName: {
			type: String,
			required: true,
		},
		stockCategoryIcon: {
			type: String,
			default: "fa-table-cells-large",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("StockCategory", stockCategorySchema);
