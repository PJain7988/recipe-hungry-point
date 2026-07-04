const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');

// --- Favorites ---
exports.addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const favorite = await Favorite.create({ user: req.user._id, recipe: recipeId });
    res.status(201).json({ status: 'success', data: favorite });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Recipe already favorited' });
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user._id, recipe: req.params.recipeId });
    res.json({ status: 'success', message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('recipe');
    res.json({ status: 'success', data: favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Comments ---
exports.addComment = async (req, res) => {
  try {
    const { recipeId, text } = req.body;
    const comment = await Comment.create({ user: req.user._id, recipe: recipeId, text });
    await comment.populate('user', 'name avatar');
    res.status(201).json({ status: 'success', data: comment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getRecipeComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ status: 'success', data: comments });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Ratings ---
exports.addRating = async (req, res) => {
  try {
    const { recipeId, stars } = req.body;
    const existingRating = await Rating.findOne({ user: req.user._id, recipe: recipeId });
    if (existingRating) {
      existingRating.stars = stars;
      await existingRating.save();
      return res.json({ status: 'success', data: existingRating });
    }
    const rating = await Rating.create({ user: req.user._id, recipe: recipeId, stars });
    res.status(201).json({ status: 'success', data: rating });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getRecipeRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ recipe: req.params.recipeId });
    const average = ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.stars, 0) / ratings.length : 0;
    res.json({ status: 'success', data: { average, count: ratings.length, ratings } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
