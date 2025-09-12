const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			default: "fa-table-cells-large",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
