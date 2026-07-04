import React, { useState, useEffect } from 'react';
import { User, Heart, Settings, Utensils, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/favorites');
        setFavorites(response.data.data.map(f => f.recipe));
      } catch (error) {
        toast.error('Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="text-center mb-6">
              <img 
                src={user?.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                alt="Profile" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Home Chef'}</p>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'favorites' ? 'bg-orange-50 text-orange-500 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Heart size={18} className="mr-3" />
                Saved Recipes
              </button>
              <button 
                onClick={() => setActiveTab('recipes')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'recipes' ? 'bg-orange-50 text-orange-500 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Utensils size={18} className="mr-3" />
                My Recipes
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-orange-50 text-orange-500 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings size={18} className="mr-3" />
                Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Recipes</h2>
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {favorites.map((recipe) => (
                    <RecipeCard key={recipe._id} id={recipe._id} {...recipe} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500">You haven't saved any recipes yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recipes' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Published Recipes</h2>
              <p className="text-gray-500">Feature coming soon in Phase 2.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
              <p className="text-gray-500">Profile updates coming soon in Phase 2.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
