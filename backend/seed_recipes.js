const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./src/models/Recipe');
const User = require('./src/models/User');

dotenv.config();

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
  }
];

const seedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin user found to attribute recipes to.');
      process.exit(1);
    }

    for (let recipe of recipes) {
      recipe.user = admin._id;
      await Recipe.create(recipe);
    }
    
    console.log('Recipes seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding recipes:', error);
    process.exit(1);
  }
};

seedRecipes();
