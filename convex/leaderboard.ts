import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get top users for leaderboard
export const getTopUsers = query({
  args: {},
  handler: async (ctx) => {
    // Get all user progress records
    const allProgress = await ctx.db.query("userProgress").collect();
    
    // Calculate scores and get user details
    const userScores = await Promise.all(
      allProgress.map(async (progress) => {
        const user = await ctx.db.get(progress.userId);
        if (!user) return null;
        
        // Calculate total score based on multiple factors
        const totalScore = 
          (progress.totalPerfectScores * 100) + // Perfect scores worth 100 points each
          (progress.totalQuizzesCompleted * 10) + // Each quiz worth 10 points
          (progress.totalNFTsEarned * 50) + // NFTs worth 50 points each
          (progress.streakCount * 5) + // Streak days worth 5 points each
          (progress.currentLevel * 25); // Each level worth 25 points
        
        return {
          userId: progress.userId,
          name: user.name || 'Anonymous Learner',
          email: user.email,
          totalScore,
          currentLevel: progress.currentLevel,
          totalQuizzesCompleted: progress.totalQuizzesCompleted,
          totalPerfectScores: progress.totalPerfectScores,
          totalNFTsEarned: progress.totalNFTsEarned,
          streakCount: progress.streakCount,
          lastActiveAt: progress.lastActiveAt,
        };
      })
    );
    
    // Filter out null values and sort by total score
    const validScores = userScores
      .filter((score): score is NonNullable<typeof score> => score !== null)
      .sort((a, b) => b.totalScore - a.totalScore);
    
    // Add rank to each user
    return validScores.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  },
});

// Get current user's rank and position
export const getCurrentUserRank = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    
    // Get user progress directly to avoid circular dependency
    const userProgress = await ctx.db.query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (!userProgress) {
      return null;
    }
    
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    
    // Calculate user's score
    const totalScore = 
      (userProgress.totalPerfectScores * 100) +
      (userProgress.totalQuizzesCompleted * 10) +
      (userProgress.totalNFTsEarned * 50) +
      (userProgress.streakCount * 5) +
      (userProgress.currentLevel * 25);
    
    // Get all progress to calculate rank
    const allProgress = await ctx.db.query("userProgress").collect();
    
    // Calculate all scores and sort
    const allScores = await Promise.all(
      allProgress.map(async (progress) => {
        const progressUser = await ctx.db.get(progress.userId);
        if (!progressUser) return null;
        
        const score = 
          (progress.totalPerfectScores * 100) +
          (progress.totalQuizzesCompleted * 10) +
          (progress.totalNFTsEarned * 50) +
          (progress.streakCount * 5) +
          (progress.currentLevel * 25);
        
        return { userId: progress.userId, totalScore: score };
      })
    );
    
    const validScores = allScores
      .filter((score): score is NonNullable<typeof score> => score !== null)
      .sort((a, b) => b.totalScore - a.totalScore);
    
    const rank = validScores.findIndex(score => score.userId === userId) + 1;
    
    return {
      userId,
      name: user.name || 'Anonymous Learner',
      email: user.email,
      totalScore,
      currentLevel: userProgress.currentLevel,
      totalQuizzesCompleted: userProgress.totalQuizzesCompleted,
      totalPerfectScores: userProgress.totalPerfectScores,
      totalNFTsEarned: userProgress.totalNFTsEarned,
      streakCount: userProgress.streakCount,
      lastActiveAt: userProgress.lastActiveAt,
      rank,
      totalUsers: validScores.length,
    };
  },
});

// Get leaderboard stats
export const getLeaderboardStats = query({
  args: {},
  handler: async (ctx) => {
    const allProgress = await ctx.db.query("userProgress").collect();
    
    const totalUsers = allProgress.length;
    const totalQuizzesCompleted = allProgress.reduce((sum, p) => sum + p.totalQuizzesCompleted, 0);
    const totalPerfectScores = allProgress.reduce((sum, p) => sum + p.totalPerfectScores, 0);
    const totalNFTsEarned = allProgress.reduce((sum, p) => sum + p.totalNFTsEarned, 0);
    
    return {
      totalUsers,
      totalQuizzesCompleted,
      totalPerfectScores,
      totalNFTsEarned,
    };
  },
});
