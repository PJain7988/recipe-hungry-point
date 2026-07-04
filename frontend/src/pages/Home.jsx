import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/recipes');
        // Get the latest 6 recipes for the home page
        setRecipes(response.data.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

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
          <Link to="/recipes" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Explore Recipes
          </Link>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Recipes</h2>
          <p className="text-gray-500">Most popular choices from our community.</p>
        </div>
        <Link to="/recipes" className="text-orange-500 hover:text-orange-600 font-semibold flex items-center group">
          View All 
          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} id={recipe._id} {...recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
