import React, { useState, useEffect } from 'react';
import { User, Heart, Settings, Utensils, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsForm, setSettingsForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/favorites');
        setFavorites(response.data.data.map(f => f.recipe));
      } catch (error) {
        toast.error('Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchMyRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/recipes/me');
        setMyRecipes(response.data.data);
      } catch (error) {
        toast.error('Failed to load your recipes');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'favorites') fetchFavorites();
    if (activeTab === 'recipes') fetchMyRecipes();
  }, [activeTab]);

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', settingsForm);
      login(res.data); // Update auth store with new user data
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

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
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : myRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {myRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id} id={recipe._id} {...recipe} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500">You haven't published any recipes yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
              <form onSubmit={handleSettingsUpdate} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                  <input
                    type="text"
                    value={settingsForm.avatar}
                    onChange={(e) => setSettingsForm({ ...settingsForm, avatar: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={settingsForm.bio}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-xl transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
