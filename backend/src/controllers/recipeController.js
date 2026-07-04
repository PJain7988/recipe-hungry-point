const Recipe = require('../models/Recipe');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json({
      status: 'success',
      data: recipes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get single recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({
      status: 'success',
      data: recipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const { title, image, time, difficulty, calories, instructions } = req.body;
    
    if (!title || !instructions) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const recipe = await Recipe.create({
      title,
      image: image || undefined, // Use schema default if empty
      time: time || undefined,
      difficulty: difficulty || undefined,
      calories: calories || undefined,
      instructions,
      user: req.user._id // From protect middleware
    });

    res.status(201).json({
      status: 'success',
      data: recipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
