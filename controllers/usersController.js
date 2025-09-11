const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Users = require("../models/User");

const getAllUsers = asyncHandler(async (req, res) => {
	const users = await Users.find().select("-password").lean(); // lean() is used when you don't need to save data

	if (!users?.length) {
		return res
			.status(400)
			.json({ message: "Bad Request: No users found." });
	}

	res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body;

	if (!username) {
		return res
			.status(400)
			.json({ message: "Bad Request: Username is required." });
	} else if (!password) {
		return res
			.status(400)
			.json({ message: "Bad Request: Password is required." });
	} else if (!Array.isArray(roles) || !roles.length) {
		return res.status(400).json({
			message: "Bad Request: Role(s) is required or Role(s) is invalid.",
		});
	}

	const duplicate = await Users.findOne({ username }).lean().exec(); // exec() is used when passing arguments

	if (duplicate) {
		return res.status(409).json({
			message: `Conflict: User '${username}' has already existed.`,
		});
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const userObject = { username, password: hashedPassword, roles };

	const user = await Users.create(userObject);

	if (user) {
		res.status(201).json({
			message: `Created: New user '${username}' is successfully created.`,
		});
	} else {
		res.status(400).json({
			message: "Bad Request: User data is invalid.",
		});
	}
});

const updateUser = asyncHandler(async (req, res) => {
	const { id, username, roles, active, password } = req.body;

	if (!username) {
		return res
			.status(400)
			.json({ message: "Bad Request: Username is required." });
	} else if (!Array.isArray(roles) || !roles.length) {
		return res.status(400).json({
			message: "Bad Request: Role(s) is required or Role(s) is invalid.",
		});
	} else if (typeof active !== "boolean") {
		return res.status(400).json({
			message: "Bad Request: User status is invalid.",
		});
	}

	const user = await Users.findById(id).exec(); // exec() is used when passing arguments

	if (!user) {
		return res
			.status(400)
			.json({ message: "Bad Request: User is not found." });
	}

	const duplicate = await Users.findOne({ username }).lean().exec();

	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({
			message: "Conflict: User '${username}' has already existed.",
		});
	}

	user.username = username;
	user.roles = roles;
	user.active = active;

	if (password) {
		user.password = await bcrypt.hash(password, 10);
	}

	const updateUser = await user.save();

	res.status(200).json({
		message: `OK: User ${updateUser.username} is updated.`,
	});
});

const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res
			.status(400)
			.json({ message: "Bad Request: User ID is required." });
	}

	const user = await Users.findById(id).exec();
	if (!user) {
		return res
			.status(400)
			.json({ message: "Bad Request: User is not found." });
	}

	await user.deleteOne();
	res.status(200).json({ message: `User '${user.username} is deleted.'` });
});

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};
