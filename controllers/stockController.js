const Stock = require("../models/Stock");
const asyncHandler = require("express-async-handler");

const getAllStocks = asyncHandler(async (req, res) => {
	const stocks = await Stock.find()
		.lean()
		.populate("stockCategoryId", "stockCategoryName");

	return res.json(stocks);
});

const getStock = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ message: "Id stok diperlukan" });

	const stock = await Stock.findById(id)
		.populate("stockCategoryId", "stockCategoryName")
		.exec();
	if (!stock)
		return res.status(400).json({ message: "Stok tidak ditemukan" });

	return res.json(stock);
});

const getStockRecap = asyncHandler(async (req, res) => {
	const { date } = req.params;

	const endDate = new Date(date);
	endDate.setHours(23, 59, 59, 999);

	const stocks = await Stock.aggregate([
		// join latest snapshot
		{
			$lookup: {
				from: "stocksnapshots",
				let: { stockId: "$_id" },
				pipeline: [
					{ $match: { $expr: { $eq: ["$stockId", "$$stockId"] } } },
					{ $sort: { stockSnapshotDate: -1 } },
					{ $limit: 1 },
				],
				as: "snapshot",
			},
		},
		{
			$addFields: {
				snapshotDate: {
					$ifNull: [
						{ $arrayElemAt: ["$snapshot.stockSnapshotDate", 0] },
						new Date("2000-01-01"),
					],
				},
				snapshotQty: {
					$ifNull: [
						{ $arrayElemAt: ["$snapshot.stockQuantity", 0] },
						0,
					],
				},
			},
		},

		// join movements AFTER snapshot
		{
			$lookup: {
				from: "stockmovements",
				let: { stockId: "$_id", snapshotDate: "$snapshotDate" },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$stockId", "$$stockId"] },
									{
										$gt: [
											"$movementDate",
											"$$snapshotDate",
										],
									},
									{ $lte: ["$movementDate", endDate] },
								],
							},
						},
					},
					{
						$group: {
							_id: null,
							totalChange: { $sum: "$stockQuantityChange" },
						},
					},
				],
				as: "movement",
			},
		},

		// final quantity
		{
			$addFields: {
				quantity: {
					$add: [
						"$snapshotQty",
						{
							$ifNull: [
								{ $arrayElemAt: ["$movement.totalChange", 0] },
								0,
							],
						},
					],
				},
			},
		},

		{
			$project: {
				stockName: 1,
				stockUnit: 1,
				quantity: 1,
			},
		},
	]);

	res.json(stocks);
});

const createStock = asyncHandler(async (req, res) => {
	const { stockName, stockCategoryId, stockUnit } = req.body;

	if (!stockName) {
		return res.status(400).json({ message: "Nama stok diperlukan" });
	} else if (!stockCategoryId) {
		return res.status(400).json({ message: "Kategori stok diperlukan" });
	} else if (!stockUnit) {
		return res.status(400).json({ message: "Satuan stok diperlukan" });
	}

	const duplicate = await Stock.findOne({ stockName }).lean().exec();

	if (duplicate) {
		return res.status(409).json({
			message: `Stok "${stockName}" sudah ada`,
		});
	}

	const stockObject = {
		stockName,
		stockCategoryId,
		stockUnit,
	};
	const stock = await Stock.create(stockObject);

	if (stock) {
		res.status(201).json({
			message: `Stok "${stockName}" berhasil dibuat`,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat stok` });
	}
});

const updateStock = asyncHandler(async (req, res) => {
	const { id, stockName, stockCategoryId, stockUnit } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id stok diperlukan" });
	} else if (!stockName) {
		return res.status(400).json({ message: "Nama stok diperlukan" });
	} else if (!stockCategoryId) {
		return res.status(400).json({ message: "Kategori stok diperlukan" });
	} else if (!stockUnit) {
		return res.status(400).json({ message: "Satuan stok diperlukan" });
	}

	const stock = await Stock.findById(id).exec();

	if (!stock) {
		return res.status(400).json({ message: "Stok tidak ditemukan" });
	}

	const duplicate = await Stock.findOne({ stockName }).lean().exec();
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({
			message: `Stok "${stockName}" sudah ada`,
		});
	}

	stock.stockName = stockName;
	stock.stockCategoryId = stockCategoryId;
	stock.stockUnit = stockUnit;

	const updatedStock = await stock.save();

	return res.status(200).json({
		message: `Stok "${updatedStock.stockName}" berhasil diperbarui`,
	});
});

const deleteStock = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id Stok diperlukan" });
	}

	const stock = await Stock.findById(id).exec();

	if (!stock) {
		return res.status(400).json({ message: "Stok tidak ditemukan" });
	}

	await stock.deleteOne();
	return res.status(200).json({
		message: `Stok "${stock.stockName}" berhasil dihapus`,
	});
});

module.exports = {
	getAllStocks,
	getStock,
	getStockRecap,
	createStock,
	updateStock,
	deleteStock,
};
