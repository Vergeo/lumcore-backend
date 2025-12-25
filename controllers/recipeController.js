const Recipe = require("../models/Recipe");
const Stock = require("../models/Stock");
const Menu = require("../models/Menu");
const asyncHandler = require("express-async-handler");

const getAllRecipes = asyncHandler(async (req, res) => {
	const recipes = await Recipe.find()
		.populate("menuId")
		.populate("stockUsed")
		.lean();

	return res.json(recipes);
});

const getRecipe = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ message: "Id resep diperlukan" });

	const recipe = await Recipe.findById(id)
		.populate("menuId")
		.populate("stockUsed")
		.exec();
	if (!recipe)
		return res.status(400).json({ message: "Resep tidak ditemukan" });

	return res.json(recipe);
});

const createRecipe = asyncHandler(async (req, res) => {
	const { menuId, stockUsed } = req.body;

	if (!menuId) {
		return res.status(400).json({ message: "Id menu diperlukan" });
	} else if (!Array.isArray(stockUsed) || !stockUsed.length) {
		return res
			.status(400)
			.json({ message: "Stok diperlukan atau stok tidak valid" });
	}

	const menu = await Menu.findById(menuId).exec();
	if (!menu) {
		return res.status(400).json({ message: "Id menu tidak valid" });
	}

	const recipeObject = {
		menuId,
		stockUsed,
	};
	const recipe = await Recipe.create(recipeObject);

	if (recipe) {
		res.status(201).json({
			message: `Resep menu "${menu.menuName}" berhasil dibuat`,
			object: recipe,
		});
	} else {
		res.status(400).json({ message: `Gagal membuat resep.` });
	}
});

const updateRecipe = asyncHandler(async (req, res) => {
	const { id, menuId, stockUsed } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id resep diperlukan" });
	} else if (!menuId) {
		return res.status(400).json({ message: "Id menu diperlukan" });
	} else if (!Array.isArray(stockUsed) || !stockUsed.length) {
		return res
			.status(400)
			.json({ message: "Stok diperlukan atau stok tidak valid" });
	}

	const recipe = await Recipe.findById(id).exec();

	if (!recipe) {
		return res.status(400).json({ message: "Resep tidak ditemukan" });
	}

	const menu = await Menu.findById(menuId).exec();
	if (!menu) {
		return res.status(400).json({ message: "Id menu tidak valid" });
	}

	recipe.stockId = stockId;
	recipe.stockUsed = stockUsed;

	const updatedRecipe = await recipe.save();

	return res.status(200).json({
		message: `Resep menu "${menu.menuName}" berhasil diperbarui`,
	});
});

const deleteRecipe = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Id resep diperlukan" });
	}

	const recipe = await Recipe.findById(id).exec();

	if (!recipe) {
		return res.status(400).json({ message: "Resep tidak ditemukan" });
	}

	const menu = await Stock.findById(recipe.menuId).exec();

	await recipe.deleteOne();
	return res.status(200).json({
		message: `Resep menu "${menu.menuName}" berhasil dihapus`,
	});
});

module.exports = {
	getAllRecipes,
	getRecipe,
	createRecipe,
	updateRecipe,
	deleteRecipe,
};
