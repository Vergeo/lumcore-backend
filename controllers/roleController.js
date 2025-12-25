const Role = require("../models/Role");
const asyncHandler = require("express-async-handler");
const getAllRoles = asyncHandler(async (req, res) => {
	const roles = await Role.find({}).lean();
	return res.json(roles);
});

const getRole = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ message: "Id Peran diperlukan" });

	const role = await Role.findById(id).exec();
	if (!role)
		return res.status(400).json({ message: "Peran tidak ditemukan" });

	return res.json(role);
});

const createRole = asyncHandler(async (req, res) => {
	const { roleName } = req.body;

	if (!roleName) {
		return res.status(400).json({ message: "Nama peran diperlukan" });
	}

	const duplicate = await Role.findOne({ roleName }).lean().exec();

	if (duplicate) {
		return res.status(409).json({
			message: `Peran "${roleName}" sudah ada`,
		});
	}

	const roleObject = {
		roleName,
	};
	const role = await Role.create(roleObject);

	if (role) {
		res.status(201).json({
			message: `Peran ${roleName} berhasil dibuat`,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat Peran` });
	}
});

const updateRole = asyncHandler(async (req, res) => {
	const { id, roleName } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id Peran diperlukan" });
	} else if (!roleName) {
		return res.status(400).json({ message: "Nama Peran diperlukan" });
	}

	const role = await Role.findById(id).exec();

	if (!role) {
		return res.status(400).json({ message: "Peran tidak ditemukan" });
	}

	const duplicate = await Role.findOne({ roleName }).lean().exec();
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({
			message: `Peran "${roleName}" sudah ada`,
		});
	}

	role.roleName = roleName;

	const updatedRole = await role.save();

	return res.status(200).json({
		message: `Peran '${updatedRole.roleName}' berhasil diperbarui`,
	});
});

const deleteRole = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id Peran diperlukan" });
	}

	const role = await Role.findById(id).exec();

	if (!role) {
		return res.status(400).json({ message: "Peran tidak ditemukan" });
	}

	const roleName = role.roleName;
	await role.deleteOne();
	return res.status(200).json({
		message: `Peran "${roleName}" berhasil dihapus`,
	});
});

module.exports = {
	getAllRoles,
	getRole,
	createRole,
	updateRole,
	deleteRole,
};
