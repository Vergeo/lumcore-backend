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
		return res.status(400).json({ message: "ID Pesanan diperlukan" });
	}

	const sale = await Sale.findById(id).exec();

	if (!sale) {
		return res.status(400).json({ message: "Pesanan tidak ditemukan" });
	}

	res.json(sale);
});

const createSale = asyncHandler(async (req, res) => {
	const { number, tableNumber, cashier, status, type, payment, items, date } =
		req.body;

	if (!number) {
		return res.status(400).json({ message: "Nomor Nota diperlukan" });
	} else if (!tableNumber) {
		return res.status(400).json({ message: "Nomor Meja diperlukan" });
	} else if (!cashier) {
		return res.status(400).json({ message: "Nama Kasih diperlukan" });
	} else if (!status) {
		return res.status(400).json({ message: "Status Pesanan diperlukan" });
	} else if (!type) {
		return res
			.status(400)
			.json({ message: "Tipe pesanan (online/offline) diperlukan" });
	} else if (status === "finished" && !payment) {
		return res
			.status(400)
			.json({ message: "Metode Pembayaran diperlukan" });
	} else if (!items || !items?.length) {
		return res.status(400).json({ message: "Pesanan tidak boleh kosong" });
	} else if (!date) {
		return res.status(400).json({ message: "Waktu Pesanan diperlukan" });
	}

	const duplicate = await Sale.findOne({ number }).lean().exec(); // exec() is used when passing arguments

	if (duplicate) {
		return res.status(409).json({
			message: `Nomor Nota ${number} sudah ada`,
		});
	}

	const saleObject = {
		number,
		tableNumber,
		cashier,
		status,
		type,
		payment,
		items,
		date,
	};
	const newSale = await Sale.create(saleObject);

	if (newSale) {
		res.status(201).json({
			message: `Pesanan nomor ${number} berhasil dibuat`,
		});
	} else {
		res.status(400).json({
			message: "Pesanan gagal dibuat",
		});
	}
});

const updateSale = asyncHandler(async (req, res) => {
	const {
		id,
		number,
		tableNumber,
		cashier,
		status,
		type,
		payment,
		items,
		date,
	} = req.body;

	if (!id) {
		return res.status(400).json({ message: "ID Nota diperlukan" });
	} else if (!number) {
		return res.status(400).json({ message: "Nomor Nota diperlukan" });
	} else if (!tableNumber) {
		return res.status(400).json({ message: "Nomor Meja diperlukan" });
	} else if (!cashier) {
		return res.status(400).json({ message: "Nama Kasih diperlukan" });
	} else if (!status) {
		return res.status(400).json({ message: "Status Pesanan diperlukan" });
	} else if (!type) {
		return res
			.status(400)
			.json({ message: "Tipe pesanan (online/offline) diperlukan" });
	} else if (status === "finished" && !payment) {
		return res
			.status(400)
			.json({ message: "Metode Pembayaran diperlukan" });
	} else if (!items) {
		return res.status(400).json({ message: "Item Pesanan diperlukan" });
	} else if (!date) {
		return res.status(400).json({ message: "Waktu Pesanan diperlukan" });
	}

	const sale = await Sale.findById(id).exec();

	if (!sale) {
		return res.status(400).json({ message: "Pesanan tidak ditemukan" });
	}

	sale.number = number;
	sale.tableNumber = tableNumber;
	sale.cashier = cashier;
	sale.status = status;
	sale.type = type;
	sale.payment = payment;
	sale.items = items;

	const updatedSale = await sale.save();

	res.json({ message: `Pesanan nomor ${number} berhasil diperbarui` });
});

const deleteSale = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "ID Pesanan diperlukan" });
	}

	const sale = await Sale.findById(id).exec();

	if (!sale) {
		return res.status(400).json({ message: "Pesanan tidak ditemukan" });
	}

	const result = await sale.deleteOne();
	res.json({ message: `Pesanan nomor ${sale.number} berhasil dihapus` });
});

module.exports = {
	getAllSales,
	getSale,
	createSale,
	updateSale,
	deleteSale,
};
