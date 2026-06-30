// Example controller for recipes
exports.getAllRecipes = (req, res) => {
  // In the future, this will fetch from MongoDB or PostgreSQL
  res.json({
    status: 'success',
    data: [
      { id: 1, name: 'Spicy Garlic Shrimp' },
      { id: 2, name: 'Vegan Buddha Bowl' }
    ]
  });
};
