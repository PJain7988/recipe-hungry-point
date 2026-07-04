import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Drinks', 'Vegan', 'Vegetarian', 'Indian', 'Chinese', 'Italian', 'Mexican', 'Other'];

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        
        if (search) query.append('search', search);
        if (category && category !== 'All') query.append('category', category);
        
        const response = await api.get(`/recipes?${query.toString()}`);
        setRecipes(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch recipes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [searchParams]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const updateFilters = (search, category) => {
    const params = {};
    if (search?.trim()) params.search = search.trim();
    if (category && category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters(searchQuery, selectedCategory);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    updateFilters(searchQuery, category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Explore Recipes</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover a variety of delicious recipes tailored to your taste.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Categories</h3>
            <div className="flex flex-row lg:flex-col flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-xl text-left text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-500'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} id={recipe._id} {...recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <p className="text-xl text-gray-500 mb-4">No recipes found matching your criteria</p>
              <button 
                onClick={() => updateFilters('', 'All')}
                className="text-orange-500 font-semibold hover:text-orange-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
