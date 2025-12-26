const StockMovement = require("../models/StockMovement");
const Stock = require("../models/Stock");
const Order = require("../models/Order");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

const getAllStockMovements = asyncHandler(async (req, res) => {
	const stockMovements = await StockMovement.find()
		.populate("stockId")
		.populate("orderId")
		.populate("employeeId")
		.lean();

	return res.json(stockMovements);
});

const getStockMovement = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id)
		return res
			.status(400)
			.json({ message: "Id perubahan stok diperlukan" });

	const stockMovement = await StockMovement.findById(id)
		.populate("stockId")
		.populate("orderId")
		.populate("employeeId")
		.exec();

	return res.json(stockMovement);
});

const getStockMovementByStockAndTime = asyncHandler(async (req, res) => {
	const { stockId, startTime, endTime } = req.params;

	if (!startTime || !endTime)
		return res
			.status(400)
			.json({ message: "Waktu perubahan stok diperlukan" });
	else if (!stockId)
		return res.status(400).json({ message: "Id stok diperlukan" });

	const start = new Date(startTime);
	const end = new Date(endTime);

	if (isNaN(start) || isNaN(end)) {
		return res.status(400).json({ message: "Format waktu tidak valid" });
	}

	end.setHours(23, 59, 59, 999);

	const stockMovement = await StockMovement.find({
		stockId,
		movementDate: { $gte: start, $lte: end },
	})
		.sort({ orderDate: 1 })
		.populate("stockId")
		.populate("orderId")
		.populate("employeeId")
		.exec();

	return res.json(stockMovement);
});

