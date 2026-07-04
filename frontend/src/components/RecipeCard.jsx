import React, { useState } from 'react';
import { Clock, Users, Flame, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const RecipeCard = ({ id, title, image, time, difficulty, calories, author }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="block group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 relative">
      <Link to={`/recipe/${id}`} className="block relative h-48 overflow-hidden">
        <img 
          src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center shadow-sm">
          <Flame size={12} className="text-orange-500 mr-1" />
          {calories || '350'} kcal
        </div>
      </Link>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/recipe/${id}`} className="block">
            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <button 
            onClick={async (e) => {
              e.preventDefault();
              try {
                const res = await api.post('/favorites', { recipeId: id });
                if (res.data.action === 'removed') {
                  setIsSaved(false);
                  toast.success('Removed from Favorites');
                } else {
                  setIsSaved(true);
                  toast.success('Saved to Favorites!');
                }
              } catch (err) {
                if (err.response?.status === 401) {
                  toast.error('Please login to save favorites');
                } else {
                  toast.error(err.response?.data?.message || 'Error saving recipe');
                }
              }
            }}
            className={`transition-colors p-1 ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4 mt-3">
          <span className="flex items-center">
            <Clock size={16} className="mr-1 text-gray-400" />
            {time || '30 min'}
          </span>
          <span className="flex items-center">
            <Users size={16} className="mr-1 text-gray-400" />
            {difficulty || 'Easy'}
          </span>
        </div>
        <div className="pt-4 border-t border-gray-100 flex items-center">
          <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold mr-2">
            {author ? author.charAt(0) : 'C'}
          </div>
          <span className="text-sm font-medium text-gray-700">{author || 'Chef Master'}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
