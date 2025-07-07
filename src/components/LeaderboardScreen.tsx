import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface LeaderboardScreenProps {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const topUsers = useQuery(api.leaderboard.getTopUsers);
  const currentUserRank = useQuery(api.leaderboard.getCurrentUserRank);
  const stats = useQuery(api.leaderboard.getLeaderboardStats);

  if (!topUsers || !stats) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case 2: return "text-gray-600 bg-gray-50 border-gray-200";
      case 3: return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-secondary hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Quizzes
          </button>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600 mb-6">
            Compete with learners worldwide and climb the ranks!
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-blue-800">Active Learners</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.totalQuizzesCompleted}</div>
              <div className="text-sm text-green-800">Quizzes Completed</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.totalPerfectScores}</div>
              <div className="text-sm text-purple-800">Perfect Scores</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.totalNFTsEarned}</div>
              <div className="text-sm text-orange-800">NFT Badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current User Rank */}
      {currentUserRank && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-xl mr-2">📍</span>
            Your Ranking
          </h2>
          
          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold ${getRankColor(currentUserRank.rank)}`}>
                {currentUserRank.rank <= 3 ? getRankIcon(currentUserRank.rank) : currentUserRank.rank}
              </div>
              
              <div>
                <div className="font-bold text-gray-900">{currentUserRank.name}</div>
                <div className="text-sm text-gray-600">
                  Rank {currentUserRank.rank} of {currentUserRank.totalUsers} • Level {currentUserRank.currentLevel}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {currentUserRank.totalScore.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">points</div>
            </div>
          </div>
        </div>
      )}

      {/* Top Users */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-2xl mr-2">👑</span>
          Top Learners
        </h2>
        
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div
              key={user.userId}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                currentUserRank?.userId === user.userId 
                  ? 'bg-primary/10 border-2 border-primary/30' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold ${getRankColor(user.rank)}`}>
                  {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-bold text-gray-900">{user.name}</div>
                    {currentUserRank?.userId === user.userId && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">You</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Level {user.currentLevel} • {user.totalQuizzesCompleted} quizzes • {user.totalPerfectScores} perfect scores
                  </div>
                  <div className="text-xs text-gray-500">
                    Last active: {formatLastActive(user.lastActiveAt)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {user.totalScore.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">points</div>
                {user.streakCount > 0 && (
                  <div className="text-xs text-orange-600 flex items-center justify-end mt-1">
                    🔥 {user.streakCount} day streak
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {topUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Rankings Yet
            </h3>
            <p className="text-gray-600">
              Be the first to complete a quiz and claim the top spot!
            </p>
          </div>
        )}
      </div>

      {/* Scoring System */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">📊</span>
          How Points Are Calculated
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="font-semibold text-blue-900 mb-2">Quiz Completion</div>
            <div className="text-sm text-blue-800">10 points per quiz completed</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="font-semibold text-green-900 mb-2">Perfect Scores</div>
            <div className="text-sm text-green-800">100 points per perfect score</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="font-semibold text-purple-900 mb-2">NFT Badges</div>
            <div className="text-sm text-purple-800">50 points per NFT earned</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="font-semibold text-orange-900 mb-2">Level Progress</div>
            <div className="text-sm text-orange-800">25 points per level reached</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <div className="font-semibold text-yellow-900 mb-1">Daily Streak Bonus</div>
          <div className="text-sm text-yellow-800">5 points per consecutive day of learning</div>
        </div>
      </div>
    </div>
  );
}
