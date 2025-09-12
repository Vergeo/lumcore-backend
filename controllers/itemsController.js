const Item = require("../models/Item");
const asyncHandler = require("express-async-handler");

const getItems = asyncHandler(async (req, res) => {
	const items = await Item.find().lean();

	if (!items?.length) {
		return res.status(400).json({ message: "No items found." });
	}

	res.json(items);
});

const getItem = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ message: "Item ID is required." });
	}

	const item = await Item.findById(id).exec();

	if (!item) {
		return res.status(400).json({ message: "Item not found!" });
	}

	res.json(item);
});

const createItem = asyncHandler(async (req, res) => {
	const { name, price, category, image } = req.body;

	if (!name || !price || !category) {
		return res.status(400).json({ message: "All fields are required." });
	}

	const duplicate = await Item.findOne({ name }).lean().exec();

	if (duplicate) {
		return res
			.status(409)
			.json({ message: `Item ${name} has already existed.` });
	}

	const itemObject = { name, price, category, image };
	const newItem = await Item.create(itemObject);

	if (newItem) {
		res.status(201).json({
			message: `New item ${name} is successfully created.`,
		});
	} else {
		res.status(400).json({
			message: "Fail to create item.",
		});
	}
});

const updateItem = asyncHandler(async (req, res) => {
	const { id, name, price, category, image } = req.body;

	if (!id || !name || !price || !category) {
		return res.status(400).json({ message: "All fields are required." });
	}

	const item = await Item.findById(id).exec();

	if (!item) {
		return res.status(400).json({ message: "Item not found!" });
	}

	const duplicate = await Item.findOne({ name }).lean().exec();

	if (duplicate && duplicate?._id.toString() != id) {
		return res
			.status(409)
			.json({ message: `Item ${name} has already existed.` });
	}

	item.name = name;
	item.price = price;
	item.category = category;
	item.image = image;

	const updatedItem = await item.save();
	res.json({ message: `Item ${updatedItem.name} is successfully updated.` });
});

const deleteItem = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Item ID is required." });
	}

	const item = await Item.findById(id).exec();

	if (!item) {
		return res.status(400).json({ message: "Item not found!" });
	}

	await item.deleteOne();

	res.json({ message: `Item ${item.name} is successfully deleted.` });
});

module.exports = {
	getItems,
	getItem,
	createItem,
	updateItem,
	deleteItem,
};
