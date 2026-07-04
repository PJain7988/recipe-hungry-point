const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const interactionController = require('../controllers/interactionController');

// Define API routes
router.use('/upload', require('./uploadRoutes'));
router.use('/admin', require('./adminRoutes'));

router.get('/recipes/seed', async (req, res) => {
  try {
    const Recipe = require('../models/Recipe');
    const User = require('../models/User');
    const recipes = [
      {
        title: 'Avocado Toast with Poached Egg',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3',
        time: '15 min',
        difficulty: 'Easy',
        calories: '350',
        category: 'Breakfast',
        tags: ['healthy', 'quick', 'vegetarian'],
        ingredients: ['2 slices sourdough bread', '1 avocado', '2 eggs', 'Salt and pepper'],
        instructions: '1. Toast the bread.\n2. Mash avocado and spread on toast.\n3. Poach eggs and place on top.\n4. Season with salt and pepper.',
      },
      {
        title: 'Classic Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3',
        time: '45 min',
        difficulty: 'Medium',
        calories: '800',
        category: 'Italian',
        tags: ['pizza', 'vegetarian', 'dinner'],
        ingredients: ['1 pizza dough', '1/2 cup tomato sauce', '8 oz mozzarella cheese', 'Fresh basil leaves'],
        instructions: '1. Preheat oven to 475°F (245°C).\n2. Roll out dough.\n3. Spread sauce and add cheese.\n4. Bake for 10-12 minutes.\n5. Top with fresh basil.',
      },
      {
        title: 'Grilled Salmon with Asparagus',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3',
        time: '25 min',
        difficulty: 'Easy',
        calories: '450',
        category: 'Dinner',
        tags: ['healthy', 'seafood', 'keto'],
        ingredients: ['2 salmon fillets', '1 bunch asparagus', '2 tbsp olive oil', '1 lemon'],
        instructions: '1. Preheat grill.\n2. Toss asparagus in olive oil.\n3. Season salmon and grill for 4-5 mins per side.\n4. Grill asparagus until tender.\n5. Serve with lemon wedges.',
      },
      {
        title: "Spicy Garlic Butter Shrimp",
        image: "https://images.unsplash.com/photo-1625943555419-56a2cb596640?ixlib=rb-4.0.3",
        time: "20 min",
        difficulty: "Easy",
        calories: "450",
        category: "Dinner",
        tags: ['seafood', 'spicy'],
        ingredients: ['1 lb shrimp', '4 cloves garlic', '3 tbsp butter', 'chili flakes'],
        instructions: "1. Melt butter in pan.\n2. Add garlic and chili.\n3. Cook shrimp for 2-3 mins per side."
      },
      {
        title: "Creamy Tomato Basil Pasta",
        image: "https://images.unsplash.com/photo-1621996316524-70659610f7a0?ixlib=rb-4.0.3",
        time: "35 min",
        difficulty: "Medium",
        calories: "620",
        category: "Italian",
        tags: ['pasta', 'vegetarian'],
        ingredients: ['8 oz pasta', '1 cup tomato sauce', '1/2 cup heavy cream', 'fresh basil'],
        instructions: "1. Boil pasta.\n2. Heat sauce and cream.\n3. Toss pasta in sauce.\n4. Garnish with basil."
      },
      {
        title: "Vegan Buddha Bowl",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3",
        time: "15 min",
        difficulty: "Easy",
        calories: "320",
        category: "Vegan",
        tags: ['vegan', 'healthy'],
        ingredients: ['1 cup quinoa', '1/2 cup chickpeas', 'spinach', 'tahini dressing'],
        instructions: "1. Cook quinoa.\n2. Arrange spinach, chickpeas, and quinoa in a bowl.\n3. Drizzle with dressing."
      }
    ];

    const admin = await User.findOne({}); // Just grab any user to attribute it
    if (admin) {
      for (let recipe of recipes) {
        recipe.user = admin._id;
        await Recipe.create(recipe);
      }
      res.json({ message: '6 Recipes seeded successfully!' });
    } else {
      res.json({ message: 'No users found to attribute recipes to.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
