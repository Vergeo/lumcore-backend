const StockSnapshot = require("../models/StockSnapshot");
const Stock = require("../models/Stock");
const asyncHandler = require("express-async-handler");

const getAllStockSnapshots = asyncHandler(async (req, res) => {
	const stockSnapshots = await StockSnapshot.find()
		.populate("stockId")
		.lean();

	if (!stockSnapshots?.length) {
		return res.status(400).json({
			message: "Tidak ada Stock Snapshot yang ditemukan.",
		});
	}

	return res.json(stockSnapshots);
});

const getStockSnapshot = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id)
		return res
			.status(400)
			.json({ message: "Id Stock Snapshot diperlukan." });

	const stockSnapshot = await StockSnapshot.findById(id)
		.populate("stockId")
		.exec();
	if (!stockSnapshot)
		return res
			.status(400)
			.json({ message: "Stock Snapshot tidak ditemukan." });

	return res.json(stockSnapshot);
});

const getLatestStockSnapshot = asyncHandler(async (req, res) => {
	const { stockId } = req.params;

	if (!stockId)
		return res.status(400).json({ message: "Id stok diperlukan" });

	const stockSnapshot = await StockSnapshot.findOne({ stockId })
		.sort({ stockSnapshotDate: -1 })
		.populate("stockId")
		.exec();

	return res.json(stockSnapshot);
});

const createStockSnapshot = asyncHandler(async (req, res) => {
	const { stockId, stockSnapshotDate, stockQuantity } = req.body;

	if (!stockId) {
		return res.status(400).json({ message: "Stock Id wajib diisi." });
	} else if (!stockSnapshotDate) {
		return res
			.status(400)
			.json({ message: "Stock Snapshot Date wajib diisi." });
	} else if (!stockQuantity) {
		return res
			.status(400)
			.json({ message: "Stock Quantity Date wajib diisi." });
	}

	const stock = await Stock.findById(stockId).exec();
	if (!stock) {
		return res.status(400).json({ message: "Stock Id tidak valid." });
	}

	const stockSnapshotObject = {
		stockId,
		stockSnapshot,
		stockQuantity,
	};
	const stockSnapshot = await StockSnapshot.create(stockSnapshotObject);

	if (stockSnapshot) {
		res.status(201).json({
			message: `Stock Snapshot ${stock.stockName} berhasil dibuat.`,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat Stock Snapshot.` });
	}
});

const updateStockSnapshot = asyncHandler(async (req, res) => {
	const { id, stockId, stockSnapshotDate, stockQuantity } = req.body;

	if (!id) {
		return res
			.status(400)
			.json({ message: "Stock Snapshot Id wajib diisi." });
	} else if (!stockId) {
		return res.status(400).json({ message: "Stock Id wajib diisi." });
	} else if (!stockSnapshotDate) {
		return res
			.status(400)
			.json({ message: "Stock Snapshot Date wajib diisi." });
	} else if (!stockQuantity) {
		return res
			.status(400)
			.json({ message: "Stock Quantity Date wajib diisi." });
	}

	const stockSnapshot = await StockSnapshot.findById(id).exec();

	if (!stockSnapshot) {
		return res
			.status(400)
			.json({ message: "Stock Snapshot tidak ditemukan." });
	}

	const stock = await Stock.findById(stockId).exec();
	if (!stock) {
		return res.status(400).json({ message: "Stock Id tidak valid." });
	}

	stockSnapshot.stockId = stockId;
	stockSnapshot.stockSnapshotDate = stockSnapshotDate;
	stockSnapshot.stockQuantity = stockQuantity;

	const updatedStockSnapshot = await stockSnapshot.save();

	return res.status(200).json({
		message: `Stock Snapshot '${stock.stockName}' berhasil diperbarui.`,
	});
});

const deleteStockSnapshot = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res
			.status(400)
			.json({ message: "Stock Snapshot Id wajib diisi." });
	}

	const stockSnapshot = await StockSnapshot.findById(id).exec();

	if (!stockSnapshot) {
		return res
			.status(400)
			.json({ message: "Stock Snapshot tidak ditemukan." });
	}

	const stock = await Stock.findById(stockSnapshot.stockId).exec();

	await stockSnapshot.deleteOne();
	return res.status(200).json({
		message: `Stock Snapshot '${stock.stockName}' berhasil dihapus.`,
	});
});

module.exports = {
	getAllStockSnapshots,
	getStockSnapshot,
	getLatestStockSnapshot,
	createStockSnapshot,
	updateStockSnapshot,
	deleteStockSnapshot,
};
