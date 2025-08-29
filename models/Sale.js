const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
	{
		number: {
			type: Number,
			required: true,
		},
		tableNumber: {
			type: String,
		},
		items: [
			{
				name: {
					type: String,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				note: [
					{
						type: String,
					},
				],
			},
		],
		cashierId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		status: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
