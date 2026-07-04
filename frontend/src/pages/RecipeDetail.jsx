import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Flame, ChefHat, ArrowLeft, Loader2, Heart, Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // We will need a GET /api/recipes/:id endpoint on the backend
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data.data);
        const commentsRes = await api.get(`/comments/${id}`);
        setComments(commentsRes.data.data || []);
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
            <div className="prose prose-orange max-w-none mb-12">
              {recipe.instructions.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p> : null
              ))}
            </div>
          </div>
          
          {/* Interaction Section */}
          <div className="border-t border-gray-100 pt-8 mt-8 flex justify-between items-center">
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
