import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Flame, ChefHat, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // We will need a GET /api/recipes/:id endpoint on the backend
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data.data);
      } catch (error) {
        toast.error('Failed to load recipe details');
        navigate('/recipes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-orange-500 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="relative h-96">
          <img 
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3'} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-gray-800 flex items-center shadow-md">
            <Flame size={16} className="text-orange-500 mr-2" />
            {recipe.calories || '400'} kcal
          </div>
        </div>

        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{recipe.title}</h1>
          
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-3 text-orange-500">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Prep Time</p>
                <p className="font-semibold">{recipe.time || '30 min'}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-3 text-orange-500">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Difficulty</p>
                <p className="font-semibold">{recipe.difficulty || 'Medium'}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600 ml-auto">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500 font-bold">
                {recipe.user?.name ? recipe.user.name.charAt(0) : 'C'}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Author</p>
                <p className="font-semibold">{recipe.user?.name || 'Chef Master'}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChefHat className="mr-3 text-orange-500" size={28} />
              Instructions
            </h2>
            <div className="prose prose-orange max-w-none">
              {recipe.instructions.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p> : null
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
