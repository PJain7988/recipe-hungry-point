import React from 'react';
import { Search, ChefHat, User, Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-orange-500 p-2 rounded-lg text-white">
              <ChefHat size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Recipe<span className="text-orange-500">Hungry</span>Point
            </span>
          </Link>

          <form 
            className="hidden md:flex flex-1 max-w-md mx-8"
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value.trim();
              if (query) navigate(`/recipes?search=${encodeURIComponent(query)}`);
            }}
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="search"
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-shadow duration-300 shadow-sm hover:shadow-md"
                placeholder="Search recipes, ingredients..."
              />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/create-recipe" className="hidden md:flex text-gray-600 hover:text-orange-500 transition-colors font-medium">
                  Publish Recipe
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hidden md:flex text-gray-600 hover:text-orange-500 transition-colors font-medium">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="hidden md:flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition-colors">
                  <div className="flex flex-col text-right">
                    <span className="font-bold">Hi, {user?.name?.split(' ')[0] || 'Chef'}</span>
                    {user?.level !== undefined && (
                      <span className="text-xs text-orange-500 font-bold">Lvl {user.level} • {user.xp} XP</span>
                    )}
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors text-gray-600"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-orange-100 hover:text-orange-600 transition-colors text-gray-600">
                  <User size={18} />
                </div>
                <span className="hidden md:block font-medium text-gray-600 hover:text-orange-500">Sign In</span>
              </Link>
            )}

            <div className="md:hidden flex items-center">
              <button className="text-gray-600 hover:text-gray-900">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
