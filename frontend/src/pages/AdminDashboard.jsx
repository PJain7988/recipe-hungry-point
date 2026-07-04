import React, { useState, useEffect } from 'react';
import { Users, Utensils, MessageSquare, Star, Trash2, Loader2, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, recipes

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data.data);
        
        const usersRes = await api.get('/admin/users');
        setUsersList(usersRes.data.data);
      } catch (error) {
        toast.error('Failed to load admin data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsersList(usersList.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await api.delete(`/admin/recipes/${recipeId}`);
      // Remove from stats recent recipes to show it worked
      setStats({
        ...stats,
        recentRecipes: stats.recentRecipes.filter(r => r._id !== recipeId)
      });
      toast.success('Recipe deleted');
    } catch (e) {
      toast.error('Failed to delete recipe');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex justify-center items-center gap-3">
          <BarChart2 className="text-orange-500" size={36} /> Admin Dashboard
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Manage your platform's users, recipes, and monitor analytics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${activeTab === 'users' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Manage Users
        </button>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-blue-50 text-blue-500 p-4 rounded-2xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.stats.totalUsers}</h3>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-orange-50 text-orange-500 p-4 rounded-2xl">
                <Utensils size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Recipes</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.stats.totalRecipes}</h3>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-green-50 text-green-500 p-4 rounded-2xl">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Comments</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.stats.totalComments}</h3>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="bg-yellow-50 text-yellow-500 p-4 rounded-2xl">
                <Star size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Ratings</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.stats.totalRatings}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recipes by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoriesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#fff8f0'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Recipes */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Recipes</h3>
              <div className="space-y-4">
                {stats.recentRecipes.map(recipe => (
                  <div key={recipe._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <img src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt="Recipe" className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900">{recipe.title}</h4>
                        <p className="text-sm text-gray-500">By {recipe.user?.name}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteRecipe(recipe._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Recipe"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="pb-4 font-medium px-4">User</th>
                  <th className="pb-4 font-medium px-4">Email</th>
                  <th className="pb-4 font-medium px-4">Role</th>
                  <th className="pb-4 font-medium px-4">Joined</th>
                  <th className="pb-4 font-medium px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} className="w-10 h-10 rounded-full" alt="avatar" />
                        <span className="font-semibold text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{u.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
