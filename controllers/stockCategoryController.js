const StockCategory = require("../models/StockCategory");
const asyncHandler = require("express-async-handler");

const getAllStockCategories = asyncHandler(async (req, res) => {
	const stockCategories = await StockCategory.find({}).lean();

	return res.json(stockCategories);
});

const getStockCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id)
		return res.status(400).json({ message: "Id kategori stok diperlukan" });

	const stockCategory = await StockCategory.findById(id).exec();
	if (!stockCategory)
		return res
			.status(400)
			.json({ message: "Kategori stok tidak ditemukan" });

	return res.json(stockCategory);
});

const createStockCategory = asyncHandler(async (req, res) => {
	const { stockCategoryName, stockCategoryIcon } = req.body;

	if (!stockCategoryName) {
		return res
			.status(400)
			.json({ message: "Nama kategori stok diperlukan" });
	}

	const duplicate = await StockCategory.findOne({ stockCategoryName })
		.lean()
		.exec();

	if (duplicate) {
		return res.status(409).json({
			message: `Kategori stok "${stockCategoryName}" sudah ada`,
		});
	}

	const stockCategoryObject = {
		stockCategoryName,
		stockCategoryIcon,
	};
	const stockCategory = await StockCategory.create(stockCategoryObject);

	if (stockCategory) {
		res.status(201).json({
			message: `Kategori stok "${stockCategoryName}" berhasil dibuat`,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat kategori stok` });
	}
});

const updateStockCategory = asyncHandler(async (req, res) => {
	const { id, stockCategoryName, stockCategoryIcon } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id kategori stok diperlukan" });
	} else if (!stockCategoryName) {
		return res
			.status(400)
			.json({ message: "Nama kategori stok diperlukan" });
	}

	const stockCategory = await StockCategory.findById(id).exec();

	if (!stockCategory) {
		return res
			.status(400)
			.json({ message: "Kategori stok tidak ditemukan" });
	}

	const duplicate = await StockCategory.findOne({ stockCategoryName })
		.lean()
		.exec();
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({
			message: `Kategori stok '${stockCategoryName}' sudah ada`,
		});
	}

	stockCategory.stockCategoryName = stockCategoryName;
	stockCategory.stockCategoryIcon = stockCategoryIcon;

	const updatedStockCategory = await stockCategory.save();

	return res.status(200).json({
		message: `Kategori stok '${updatedStockCategory.stockCategoryName}' berhasil diperbarui`,
	});
});

const deleteStockCategory = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id kategori stok diperlukan" });
	}

	const stockCategory = await StockCategory.findById(id).exec();

	if (!stockCategory) {
		return res
			.status(400)
			.json({ message: "Kategori stok tidak ditemukan" });
	}

	await stockCategory.deleteOne();
	return res.status(200).json({
		message: `Kategori stok '${stockCategory.stockCategoryName}' berhasil dihapus`,
	});
});

module.exports = {
	getAllStockCategories,
	getStockCategory,
	createStockCategory,
	updateStockCategory,
	deleteStockCategory,
};
