const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favorites (a user can only favorite a recipe once)
favoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
