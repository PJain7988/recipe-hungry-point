const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalRatings = await Rating.countDocuments();

    // Get recent recipes for a small chart/list
    const recentRecipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // Get recipe categories distribution
    const categoriesAggr = await Recipe.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const categoriesData = categoriesAggr.map(cat => ({
      name: cat._id || 'Uncategorized',
      value: cat.count
    }));

    res.json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          totalRecipes,
          totalComments,
          totalRatings
        },
        recentRecipes,
        categoriesData
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Admin: Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Cannot delete other admins easily for safety
    if (user.role === 'admin') {
       return res.status(400).json({ message: 'Cannot delete an admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Cleanup user's recipes and interactions could be added here
    res.json({ status: 'success', message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Admin: Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
