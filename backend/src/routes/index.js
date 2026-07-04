const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const interactionController = require('../controllers/interactionController');

// Define API routes
router.use('/upload', require('./uploadRoutes'));
router.use('/admin', require('./adminRoutes'));

router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/me', protect, recipeController.getRecipesByUser);
router.get('/recipes/:id', recipeController.getRecipeById);
router.post('/recipes', protect, recipeController.createRecipe);

// Interactions
router.post('/favorites', protect, interactionController.addFavorite);
router.delete('/favorites/:recipeId', protect, interactionController.removeFavorite);
router.get('/favorites', protect, interactionController.getUserFavorites);

router.post('/comments', protect, interactionController.addComment);
router.get('/comments/:recipeId', interactionController.getRecipeComments);

router.post('/ratings', protect, interactionController.addRating);
router.get('/ratings/:recipeId', interactionController.getRecipeRatings);

router.post('/follows', protect, interactionController.followUser);
router.delete('/follows/:userId', protect, interactionController.unfollowUser);
router.get('/users', authController.getAllUsers);
router.get('/users/:userId/followers', interactionController.getFollowers);
router.get('/users/:userId/following', interactionController.getFollowing);

router.post('/collections', protect, interactionController.createCollection);
router.get('/collections', protect, interactionController.getUserCollections);
router.post('/collections/add', protect, interactionController.addRecipeToCollection);

// Auth routes
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/profile', protect, authController.updateProfile);

module.exports = router;
