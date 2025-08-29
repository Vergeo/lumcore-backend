const Sale = require("../models/Sale");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getAllSales = asyncHandler(async (req, res) => {
	const sales = await Sale.find().lean();

	res.json(sales);
});

const getSale = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ message: "Sale ID is required." });
	}

	const sale = await Sale.findById(id).exec();

	if (!sale) {
		return res.status(400).json({ message: "Sale not found" });
	}

	res.json(sale);
});

const createSale = asyncHandler(async (req, res) => {
	const { number, tableNumber, items, cashierId, status, date } = req.body;

	if (
		!number ||
		!tableNumber ||
		!Array.isArray(items) ||
		!items.length ||
		!cashierId ||
		!status ||
		!date
	) {
		return res.status(400).json({ message: "All fields are required." });
	}

	const saleObject = { number, tableNumber, items, cashierId, status, date };
	const newSale = await Sale.create(saleObject);

	if (newSale) {
		res.status(201).json({ message: "New sale is successfully created." });
	} else {
		res.status(400).json({
			message: "Fail to create sale.",
		});
	}
});

const updateSale = asyncHandler(async (req, res) => {
	const { id, number, tableNumber, items, cashierId, status, date } =
		req.body;

	if (
		!id ||
		!number ||
		!tableNumber ||
		!Array.isArray(items) ||
		!items.length ||
		!cashierId ||
		!status ||
		!date
	) {
		return res.status(400).json({ message: "All fields are required." });
	}

	const sale = await Sale.findById(id).exec();

	if (!sale) {
		return res.status(400).json({ message: "Sale not found" });
	}

	sale.items = items;
	sale.status = status;
	sale.tableNumber = tableNumber;

	const updatedSale = await sale.save();

	res.json({ message: `Sale number ${number} is updated!` });
});

const deleteSale = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Sale ID is required." });
	}

	const sale = await Sale.findById(id).exec();

	if (!sale) {
		return res.status(400).json({ message: "Sale not found" });
	}

	const result = await sale.deleteOne();
	res.json({ message: `Sale number ${sale.number} is deleted.` });
});

module.exports = {
	getAllSales,
	getSale,
	createSale,
	updateSale,
	deleteSale,
};
