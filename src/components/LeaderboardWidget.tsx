import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface LeaderboardWidgetProps {
  showTitle?: boolean;
  maxUsers?: number;
}

export function LeaderboardWidget({ showTitle = true, maxUsers = 5 }: LeaderboardWidgetProps) {
  const topUsers = useQuery(api.leaderboard.getTopUsers);
  const stats = useQuery(api.leaderboard.getLeaderboardStats);

  if (!topUsers || !stats) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayUsers = topUsers.slice(0, maxUsers);

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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏆</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top Learners</h2>
              <p className="text-sm text-gray-600">
                {stats.totalUsers} active learners • {stats.totalQuizzesCompleted} quizzes completed
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {displayUsers.map((user) => (
          <div
            key={user.userId}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold ${getRankColor(user.rank)}`}>
                {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-gray-900 truncate max-w-32">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500">
                  Level {user.currentLevel} • {user.totalPerfectScores} perfect scores
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {user.totalScore.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>
        ))}
      </div>

      {topUsers.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Be the First!
          </h3>
          <p className="text-gray-600">
            Complete quizzes to appear on the leaderboard
          </p>
        </div>
      )}
    </div>
  );
}
