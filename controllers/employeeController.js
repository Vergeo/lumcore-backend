const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllEmployees = asyncHandler(async (req, res) => {
	const employees = await Employee.find()
		.lean()
		.populate("employeeRoles", "roleName");

	return res.json(employees);
});

const getEmployee = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ message: "Id pegawai diperlukan" });

	const employee = await Employee.findById(id)
		.populate("employeeRoles", "roleName")
		.exec();
	if (!employee)
		return res.status(400).json({ message: "Pegawai tidak ditemukan" });

	return res.json(employee);
});

const createEmployee = asyncHandler(async (req, res) => {
	const { username, password, employeeName, employeeRoles } = req.body;

	if (!username) {
		return res.status(400).json({ message: "Nama pengguna diperlukan" });
	} else if (!password) {
		return res.status(400).json({ message: "Kata sandi diperlukan" });
	} else if (!Array.isArray(employeeRoles) || !employeeRoles.length) {
		return res.status(400).json({
			message: "Peran diperlukan atau peran tidak valid",
		});
	}

	const duplicate = await Employee.findOne({ username }).lean().exec();

	if (duplicate) {
		return res.status(409).json({
			message: `Karyawan "${username}" sudah ada`,
		});
	}

	const employeeObject = {
		username,
		password,
		employeeName,
		employeeRoles,
	};
	const employee = await Employee.create(employeeObject);

	if (employee) {
		res.status(201).json({
			message: `Karyawan "${username}" berhasil dibuat`,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat karyawan` });
	}
});

const updateEmployee = asyncHandler(async (req, res) => {
	const { id, username, password, employeeName, employeeRoles, active } =
		req.body;

	if (!id) {
		return res.status(400).json({ message: "Id karyawan diperlukan" });
	} else if (!username) {
		return res.status(400).json({ message: "Nama pengguna diperlukan" });
	} else if (!Array.isArray(employeeRoles) || !employeeRoles.length) {
		return res
			.status(400)
			.json({ message: "Peran diperlukan atau peran tidak valid" });
	} else if (typeof active !== "boolean") {
		return res.status(400).json({ message: "Status karyawan tidak valid" });
	}

	const employee = await Employee.findById(id).exec();

	if (!employee) {
		return res.status(400).json({ message: "Karyawan tidak ditemukan" });
	}

	const duplicate = await Employee.findOne({ username }).lean().exec();
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({
			message: `Karyawan "${username}" sudah ada`,
		});
	}

	employee.username = username;
	employee.employeeName = employeeName;
	employee.employeeRoles = employeeRoles;
	employee.active = active;

	if (password) {
		employee.password = password;
	}

	const updatedEmployee = await employee.save();

	return res.status(200).json({
		message: `Karyawan "${updatedEmployee.employeeName}" berhasil diperbarui`,
	});
});

const deleteEmployee = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id karyawan wajib diisi" });
	}

	const employee = await Employee.findById(id).exec();

	if (!employee) {
		return res.status(400).json({ message: "Karyawan tidak ditemukan" });
	}

	const employeeName = employee.employeeName;
	await employee.deleteOne();
	return res.status(200).json({
		message: `Karyawan "${employeeName}" berhasil dihapus`,
	});
});

module.exports = {
	getAllEmployees,
	getEmployee,
	createEmployee,
	updateEmployee,
	deleteEmployee,
};