const createStockMovement = asyncHandler(async (req, res) => {
	const {
		stockId,
		stockQuantityChange,
		movementDate,
		movementType,
		orderId,
		employeeId,
		comment,
	} = req.body;

	if (!stockId) {
		return res.status(400).json({ message: "Id stok diperlukan" });
	} else if (!stockQuantityChange) {
		return res
			.status(400)
			.json({ message: "Perubahan jumlah stok diperlukan" });
	} else if (!movementDate) {
		return res
			.status(400)
			.json({ message: "Tanggal perubahan stok diperlukan" });
	} else if (
		movementType !== "Order" &&
		movementType !== "Adjustment" &&
		movementType !== "Stock Entry" &&
		movementType !== "Cancel Order"
	) {
		return res
			.status(400)
			.json({ message: "Tipe perubahan stok tidak valid" });
	} else if (
		(movementType === "Order" || movementType === "Cancel Order") &&
		!orderId
	) {
		return res.status(400).json({
			message:
				"Id pesanan diperlukan jika tipe perubahan stok berupa pesanan",
		});
	} else if (
		(movementType === "Adjustment" || movementType === "Stock Entry") &&
		!employeeId
	) {
		return res.status(400).json({
			message:
				"Id pegawai diperlukan jika tipe perubahan stok berupa penyesuaian atau pemasukan stok.",
		});
	}
	// else if (movementType === "Adjustment" && !comment) {
	// 	return res.status(400).json({
	// 		message:
	// 			"Komen diperlukan jika tipe perubahan stok berupa penyesuaian",
	// 	});
	// }

	const stock = await Stock.findById(stockId).exec();
	if (!stock) {
		return res.status(400).json({ message: "Id stok tidak valid" });
	}

	var order, employee;
	if (movementType === "Order" || movementType === "Cancel Order") {
		order = Order.findById(orderId).exec();
		if (!order) {
			return res.status(400).json({ message: "Id pesanan tidak valid" });
		}
	} else if (
		movementType === "Adjustment" ||
		movementType === "Stock Entry"
	) {
		employee = Employee.findById(employee).exec();
		if (!employee) {
			return res.status(400).json({ message: "Id pegawai tidak valid" });
		}
	}

	var newComment = `Stok "${stock.stockName}"`;
	// return res.status(400).json(order);
	if (stockQuantityChange > 0)
		newComment += `bertambah ${-stockQuantityChange}${
			stock.stockUnit
		} karena `;
	else if (stockQuantityChange < 0)
		newComment += `berkurang ${stockQuantityChange}${stock.stockUnit} karena `;
	if (movementType === "Order") {
		newComment += `pesanan nomor "${order.orderNumber}"`;
	} else if (movementType === "Cancel Order") {
		newComment += `pembatalan pesanan nomor "${order.orderNumber}"`;
	} else if (movementType === "Stock Entry") {
		newComment += `pemasukan stok oleh "${employee.employeeName}"`;
	} else if (movementType === "Adjustment") {
		newComment += `penyesuaian stok oleh "${employee.employeeName}" dengan komen "${comment}"`;
	}

	const stockMovementObject = {
		stockId,
		stockQuantityChange,
		movementDate,
		movementType,
		orderId,
		employeeId,
		comment,
		news: newComment,
	};
	const stockMovement = await StockMovement.create(stockMovementObject);

	if (stockMovement) {
		res.status(201).json({
			message: `Perubahan stok "${stock.stockName}" berhasil dibuat`,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat perubahan stok` });
	}
});

const updateStockMovement = asyncHandler(async (req, res) => {
	const {
		id,
		stockId,
		stockQuantityChange,
		movementDate,
		movementType,
		orderId,
		employeeId,
		comment,
	} = req.body;

	if (!id) {
		return res
			.status(400)
			.json({ message: "Stock Movement Id diperlukan" });
	} else if (!stockId) {
		return res.status(400).json({ message: "Id stok diperlukan" });
	} else if (!stockQuantityChange) {
		return res
			.status(400)
			.json({ message: "Perubahan jumlah stok diperlukan" });
	} else if (!movementDate) {
		return res
			.status(400)
			.json({ message: "Tanggal perubahan stok diperlukan" });
	} else if (
		movementType !== "Order" &&
		movementType !== "Adjustment" &&
		movementType !== "Stock Entry"
	) {
		return res
			.status(400)
			.json({ message: "Tipe perubahan stok tidak valid" });
	} else if (movementType === "Order" && !orderId) {
		return res.status(400).json({
			message: "Id pesanan diperlukan jika perubahan stok berupa pesanan",
		});
	} else if (
		(movementType === "Adjustment" || movementType === "Stock Entry") &&
		!employeeId
	) {
		return res.status(400).json({
			message:
				"Id pegawai diperlukan jika tipe perubahan stok berupa penyesuaian atau pemasukan stok",
		});
	}
	// else if (movementType === "Adjustment" || !comment) {
	// 	return res.status(400).json({
	// 		message:
	// 			"Komen diperlukan jika tipe perubahan stok berupa penyesuaian",
	// 	});
	// }

	const stockMovement = await StockMovement.findById(id).exec();

	if (!stockMovement) {
		return res
			.status(400)
			.json({ message: "Perubahan stok tidak ditemukan" });
	}

	const stock = await Stock.findById(stockId).exec();
	var order, employee;
	if (!stock) {
		return res.status(400).json({ message: "Id stok tidak valid" });
	}

	if (movementType === "Order" || movementType === "Cancel Order") {
		order = Order.findById(orderId).exec();
		if (!order) {
			return res.status(400).json({ message: "Id pesanan tidak valid" });
		}
	} else if (
		movementType === "Adjustment" ||
		movementType === "Stock Entry"
	) {
		employee = Employee.findById(employee).exec();
		if (!employee) {
			return res.status(400).json({ message: "Id pegawai tidak valid" });
		}
	}

	var newComment = `Stok "${stock.stockName}"`;
	if (stockQuantityChange > 0)
		newComment += `bertambah ${-stockQuantityChange}${
			stock.stockUnit
		} karena `;
	else if (stockQuantityChange < 0)
		newComment += `berkurang ${stockQuantityChange}${stock.stockUnit} karena `;
	if (movementType === "Order") {
		newComment += `pesanan nomor "${order.orderNumber}"`;
	} else if (movementType === "Cancel Order") {
		newComment += `pembatalan pesanan nomor "${order.orderNumber}"`;
	} else if (movementType === "Stock Entry") {
		newComment += `pemasukan stok oleh "${employee.employeeName}"`;
	} else if (movementType === "Adjustment") {
		newComment += `penyesuaian stok oleh "${employee.employeeName}" dengan komen "${comment}"`;
	}

	stockMovement.stockId = stockId;
	stockMovement.stockQuantityChange = stockQuantityChange;
	stockMovement.movementDate = movementDate;
	stockMovement.movementType = movementType;
	stockMovement.orderId = orderId;
	stockMovement.employeeId = employeeId;
	stockMovement.comment = comment;
	stockMovement.news = newComment;

	const updatedStockMovement = await stockMovement.save();

	return res.status(200).json({
		message: `Perubahan stok "${stock.stockName}" berhasil diperbarui`,
	});
});

const deleteStockMovement = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res
			.status(400)
			.json({ message: "Id perubahan stok diperlukan" });
	}

	const stockMovement = await StockMovement.findById(id).exec();

	if (!stockMovement) {
		return res
			.status(400)
			.json({ message: "Perubahan stok tidak ditemukan" });
	}

	const stock = await Stock.findById(stockMovement.stockId).exec();

	await stockMovement.deleteOne();
	return res.status(200).json({
		message: `Perubahan stok "${stock.stockName}" berhasil dihapus`,
	});
});

module.exports = {
	getAllStockMovements,
	getStockMovement,
	getStockMovementByStockAndTime,
	createStockMovement,
	updateStockMovement,
	deleteStockMovement,
};
