const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
	{
		menuId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Menu",
		},
		stockUsed: [
			{
				stockId: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Stock",
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
