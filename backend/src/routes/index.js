const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Define API routes
router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);
router.post('/recipes', protect, recipeController.createRecipe);

// Auth routes
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.get('/auth/me', protect, authController.getMe);

module.exports = router;
