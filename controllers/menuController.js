const Menu = require("../models/Menu");
const asyncHandler = require("express-async-handler");

const getAllMenus = asyncHandler(async (req, res) => {
	const menus = await Menu.find()
		.lean()
		.populate("menuCategoryId")
		.populate({
			path: "currentRecipeId",
			populate: {
				path: "stockUsed.stockId",
			},
		});

	return res.json(menus);
});

const getMenu = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ message: "Id menu diperlukan" });

	const menu = await Menu.findById(id)
		.populate("menuCategoryId", "menuCategoryName")
		.populate({
			path: "currentRecipeId",
			populate: {
				path: "stockUsed.stockId",
			},
		})
		.exec();
	if (!menu) return res.status(400).json({ message: "Menu tidak ditemukan" });

	return res.json(menu);
});

const createMenu = asyncHandler(async (req, res) => {
	const {
		index,
		menuName,
		menuCategoryId,
		menuPrice,
		currentRecipeId,
		commonNotes,
		image,
	} = req.body;

	if (!index) {
		return res.status(400).json({ message: "Index menu diperlukan" });
	} else if (!menuName) {
		return res.status(400).json({ message: "Nama menu diperlukan" });
	} else if (!menuCategoryId) {
		return res.status(400).json({ message: "Kategori menu diperlukan" });
	} else if (!menuPrice) {
		return res.status(400).json({ message: "Harga menu diperlukan" });
	}

	const duplicate = await Menu.findOne({ menuName }).lean().exec();

	if (duplicate) {
		return res.status(409).json({
			message: `Menu "${menuName}" sudah ada`,
		});
	}

	const menuObject = {
		index,
		menuName,
		menuCategoryId,
		menuPrice,
		currentRecipeId,
		commonNotes,
		image,
	};
	const menu = await Menu.create(menuObject);

	if (menu) {
		res.status(201).json({
			message: `Menu "${menuName}" berhasil dibuat`,
			object: menu,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat menu` });
	}
});

const updateMenu = asyncHandler(async (req, res) => {
	const {
		id,
		index,
		menuName,
		menuCategoryId,
		menuPrice,
		currentRecipeId,
		commonNotes,
		image,
	} = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id menu diperlukan" });
	} else if (!index) {
		return res.status(400).json({ message: "Index menu diperlukan" });
	} else if (!menuName) {
		return res.status(400).json({ message: "Nama menu diperlukan" });
	} else if (!menuCategoryId) {
		return res.status(400).json({ message: "Kategori menu diperlukan" });
	} else if (!menuPrice) {
		return res.status(400).json({ message: "Harga menu diperlukan" });
	}

	const menu = await Menu.findById(id).exec();

	if (!menu) {
		return res.status(400).json({ message: "Menu tidak ditemukan" });
	}

	const duplicate = await Menu.findOne({ menuName }).lean().exec();
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({
			message: `Menu "${menuName}" sudah ada`,
		});
	}

	menu.index = index;
	menu.menuName = menuName;
	menu.menuCategoryId = menuCategoryId;
	menu.menuPrice = menuPrice;
	menu.currentRecipeId = currentRecipeId;
	menu.commonNotes = commonNotes;
	menu.image = image;

	const updatedMenu = await menu.save();

	return res.status(200).json({
		message: `Menua "${updatedMenu.menuName}" berhasil diperbarui`,
		message2: updatedMenu,
	});
});

const deleteMenu = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id Menu diperlukan" });
	}

	const menu = await Menu.findById(id).exec();

	if (!menu) {
		return res.status(400).json({ message: "Menu tidak ditemukan" });
	}

	await menu.deleteOne();
	return res.status(200).json({
		message: `Menu "${menu.menuName}" berhasil dihapus`,
	});
});

module.exports = {
	getAllMenus,
	getMenu,
	createMenu,
	updateMenu,
	deleteMenu,
};
