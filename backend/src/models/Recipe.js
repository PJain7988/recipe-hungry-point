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
      required: [true, 'Please add preparation time'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please add difficulty level'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    calories: {
      type: String,
      required: [true, 'Please add calories'],
    },
    category: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Drinks', 'Vegan', 'Vegetarian', 'Indian', 'Chinese', 'Italian', 'Mexican', 'Other'],
      default: 'Other',
    },
    tags: {
      type: [String],
      default: [],
    },
    instructions: {
      type: String,
      required: [true, 'Please add instructions'],
    },
    ingredients: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
