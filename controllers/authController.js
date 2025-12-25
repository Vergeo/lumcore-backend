const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

/**
 * Helper to generate access token
 */
const generateAccessToken = (employee) => {
	return jwt.sign(
		{
			userId: employee._id.toString(),
			username: employee.username,
			roles: employee.employeeRoles.map((r) => r.roleName),
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "15m" }
	);
};

/**
 * LOGIN
 */
const login = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({
			message: "Nama Pengguna dan Kata Sandi diperlukan",
		});
	}

	const foundEmployee = await Employee.findOne({ username })
		.populate("employeeRoles", "roleName")
		.exec();

	if (!foundEmployee || !foundEmployee.active) {
		return res.status(401).json({
			message: "Nama Pengguna atau Kata Sandi tidak benar",
		});
	}

	const match = password === foundEmployee.password;
	if (!match) {
		return res.status(401).json({
			message: "Nama Pengguna atau Kata Sandi tidak benar",
		});
	}

	const accessToken = generateAccessToken(foundEmployee);

	const refreshToken = jwt.sign(
		{ username: foundEmployee.username },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: "1h" }
	);

	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.json({
		userId: foundEmployee._id,
		username: foundEmployee.username,
		roles: foundEmployee.employeeRoles.map((r) => r.roleName),
		accessToken,
	});
});

/**
 * REFRESH TOKEN
 */
const refresh = asyncHandler(async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const refreshToken = cookies.jwt;

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		asyncHandler(async (err, decoded) => {
			if (err) {
				return res.status(403).json({
					message: "Forbidden: Refresh Token Expired",
				});
			}

			const foundEmployee = await Employee.findOne({
				username: decoded.username,
			})
				.populate("employeeRoles", "roleName")
				.exec();

			if (!foundEmployee || !foundEmployee.active) {
				return res.status(401).json({ message: "Unauthorized" });
			}

			const accessToken = generateAccessToken(foundEmployee);

			res.json({
				userId: foundEmployee._id,
				username: foundEmployee.username,
				roles: foundEmployee.employeeRoles.map((r) => r.roleName),
				accessToken,
			});
		})
	);
});

/**
 * LOGOUT
 */
const logout = asyncHandler(async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);

	res.clearCookie("jwt", {
		httpOnly: true,
		secure: true,
		sameSite: "None",
	});

	res.json({ message: "Cookie cleared" });
});

module.exports = { login, refresh, logout };
