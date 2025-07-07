import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useWallet } from "./WalletProvider";
import { QuizResult, QuizData } from "./QuizApp";
import { toast } from "sonner";

interface ResultsScreenProps {
  result: QuizResult;
  quiz: QuizData;
  onRetry: () => void;
  onBackToSelection: () => void;
  onViewProfile: () => void;
}

export function ResultsScreen({ result, quiz, onRetry, onBackToSelection, onViewProfile }: ResultsScreenProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<any>(null);
  const { isConnected, walletAddress, walletName } = useWallet();
  const saveResult = useMutation(api.quiz.saveQuizResult);
  const mintNFT = useAction(api.nft.mintNFTBadge);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const isPerfectScore = result.score === result.totalQuestions;
  const scorePercentage = Math.round((result.score / result.totalQuestions) * 100);

  const handleMintBadge = async () => {
    if (!isConnected || !walletAddress || !loggedInUser) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsMinting(true);
    try {
      toast.info("Minting your achievement badge...", { duration: 5000 });
      
      const nftResult = await mintNFT({
        walletAddress,
        studentName: loggedInUser.email || loggedInUser.name || "Anonymous",
        quizTitle: quiz.title,
        score: result.score,
        totalQuestions: result.totalQuestions,
        userId: loggedInUser._id,
        quizId: quiz._id as any,
      });

      setMintResult(nftResult);
      
      // Save the result with NFT transaction ID
      await saveResult({
        quizId: quiz._id as any,
        score: result.score,
        totalQuestions: result.totalQuestions,
        timeSpent: result.timeSpent,
        walletAddress,
        nftTransactionId: nftResult.transactionId,
      });

      toast.success("🎉 Achievement badge successfully minted!");
      
      setTimeout(() => {
        toast.info(`Check your ${walletName} wallet for the new badge!`, { duration: 8000 });
      }, 2000);
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to mint achievement badge";
      toast.error(errorMessage);
      
      if (errorMessage.includes("insufficient")) {
        toast.info("The service wallet may need more funds. Please try again later or contact support.");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const handleSaveResult = async () => {
    try {
      await saveResult({
        quizId: quiz._id as any,
        score: result.score,
        totalQuestions: result.totalQuestions,
        timeSpent: result.timeSpent,
        walletAddress: isConnected && walletAddress ? walletAddress : undefined,
      });
      toast.success("Result saved!");
    } catch (error) {
      console.error("Error saving result:", error);
      toast.error("Failed to save result");
    }
  };

  const formatAddress = (address: string) => {
    if (address.length > 20) {
      return `${address.slice(0, 10)}...${address.slice(-10)}`;
    }
    return address;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technology': return '💻';
      case 'Science': return '🔬';
      case 'Mathematics': return '📐';
      case 'Data Science': return '📊';
      case 'Physics': return '⚛️';
      case 'AI Generated': return '🤖';
      default: return '📚';
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToSelection}
            className="flex items-center text-secondary hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Quizzes
          </button>
          
          {loggedInUser && (
            <button
              onClick={onViewProfile}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View Profile
            </button>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">{getCategoryIcon(quiz.category || 'Technology')}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty || 'Beginner')}`}>
              Level {quiz.level || 1} - {quiz.difficulty || 'Beginner'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Quiz Complete!</h1>
          <p className="text-secondary">{quiz.title}</p>
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 text-center">
        {/* Score Display */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-primary/20">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
            {result.score}/{result.totalQuestions}
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl text-secondary mb-2">
            {scorePercentage}% Score
          </div>
          <div className="text-sm sm:text-base text-secondary/70">
            Time: {formatTime(result.timeSpent)}
          </div>
        </div>

        {/* Perfect Score Celebration */}
        {isPerfectScore ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Perfect Score!
            </h3>
            <p className="text-green-700 mb-4">
              Outstanding! You've mastered this topic and earned a <strong>digital achievement badge</strong>! 🏆
            </p>
            
            {isConnected && walletAddress && (
              <div className="bg-white/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-700 mb-1">
                  Connected: {walletName || 'Wallet'}
                </p>
                <p className="text-xs text-green-600 font-mono">
                  {formatAddress(walletAddress)}
                </p>
              </div>
            )}
            
            {isConnected && !mintResult && (
              <button
                onClick={handleMintBadge}
                disabled={isMinting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-semibold py-3 px-8 rounded-lg transition-all disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {isMinting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Minting Badge...
                  </div>
                ) : (
                  "🎖️ Mint Achievement Badge"
                )}
              </button>
            )}

            {!isConnected && (
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-green-700 text-sm mb-2">
                  🔗 Connect your wallet to mint a digital achievement badge!
                </p>
                <p className="text-green-600 text-xs">
                  Your perfect score qualifies you for a verifiable digital achievement
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              Good effort!
            </h3>
            <p className="text-yellow-700 mb-2">
              You need a perfect score to earn the digital achievement badge.
            </p>
            <p className="text-yellow-600 text-sm">
              Review the material and try again to unlock your achievement!
            </p>
          </div>
        )}

        {/* Badge Minting Success */}
        {mintResult && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-3">🎖️</div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              Achievement Badge Minted!
            </h3>
            <p className="text-blue-700 mb-4">
              Your achievement badge has been successfully created and sent to your wallet!
            </p>
            <div className="space-y-3 text-sm">
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-blue-600 font-medium mb-1">
                  Transaction ID:
                </p>
                <p className="font-mono text-xs bg-blue-100 p-2 rounded break-all">
                  {mintResult.transactionId}
                </p>
              </div>
              
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-blue-600 font-medium mb-1">
                  Badge Details:
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Policy ID:</strong> {mintResult.policyId?.slice(0, 20)}...
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Asset Name:</strong> {mintResult.assetName}
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Recipient:</strong> {formatAddress(mintResult.recipientAddress)}
                </p>
              </div>
              
              {mintResult.explorerUrl && (
                <a
                  href={mintResult.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 underline transition-colors font-medium"
                >
                  🔍 View Transaction →
                </a>
              )}
              
              {mintResult.note && (
                <div className="bg-green-100 rounded-lg p-3">
                  <p className="text-xs text-green-700 font-medium">
                    {mintResult.note}
                  </p>
                </div>
              )}
              
              <div className="bg-yellow-100 rounded-lg p-3">
                <p className="text-xs text-yellow-700">
                  💡 <strong>Check your {walletName} wallet!</strong> Your new achievement badge should appear in your assets within a few minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={onRetry}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Retake Quiz
            </button>

            <button
              onClick={onBackToSelection}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Try Another Quiz
            </button>
          </div>

          {!mintResult && (
            <button
              onClick={handleSaveResult}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Save Result
            </button>
          )}
        </div>

        {/* Next Steps */}
        {isPerfectScore && (
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-dark mb-2">🚀 What's Next?</h4>
            <p className="text-sm text-secondary">
              {(quiz.level || 1) < 4 
                ? `Great job! You've unlocked the next level. Continue your learning journey with more advanced topics.`
                : `Congratulations! You've completed the highest level quiz. You're now an expert in this subject!`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
