const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
	{
		index: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			require: true,
		},
		image: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
