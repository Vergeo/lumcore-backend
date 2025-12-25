const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		employeeName: {
			type: String,
		},
		employeeRoles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Role",
				required: true,
			},
		],
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
