const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a recipe title'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3',
    },
    time: {
      type: String,
      default: '30 min',
    },
    difficulty: {
      type: String,
      default: 'Medium',
    },
    calories: {
      type: String,
      default: '400',
    },
    instructions: {
      type: String,
      required: [true, 'Please add instructions'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
