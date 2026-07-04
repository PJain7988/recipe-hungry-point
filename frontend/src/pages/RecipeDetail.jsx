import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Flame, ChefHat, ArrowLeft, Loader2, Heart, Star, MessageSquare, List, Play, Pause, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [collections, setCollections] = useState([]);
  const [showCollections, setShowCollections] = useState(false);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // We will need a GET /api/recipes/:id endpoint on the backend
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data.data);
        const commentsRes = await api.get(`/comments/${id}`);
        setComments(commentsRes.data.data || []);
        
        if (user) {
          const collectionsRes = await api.get('/collections');
          setCollections(collectionsRes.data.data || []);
        }
      } catch (error) {
        toast.error('Failed to load recipe details');
        navigate('/recipes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate, user]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      toast.success('Timer finished! 🍳', { duration: 5000 });
      // Play a sound if possible (browser restrictions apply)
      try {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!recipe) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const res = await api.post('/comments', { recipeId: recipe._id, text: newComment });
      setComments([res.data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (e) {
      toast.error('Failed to add comment');
    }
  };

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
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500 font-bold overflow-hidden">
                {recipe.user?.avatar ? <img src={recipe.user.avatar} className="w-full h-full object-cover" alt="avatar" /> : (recipe.user?.name ? recipe.user.name.charAt(0) : 'C')}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Author</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{recipe.user?.name || 'Chef Master'}</p>
                  {recipe.user?._id && (
                    <button 
                      onClick={async () => {
                        try {
                          await api.post('/follows', { userId: recipe.user._id });
                          toast.success(`Following ${recipe.user.name}!`);
                        } catch (e) {
                          toast.error(e.response?.data?.message || 'Error following user');
                        }
                      }}
                      className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold hover:bg-orange-200 transition-colors"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <ChefHat className="mr-3 text-orange-500" size={28} />
                Ingredients
              </h2>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Servings:</span>
                <select 
                  value={servingsMultiplier}
                  onChange={(e) => setServingsMultiplier(Number(e.target.value))}
                  className="bg-transparent font-bold text-orange-500 focus:outline-none"
                >
                  <option value={1}>Default (1x)</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                  <option value={6}>6x</option>
                  <option value={8}>8x</option>
                </select>
              </div>
            </div>
            
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, idx) => {
                  // Simple parser to multiply numbers at the start of the ingredient string
                  const match = ingredient.match(/^([\d./]+)\s*(.*)/);
                  let displayIngredient = ingredient;
                  
                  if (match && servingsMultiplier !== 1) {
                    const numStr = match[1];
                    const rest = match[2];
                    
                    // Convert fractions like 1/2 to decimal
                    let num = 0;
                    if (numStr.includes('/')) {
                      const [numPart, denPart] = numStr.split('/');
                      num = parseFloat(numPart) / parseFloat(denPart);
                    } else {
                      num = parseFloat(numStr);
                    }
                    
                    if (!isNaN(num)) {
                      displayIngredient = `${+(num * servingsMultiplier).toFixed(2)} ${rest}`;
                    }
                  }
                  
                  return (
                    <li key={idx} className="flex items-center text-gray-700 bg-orange-50/50 p-3 rounded-xl">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-4"></div>
                      {displayIngredient}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No ingredients specified.</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <List className="mr-3 text-orange-500" size={28} />
                Instructions
              </h2>
              <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl">
                <Clock size={18} className="text-orange-400" />
                <span className="font-mono text-lg font-bold">
                  {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
                {timerActive ? (
                  <button onClick={() => setTimerActive(false)} className="text-orange-400 hover:text-white transition-colors ml-2">
                    <Pause size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if (timerSeconds === 0) setTimerSeconds(15 * 60); // Default 15 min
                      setTimerActive(true);
                    }} 
                    className="text-orange-400 hover:text-white transition-colors ml-2"
                  >
                    <Play size={18} />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setTimerActive(false);
                    const mins = prompt('Enter timer minutes:', '15');
                    if (mins && !isNaN(mins)) setTimerSeconds(Number(mins) * 60);
                  }} 
                  className="text-gray-400 hover:text-white transition-colors ml-1"
                >
                  <Square size={16} />
                </button>
              </div>
            </div>
            
            <div className="prose prose-orange max-w-none mb-12">
              {recipe.instructions.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p> : null
              ))}
            </div>
          </div>
          
          {/* Interaction Section */}
          <div className="border-t border-gray-100 pt-8 mt-8 flex flex-wrap gap-4 justify-between items-center relative">
            <div className="flex gap-4">
              <button 
                onClick={async () => {
                  try {
                    await api.post('/favorites', { recipeId: recipe._id });
                    toast.success('Saved to Favorites!');
                  } catch (e) {
                    toast.error(e.response?.data?.message || 'Error saving recipe');
                  }
                }}
                className="flex items-center text-orange-500 hover:text-white border border-orange-500 hover:bg-orange-500 font-semibold py-2 px-6 rounded-full transition-colors"
              >
                <Heart className="mr-2" size={20} />
                Save Recipe
              </button>
              
              {user && collections.length > 0 && (
                <div className="relative">
                  <button 
                    onClick={() => setShowCollections(!showCollections)}
                    className="flex items-center text-gray-600 hover:text-orange-500 border border-gray-300 hover:border-orange-500 font-semibold py-2 px-6 rounded-full transition-colors"
                  >
                    + Add to Collection
                  </button>
                  {showCollections && (
                    <div className="absolute top-12 left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl p-2 z-10">
                      {collections.map(c => (
                        <button
                          key={c._id}
                          onClick={async () => {
                            try {
                              await api.post('/collections/add', { collectionId: c._id, recipeId: recipe._id });
                              toast.success(`Added to ${c.name}`);
                              setShowCollections(false);
                            } catch (e) {
                              toast.error('Error adding to collection');
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex text-orange-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={24} 
                  className="cursor-pointer hover:fill-orange-400 transition-colors"
                  onClick={async () => {
                    try {
                      await api.post('/ratings', { recipeId: recipe._id, stars: star });
                      toast.success('Rating submitted!');
                    } catch (e) {
                      toast.error('Error submitting rating');
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-100 pt-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="mr-3 text-orange-500" size={28} />
              Comments ({comments.length})
            </h2>
            
            <form onSubmit={handleAddComment} className="mb-8 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a comment..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24"
              ></textarea>
              <button 
                type="submit"
                className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-xl transition-colors"
              >
                Post
              </button>
            </form>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <img 
                    src={comment.user?.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="bg-gray-50 rounded-2xl p-4 flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">{comment.user?.name || 'User'}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
