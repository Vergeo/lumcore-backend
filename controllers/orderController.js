const Order = require("../models/Order");
const Menu = require("../models/Menu");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find()
		.populate("employeeId")
		.populate("orderDetail.menuId")
		.populate("orderDetail.recipeId")
		.lean();

	return res.json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ message: "Id pesanan diperlukan" });

	const order = await Order.findById(id)
		.populate("employeeId")
		.populate("orderDetail.menuId")
		.populate("orderDetail.recipeId")
		.exec();
	if (!order)
		return res.status(400).json({ message: "Pesanan tidak ditemukan" });

	return res.json(order);
});

const getOrderByDate = asyncHandler(async (req, res) => {
	const { date } = req.params;

	if (!date)
		return res.status(400).json({ message: "Tanggal pesanan diperlukan" });

	const [year, month, day] = date.split("-").map(Number);
	const start = new Date(year, month - 1, day, 0, 0, 0, 0);
	const end = new Date(year, month - 1, day, 23, 59, 59, 999);

	const order = await Order.find({
		orderDate: { $gte: start, $lte: end },
	})
		.populate("employeeId")
		.populate("orderDetail.menuId")
		.populate("orderDetail.recipeId")
		.exec();

	return res.json(order);
});

const createOrder = asyncHandler(async (req, res) => {
	const {
		orderNumber,
		orderDate,
		employeeId,
		orderType,
		orderTable,
		orderStatus,
		orderDetail,
		orderPaymentMethod,
	} = req.body;

	if (!orderNumber) {
		return res.status(400).json({ message: "Nomor pesanan diperlukan" });
	} else if (!orderDate) {
		return res.status(400).json({ message: "Tanggal pesanan diperlukan" });
	} else if (!employeeId) {
		return res.status(400).json({ message: "Id pegawai diperlukan" });
	} else if (!orderType) {
		return res.status(400).json({ message: "Tipe pesanan diperlukan" });
	} else if (!orderTable) {
		return res.status(400).json({ message: "Meja pesanan diperlukan" });
	} else if (!orderStatus) {
		return res.status(400).json({ message: "Status pesanan diperlukan" });
	} else if (!Array.isArray(orderDetail) || !orderDetail.length) {
		return res.status(400).json({ message: "Isi pesanan diperlukan" });
	} else if (orderStatus === "finished" && !orderPaymentMethod) {
		return res
			.status(400)
			.json({ message: "Metode pembayaran pesanan diperlukan" });
	}

	const orderObject = {
		orderNumber,
		orderDate,
		employeeId,
		orderType,
		orderTable,
		orderStatus,
		orderDetail,
		orderPaymentMethod,
	};
	const order = await Order.create(orderObject);

	if (order) {
		res.status(201).json({
			message: `Pesanan "${order.orderNumber} berhasil dibuat`,
			object: order,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat pesanan` });
	}
});

const updateOrder = asyncHandler(async (req, res) => {
	const {
		id,
		orderNumber,
		orderDate,
		employeeId,
		orderType,
		orderTable,
		orderStatus,
		orderDetail,
		orderPaymentMethod,
	} = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id pesanan diperlukan" });
	} else if (!orderNumber) {
		return res.status(400).json({ message: "Nomor pesanan diperlukan" });
	} else if (!orderDate) {
		return res.status(400).json({ message: "Tanggal pesanan diperlukan" });
	} else if (!employeeId) {
		return res.status(400).json({ message: "Id pegawai diperlukan" });
	} else if (!orderType) {
		return res.status(400).json({ message: "Tipe pesanan diperlukan" });
	} else if (!orderTable) {
		return res.status(400).json({ message: "Meja pesanan diperlukan" });
	} else if (!orderStatus) {
		return res.status(400).json({ message: "Status pesanan diperlukan" });
	} else if (!Array.isArray(orderDetail) || !orderDetail.length) {
		return res.status(400).json({ message: "Isi pesanan diperlukan" });
	} else if (orderStatus === "finished" && !orderPaymentMethod) {
		return res
			.status(400)
			.json({ message: "Metode pembayaran pesanan diperlukan" });
	}

	const order = await Order.findById(id).exec();

	if (!order) {
		return res.status(400).json({ message: "Pesanan tidak ditemukan" });
	}

	order.orderNumber = orderNumber;
	order.orderDate = orderDate;
	order.employeeId = employeeId;
	order.orderType = orderType;
	order.orderTable = orderTable;
	order.orderStatus = orderStatus;
	order.orderDetail = orderDetail;
	order.orderPaymentMethod = orderPaymentMethod;

	const updatedOrder = await order.save();

	return res.status(200).json({
		message: `Pesanan ${updatedOrder.orderNumber} berhasil diperbarui`,
	});
});

const deleteOrder = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id pesanan diperlukan" });
	}

	const order = await Order.findById(id).exec();

	if (!order) {
		return res.status(400).json({ message: "Pesanan tidak ditemukan" });
	}

	await order.deleteOne();
	return res.status(200).json({
		message: `Pesanan berhasil dihapus`,
	});
});

module.exports = {
	getAllOrders,
	getOrder,
	getOrderByDate,
	createOrder,
	updateOrder,
	deleteOrder,
};
