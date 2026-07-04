const User = require('../models/User');

const awardXP = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.xp += amount;

    // Simple level system: 100 XP per level
    const newLevel = Math.floor(user.xp / 100) + 1;
    
    if (newLevel > user.level) {
      user.level = newLevel;
      // You could push new badges based on levels here
    }

    await user.save();
  } catch (error) {
    console.error('Error awarding XP:', error);
  }
};

module.exports = { awardXP };
