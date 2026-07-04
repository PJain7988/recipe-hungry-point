const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
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
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate ratings (a user can only rate a recipe once)
ratingSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
