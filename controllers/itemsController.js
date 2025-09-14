const Item = require("../models/Item");
const asyncHandler = require("express-async-handler");

const getItems = asyncHandler(async (req, res) => {
	const items = await Item.find().lean();
	res.json(items);
});

const getItem = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ message: "ID Item diperlukan" });
	}

	const item = await Item.findById(id).exec();

	if (!item) {
		return res.status(400).json({ message: "Item tidak ditemukan" });
	}

	res.json(item);
});

const createItem = asyncHandler(async (req, res) => {
	const { index, name, price, category, image } = req.body;

	if (!index) {
		return res.status(400).json({ message: "Index Item diperlukan" });
	} else if (!name) {
		return res.status(400).json({ message: "Nama Item diperlukan" });
	} else if (!price) {
		return res.status(400).json({ message: "Harga Item diperlukan" });
	} else if (!category) {
		return res.status(400).json({ message: "Category Item diperlukan" });
	}

	const duplicate = await Item.findOne({ name }).lean().exec();

	if (duplicate) {
		return res.status(409).json({ message: `Item ${name} sudah ada` });
	}

	const itemObject = { index, name, price, category, image };
	const newItem = await Item.create(itemObject);

	if (newItem) {
		res.status(201).json({
			message: `Item ${name} berhasil dibuat`,
		});
	} else {
		res.status(400).json({
			message: "Item gagal dibuat",
		});
	}
});

const updateItem = asyncHandler(async (req, res) => {
	const { id, index, name, price, category, image } = req.body;

	if (!id) {
		return res.status(400).json({ message: "ID Item diperlukan" });
	} else if (!index) {
		return res.status(400).json({ message: "Index Item diperlukan" });
	} else if (!name) {
		return res.status(400).json({ message: "Nama Item diperlukan" });
	} else if (!price) {
		return res.status(400).json({ message: "Harga Item diperlukan" });
	} else if (!category) {
		return res.status(400).json({ message: "Category Item diperlukan" });
	}

	const item = await Item.findById(id).exec();

	if (!item) {
		return res.status(400).json({ message: "Item tidak ditemukan" });
	}

	const duplicate = await Item.findOne({ name }).lean().exec();

	if (duplicate && duplicate?._id.toString() != id) {
		return res.status(409).json({ message: `Item ${name} sudah ada` });
	}

	item.index = index;
	item.name = name;
	item.price = price;
	item.category = category;
	item.image = image;

	const updatedItem = await item.save();
	res.json({ message: `Item ${updatedItem.name} berhasil diperbarui` });
});

const deleteItem = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "ID Item diperlukan" });
	}

	const item = await Item.findById(id).exec();

	if (!item) {
		return res.status(400).json({ message: "Item tidak ditemukan" });
	}

	await item.deleteOne();

	res.json({ message: `Item ${item.name} berhasil dihapus` });
});

module.exports = {
	getItems,
	getItem,
	createItem,
	updateItem,
	deleteItem,
};
