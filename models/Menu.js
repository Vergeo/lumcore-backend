const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
	{
		index: {
			type: Number,
			required: true,
		},
		menuName: {
			type: String,
			required: true,
			index: true,
		},
		menuCategoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "MenuCategory",
			required: true,
		},
		menuPrice: {
			type: Number,
			required: true,
		},
		currentRecipeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Recipe",
		},
		commonNotes: [
			{
				_id: false,
				type: String,
			},
		],
		image: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
