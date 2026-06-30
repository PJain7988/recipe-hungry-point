import React from 'react';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const dummyRecipes = [
    {
      id: 1,
      title: "Spicy Garlic Butter Shrimp",
      image: "https://images.unsplash.com/photo-1625943555419-56a2cb596640?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      time: "20 min",
      difficulty: "Easy",
      calories: "450",
      author: "Chef Gordon"
    },
    {
      id: 2,
      title: "Creamy Tomato Basil Pasta",
      image: "https://images.unsplash.com/photo-1621996316524-70659610f7a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      time: "35 min",
      difficulty: "Medium",
      calories: "620",
      author: "Maria Rossi"
    },
    {
      id: 3,
      title: "Grilled Lemon Herb Chicken",
      image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      time: "45 min",
      difficulty: "Medium",
      calories: "380",
      author: "John Doe"
    },
    {
      id: 4,
      title: "Vegan Buddha Bowl",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      time: "15 min",
      difficulty: "Easy",
      calories: "320",
      author: "Sarah Green"
    },
    {
      id: 5,
      title: "Classic Beef Burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      time: "30 min",
      difficulty: "Medium",
      calories: "850",
      author: "Mike Grill"
    },
    {
      id: 6,
      title: "Fresh Summer Salad",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      time: "10 min",
      difficulty: "Easy",
      calories: "210",
      author: "Emma Leaf"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-16 h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Discover Your Next <span className="text-orange-400">Favorite</span> Meal
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 drop-shadow-md">
            Explore thousands of delicious recipes from around the world. Let's make something amazing today!
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Explore Recipes
          </button>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Recipes</h2>
          <p className="text-gray-500">Most popular choices from our community.</p>
        </div>
        <button className="text-orange-500 hover:text-orange-600 font-semibold flex items-center group">
          View All 
          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} {...recipe} />
        ))}
      </div>
    </div>
  );
};

export default Home;
