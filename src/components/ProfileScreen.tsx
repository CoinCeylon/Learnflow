import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AnalyticsSection } from "./AnalyticsSection";
import { useWallet } from "./WalletProvider";
import { toast } from "sonner";

interface ProfileScreenProps {
  onBack: () => void;
  onSelectQuiz: (quizId: string) => void;
}

export function ProfileScreen({ onBack, onSelectQuiz }: ProfileScreenProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userProgress = useQuery(api.quiz.getUserProgress);
  const nftBadges = useQuery(api.quiz.getUserNFTBadges);
  const updateUserName = useMutation(api.users.updateUserName);
  const { isConnected, walletAddress, walletName, connectWallet, disconnectWallet, isLoading } = useWallet();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!loggedInUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
        <p className="text-gray-600">You need to be signed in to view your profile.</p>
      </div>
    );
  }

  if (!userProgress) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your progress...</p>
      </div>
    );
  }

  const handleEditName = () => {
    setEditedName(loggedInUser.name || "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (editedName.trim() === loggedInUser.name) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateUserName({ name: editedName.trim() });
      setIsEditingName(false);
      toast.success("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName("");
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast.success(`Successfully connected to ${walletName || 'wallet'}!`);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error(error instanceof Error ? error.message : "Failed to connect wallet");
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast.success("Wallet disconnected");
  };

  const formatAddress = (address: string) => {
    if (address.length > 20) {
      return `${address.slice(0, 10)}...${address.slice(-10)}`;
    }
    return address;
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
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : '👤'}
          </div>
          
          {/* Editable Name Section */}
          <div className="mb-4">
            {isEditingName ? (
              <div className="flex flex-col items-center space-y-3 max-w-md mx-auto">
                <label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                  Edit your display name
                </label>
                <div className="relative w-full">
                  <input
                    id="edit-name"
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full text-2xl font-bold text-primary text-center bg-white border-2 border-primary/30 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Enter your name"
                    maxLength={50}
                    autoFocus
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {editedName.length}/50 characters
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveName}
                    disabled={isSaving || !editedName.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Press Enter to save, Escape to cancel
                </p>
              </div>
            ) : (
              <div className="group relative">
                <h1 className="text-3xl font-bold text-primary text-center">
                  {loggedInUser.name || 'Anonymous Learner'}
                </h1>
                <button
                  onClick={handleEditName}
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg transform translate-x-1/2 -translate-y-1/2"
                  title="Edit name"
                >
                  <svg className="w-5 h-5 text-gray-500 hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <p className="text-xs text-gray-400 mt-1 text-center">Hover to edit your name</p>
              </div>
            )}
          </div>
          
          {loggedInUser.email && (
            <p className="text-secondary mb-4">{loggedInUser.email}</p>
          )}
          
          {userProgress.progress && (
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  Level {userProgress.progress.currentLevel}
                </div>
                <div className="text-secondary">Current Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userProgress.progress.streakCount}
                </div>
                <div className="text-secondary">Day Streak</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Connection Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-dark mb-6 flex items-center">
          <span className="text-2xl mr-2">🔗</span>
          Cardano Wallet Connection
        </h2>
        
        {isConnected && walletAddress ? (
          <WalletConnectedView 
            walletName={walletName}
            walletAddress={walletAddress}
            onDisconnect={handleDisconnectWallet}
            formatAddress={formatAddress}
          />
        ) : (
          <WalletDisconnectedView 
            onConnect={handleConnectWallet}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* AI Analytics Section */}
      <AnalyticsSection 
        userProgress={userProgress.progress}
        quizResults={userProgress.recentResults || []}
        nftBadges={nftBadges || []}
      />

      {/* Progress Overview */}
      {userProgress.progress && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-dark mb-6">Learning Progress</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {userProgress.progress.totalQuizzesCompleted}
              </div>
              <div className="text-sm text-secondary">Quizzes Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {userProgress.progress.totalPerfectScores}
              </div>
              <div className="text-sm text-secondary">Perfect Scores</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {userProgress.progress.totalNFTsEarned}
              </div>
              <div className="text-sm text-secondary">NFT Badges</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {Math.round(userProgress.averageScore * 100)}%
              </div>
              <div className="text-sm text-secondary">Average Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (userProgress.progress.currentLevel / 4) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-secondary">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>
      )}

      {/* Recent Quiz Results */}
      {userProgress.recentResults && userProgress.recentResults.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-dark mb-6">Recent Quiz Results</h2>
          
          <div className="space-y-4">
            {userProgress.recentResults.map((result: any, index: number) => (
              <div key={result._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-dark">Quiz #{userProgress.recentResults.length - index}</div>
                  <div className="text-sm text-secondary">
                    {formatDate(result.completedAt)} • {formatTime(result.timeSpent)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    result.isPerfectScore ? 'text-green-600' : 
                    (result.score / result.totalQuestions) >= 0.8 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {result.score}/{result.totalQuestions}
                  </div>
                  <div className="text-sm text-secondary">
                    {Math.round((result.score / result.totalQuestions) * 100)}%
                  </div>
                </div>
                
                {result.isPerfectScore && (
                  <div className="ml-3 text-2xl" title="Perfect Score!">
                    🏆
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFT Badges Collection */}
      {nftBadges && nftBadges.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-dark mb-6 flex items-center">
            <span className="text-2xl mr-2">🏆</span>
            NFT Badge Collection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nftBadges.map((badge: any) => (
              <div key={badge._id} className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">🎖️</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    badge.quiz ? getDifficultyColor(badge.quiz.difficulty) : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {badge.quiz ? `Level ${badge.quiz.level}` : 'Achievement'}
                  </span>
                </div>
                
                <h3 className="font-semibold text-dark mb-1">
                  {badge.quiz ? badge.quiz.title : 'Quiz Badge'}
                </h3>
                <p className="text-sm text-secondary mb-3">
                  {badge.quiz ? badge.quiz.category : 'Achievement Badge'}
                </p>
                
                <div className="text-xs text-secondary">
                  Earned: {formatDate(badge.mintedAt)}
                </div>
                
                {badge.transactionId && (
                  <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                    <span className="font-medium">TX:</span>
                    <span className="ml-1 font-mono">
                      {badge.transactionId.slice(0, 8)}...{badge.transactionId.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {(!userProgress.recentResults || userProgress.recentResults.length === 0) && (
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-dark mb-2">Start Your Learning Journey</h3>
          <p className="text-secondary mb-4">
            Complete your first quiz to see your progress and earn achievements!
          </p>
          <button
            onClick={() => onBack()}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Take Your First Quiz
          </button>
        </div>
      )}
    </div>
  );
}

// Helper components for wallet connection
function WalletConnectedView({ walletName, walletAddress, onDisconnect, formatAddress }: {
  walletName: string | null;
  walletAddress: string;
  onDisconnect: () => void;
  formatAddress: (address: string) => string;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800">Connected to {walletName || 'Wallet'}</span>
            </div>
            <p className="text-sm text-green-700 font-mono bg-green-100 px-3 py-2 rounded-lg break-all">
              {formatAddress(walletAddress)}
            </p>
          </div>
          <button
            onClick={onDisconnect}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Disconnect
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">🎖️ NFT Badge Benefits</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Earn verifiable achievement badges for perfect quiz scores</li>
          <li>• Badges are minted as NFTs on the Cardano blockchain</li>
          <li>• Permanently prove your knowledge and skills</li>
          <li>• Share your achievements with employers and peers</li>
        </ul>
      </div>
    </div>
  );
}

function WalletDisconnectedView({ onConnect, isLoading }: {
  onConnect: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
        <div className="text-center">
          <div className="text-4xl mb-3">🔗</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Connect Your Cardano Wallet
          </h3>
          <p className="text-yellow-700 mb-4 text-sm">
            Connect your Cardano wallet to earn verifiable NFT achievement badges when you get perfect scores!
          </p>
          
          <button
            onClick={onConnect}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connecting...
              </div>
            ) : (
              "🔗 Connect Wallet"
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">📱 Supported Wallets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2"><span>🟢</span><span>Lace</span></div>
          <div className="flex items-center space-x-2"><span>🔵</span><span>Nami</span></div>
          <div className="flex items-center space-x-2"><span>🟡</span><span>Eternl</span></div>
          <div className="flex items-center space-x-2"><span>🟣</span><span>Flint</span></div>
          <div className="flex items-center space-x-2"><span>🔴</span><span>Typhon</span></div>
          <div className="flex items-center space-x-2"><span>🟠</span><span>Yoroi</span></div>
        </div>
        <p className="text-xs text-gray-500 mt-3">Install any of these Cardano wallets to connect and earn NFT badges</p>
      </div>
    </div>
  );
}
