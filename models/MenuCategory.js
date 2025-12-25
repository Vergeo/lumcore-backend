const mongoose = require("mongoose");

const menuCategorySchema = new mongoose.Schema(
	{
		menuCategoryName: {
			type: String,
			required: true,
		},
		menuCategoryIcon: {
			type: String,
			default: "fa-table-cells-large",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("MenuCategory", menuCategorySchema);
