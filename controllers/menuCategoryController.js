const MenuCategory = require("../models/MenuCategory");
const asyncHandler = require("express-async-handler");

const getAllMenuCategories = asyncHandler(async (req, res) => {
	const menuCategories = await MenuCategory.find().lean();
	return res.json(menuCategories);
});

const getMenuCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id)
		return res.status(400).json({ message: "Id kategori menu diperlukan" });

	const menuCategory = await MenuCategory.findById(id).exec();
	if (!menuCategory)
		return res
			.status(400)
			.json({ message: "Kategori menu tidak ditemukan" });

	return res.json(menuCategory);
});

const createMenuCategory = asyncHandler(async (req, res) => {
	const { menuCategoryName, menuCategoryIcon } = req.body;

	if (!menuCategoryName) {
		return res
			.status(400)
			.json({ message: "Nama kategori menu diperlukan" });
	}

	const duplicate = await MenuCategory.findOne({ menuCategoryName })
		.lean()
		.exec();

	if (duplicate) {
		return res.status(409).json({
			message: `Kategori menu "${menuCategoryName}" sudah ada`,
		});
	}

	const menuCategoryObject = {
		menuCategoryName,
		menuCategoryIcon,
	};
	const menuCategory = await MenuCategory.create(menuCategoryObject);

	if (menuCategory) {
		res.status(201).json({
			message: `Kategori menu "${menuCategoryName}" berhasil dibuat`,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat kategori menu` });
	}
});

const updateMenuCategory = asyncHandler(async (req, res) => {
	const { id, menuCategoryName, menuCategoryIcon } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id kategori menu diperlukan" });
	} else if (!menuCategoryName) {
		return res
			.status(400)
			.json({ message: "Nama kategori menu diperlukan" });
	}

	const menuCategory = await MenuCategory.findById(id).exec();

	if (!menuCategory) {
		return res
			.status(400)
			.json({ message: "Kategori menu tidak ditemukan" });
	}

	const duplicate = await MenuCategory.findOne({ menuCategoryName })
		.lean()
		.exec();
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({
			message: `Kategori menu "${menuCategoryName}" sudah ada`,
		});
	}

	menuCategory.menuCategoryName = menuCategoryName;
	menuCategory.menuCategoryIcon = menuCategoryIcon;

	const updatedMenuCategory = await menuCategory.save();

	return res.status(200).json({
		message: `Kategori menu '${updatedMenuCategory.menuCategoryName}' berhasil diperbarui`,
	});
});

const deleteMenuCategory = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id kategori menu diperlukan" });
	}

	const menuCategory = await MenuCategory.findById(id).exec();

	if (!menuCategory) {
		return res
			.status(400)
			.json({ message: "Kategori menu tidak ditemukan" });
	}

	await menuCategory.deleteOne();
	return res.status(200).json({
		message: `Kategori menu "${menuCategory.menuCategoryName}" berhasil dihapus`,
	});
});

module.exports = {
	getAllMenuCategories,
	getMenuCategory,
	createMenuCategory,
	updateMenuCategory,
	deleteMenuCategory,
};
