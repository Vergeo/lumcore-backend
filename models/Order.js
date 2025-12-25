const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		orderNumber: {
			// Ex: 67, 420
			type: Number,
			required: true,
		},
		orderDate: {
			type: Date,
			required: true,
		},
		employeeId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Employee",
		},
		orderType: {
			// Offline or Online
			type: String,
			required: true,
		},
		orderTable: {
			// Ex: 2, 5, Gojek, Grab
			type: String,
			required: true,
		},
		orderStatus: {
			// active or finished
			type: String,
			required: true,
		},
		orderPaymentMethod: {
			type: String,
		},
		orderDetail: [
			{
				menuId: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Menu",
				},
				menuPrice: {
					type: Number,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				notes: {
					type: String,
				},
				recipeId: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Recipe",
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
