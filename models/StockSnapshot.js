const mongoose = require("mongoose");

const stockSnapshotSchema = new mongoose.Schema(
	{
		stockId: {
			type: mongoose.ObjectId,
			required: true,
		},
		stockSnapshotDate: {
			type: Date,
			required: true,
		},
		stockQuantity: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

stockSnapshotSchema.index({ stockId: 1, stockSnapshotDate: -1 });

module.exports = mongoose.model("StockSnapshot", stockSnapshotSchema);
