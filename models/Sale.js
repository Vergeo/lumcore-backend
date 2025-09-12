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
		cashier: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		payment: {
			type: String,
			require: true,
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
		date: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
