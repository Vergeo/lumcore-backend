const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const recipeController = require("../controllers/recipeController");

router.use(verifyJWT);

router.route("/getAllRecipes").get(recipeController.getAllRecipes);
router.route("/getRecipe/:id").get(recipeController.getRecipe);
router.route("/createRecipe").post(recipeController.createRecipe);
router.route("/updateRecipe").patch(recipeController.updateRecipe);
router.route("/deleteRecipe").delete(recipeController.deleteRecipe);

module.exports = router;
