const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');
const { awardXP } = require('../utils/gamification');

// --- Favorites ---
exports.addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, recipe: recipeId });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.status(200).json({ status: 'success', action: 'removed' });
    }
    const favorite = await Favorite.create({ user: req.user._id, recipe: recipeId });
    res.status(201).json({ status: 'success', data: favorite, action: 'added' });
  } catch (error) {
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
    
    // Award XP for commenting
    await awardXP(req.user._id, 10);
    
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
    
    // Award XP for rating
    await awardXP(req.user._id, 5);
    
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

// --- Follows ---
const Follow = require('../models/Follow');

exports.followUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    const follow = await Follow.create({ follower: req.user._id, following: userId });
    res.status(201).json({ status: 'success', data: follow });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Already following this user' });
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    await Follow.findOneAndDelete({ follower: req.user._id, following: req.params.userId });
    res.json({ status: 'success', message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId }).populate('follower', 'name avatar');
    res.json({ status: 'success', data: followers });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId }).populate('following', 'name avatar');
    res.json({ status: 'success', data: following });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Collections ---
const Collection = require('../models/Collection');

exports.createCollection = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Collection name required' });
    const collection = await Collection.create({ user: req.user._id, name, recipes: [] });
    res.status(201).json({ status: 'success', data: collection });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getUserCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id }).populate('recipes');
    res.json({ status: 'success', data: collections });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.addRecipeToCollection = async (req, res) => {
  try {
    const { collectionId, recipeId } = req.body;
    const collection = await Collection.findOne({ _id: collectionId, user: req.user._id });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    
    if (!collection.recipes.includes(recipeId)) {
      collection.recipes.push(recipeId);
      await collection.save();
    }
    res.json({ status: 'success', data: collection });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
