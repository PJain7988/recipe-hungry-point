import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/recipes');
        setRecipes(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch recipes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (recipe.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">All Recipes</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover a variety of delicious recipes tailored to your taste.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm hover:shadow-md transition-all text-lg"
            placeholder="Search recipes, ingredients..."
          />
          <button 
            type="submit"
            className="absolute inset-y-2 right-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 rounded-xl transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} id={recipe._id} {...recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="text-xl text-gray-500 mb-4">No recipes found matching "{searchQuery}"</p>
          <button 
            onClick={() => { setSearchQuery(''); setSearchParams({}); }}
            className="text-orange-500 font-semibold hover:text-orange-600"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Recipes;
