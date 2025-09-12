const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");

const getCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find().lean();

	if (!categories?.length) {
		return res.status(400).json({ message: "No categories found." });
	}

	res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
	const { name, icon } = req.body;

	if (!name || !icon) {
		return res.status(400).json({ message: "All fields are required." });
	}

	const duplicate = await Category.findOne({ name }).lean().exec();

	if (duplicate) {
		return res
			.status(409)
			.json({ message: `Category ${name} has already existed.` });
	}

	const itemObject = { name, icon };
	const newCategory = await Category.create(itemObject);

	if (newCategory) {
		res.status(201).json({
			message: `New category ${name} is successfully created.`,
		});
	} else {
		res.status(400).json({
			message: "Fail to create category.",
		});
	}
});

const updateCategory = asyncHandler(async (req, res) => {
	const { id, name, icon } = req.body;

	if (!id || !name || !icon) {
		return res.status(400).json({ message: "All fields are required." });
	}

	const category = await Category.findById(id).exec();

	if (!category) {
		return res.status(400).json({ message: "Category not found!" });
	}

	const duplicate = await Category.findOne({ name }).lean().exec();

	if (duplicate && duplicate?._id.toString() != id) {
		return res
			.status(409)
			.json({ message: `Category ${name} has already existed.` });
	}

	category.name = name;
	category.icon = icon;

	const updatedCategory = await category.save();
	res.json({
		message: `Category ${updatedCategory.name} is successfully updated.`,
	});
});

const deleteCategory = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Category ID is required." });
	}

	const category = await Category.findById(id).exec();

	if (!category) {
		return res.status(400).json({ message: "Category not found!" });
	}

	await category.deleteOne();

	res.json({ message: `Category ${category.name} is successfully deleted.` });
});

module.exports = {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};
