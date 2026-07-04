import React, { useState, useEffect } from 'react';
import { User, Heart, Settings, Utensils, Loader2, Calendar, Search, Bell, Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsForm, setSettingsForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    diet: 'None',
    notifications: true
  });
  
  const [mealPlan, setMealPlan] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
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

    const fetchFollowData = async () => {
      setIsLoading(true);
      try {
        const [followersRes, followingRes] = await Promise.all([
          api.get(`/users/${user._id}/followers`),
          api.get(`/users/${user._id}/following`)
        ]);
        setFollowers(followersRes.data.data);
        setFollowing(followingRes.data.data);
      } catch (error) {
        toast.error('Failed to load follow data');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/collections');
        setCollections(response.data.data);
      } catch (error) {
        toast.error('Failed to load collections');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'favorites') fetchFavorites();
    if (activeTab === 'recipes') fetchMyRecipes();
    if (activeTab === 'community') fetchFollowData();
    if (activeTab === 'collections') fetchCollections();
  }, [activeTab, user._id]);

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
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-orange-100"
              />
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{user?.role === 'admin' ? 'Administrator' : 'Home Chef'}</p>
              
              {user?.level !== undefined && (
                <div className="bg-orange-50 rounded-xl p-3 mb-6">
                  <div className="flex justify-between text-sm font-bold text-orange-600 mb-1">
                    <span>Level {user.level}</span>
                    <span>{user.xp} XP</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(user.xp % 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-orange-400 mt-2 text-left">{100 - (user.xp % 100)} XP to next level</p>
                </div>
              )}
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
                onClick={() => setActiveTab('community')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'community' ? 'bg-orange-50 text-orange-500 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User size={18} className="mr-3" />
                Community
              </button>
              <button 
                onClick={() => setActiveTab('collections')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'collections' ? 'bg-orange-50 text-orange-500 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Heart size={18} className="mr-3" />
                Collections
              </button>
              <button 
                onClick={() => setActiveTab('mealplan')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'mealplan' ? 'bg-orange-50 text-orange-500 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Calendar size={18} className="mr-3" />
                Meal Planner
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

          {activeTab === 'community' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Community</h2>
                <button 
                  onClick={() => toast.success('Discover Chefs feature coming soon!')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors flex items-center"
                >
                  <Search size={16} className="mr-2" />
                  Find Chefs
                </button>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Following ({following.length})</h3>
                    <div className="space-y-4">
                      {following.map(f => (
                        <div key={f._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                          <img src={f.following?.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} className="w-10 h-10 rounded-full" alt="avatar" />
                          <span className="font-semibold">{f.following?.name || 'Chef'}</span>
                        </div>
                      ))}
                      {following.length === 0 && <p className="text-gray-500 text-sm">You aren't following anyone yet.</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Followers ({followers.length})</h3>
                    <div className="space-y-4">
                      {followers.map(f => (
                        <div key={f._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                          <img src={f.follower?.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} className="w-10 h-10 rounded-full" alt="avatar" />
                          <span className="font-semibold">{f.follower?.name || 'Chef'}</span>
                        </div>
                      ))}
                      {followers.length === 0 && <p className="text-gray-500 text-sm">No followers yet.</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'collections' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Collections</h2>
                <button 
                  onClick={async () => {
                    const name = prompt('Enter collection name:');
                    if (name) {
                      try {
                        const res = await api.post('/collections', { name });
                        setCollections([...collections, res.data.data]);
                        toast.success('Collection created!');
                      } catch (e) {
                        toast.error('Failed to create collection');
                      }
                    }
                  }}
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
                >
                  + New Collection
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : collections.length > 0 ? (
                <div className="space-y-6">
                  {collections.map(c => (
                    <div key={c._id} className="bg-gray-50 p-6 rounded-2xl">
                      <h3 className="font-bold text-xl mb-4">{c.name} ({c.recipes.length} recipes)</h3>
                      {c.recipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {c.recipes.map(recipe => (
                            <RecipeCard key={recipe._id} id={recipe._id} {...recipe} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No recipes in this collection yet.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 mb-4">You don't have any collections.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'mealplan' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Weekly Meal Planner</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors">
                  Generate with AI
                </button>
              </div>
              
              <div className="bg-orange-50 rounded-2xl p-8 text-center border border-orange-100">
                <Calendar size={48} className="mx-auto text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Your Meals</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">Drag and drop your favorite recipes here to create your weekly meal plan, or let our AI generate one for you based on your preferences.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-h-[120px] flex flex-col">
                      <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">{day}</h4>
                      
                      <div className="space-y-2 mb-2">
                        {mealPlan[day].map((item, idx) => (
                          <div key={idx} className="text-xs bg-orange-100 text-orange-800 p-2 rounded-lg font-medium flex justify-between">
                            {item}
                            <button onClick={() => {
                              const newPlan = {...mealPlan};
                              newPlan[day] = newPlan[day].filter((_, i) => i !== idx);
                              setMealPlan(newPlan);
                            }} className="text-orange-500 hover:text-red-500">×</button>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          const recipe = prompt('Enter recipe name to add to ' + day + ':');
                          if (recipe) {
                            setMealPlan({ ...mealPlan, [day]: [...mealPlan[day], recipe] });
                          }
                        }}
                        className="mt-auto border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center py-2 text-sm text-gray-400 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500 transition-colors cursor-pointer w-full"
                      >
                        + Add Recipe
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Heart size={18} className="mr-2 text-orange-500"/> Preferences</h3>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
                  <select
                    value={settingsForm.diet}
                    onChange={(e) => setSettingsForm({ ...settingsForm, diet: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="None">No specific diet</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Keto">Keto</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Bell size={18} className="mr-2 text-orange-500"/> Notifications</h3>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.notifications}
                      onChange={(e) => setSettingsForm({ ...settingsForm, notifications: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-gray-700 font-medium">Email me when someone follows me or likes my recipe</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Shield size={18} className="mr-2 text-orange-500"/> Security</h3>
                  <button 
                    type="button"
                    onClick={() => toast.success('Password reset link sent to your email!')}
                    className="text-orange-500 font-medium hover:underline"
                  >
                    Change Password
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  Save All Changes
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
