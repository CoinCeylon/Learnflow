import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { QuizData } from "./QuizApp";
import { AIQuizGeneratorModal } from "./AIQuizGeneratorModal";
import { toast } from "sonner";

interface QuizSelectionScreenProps {
  quizzes: QuizData[];
  onSelectQuiz: (quizId: string) => void;
  onBack: () => void;
  onViewProfile: () => void;
}

interface QuizWithVoting extends QuizData {
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore: number | null;
  totalQuestions: number;
  hasNFT: boolean;
  userVote: "upvote" | "downvote" | null;
  upvotes: number;
  downvotes: number;
  voteScore: number;
  unlockRequirement?: string;
}

const QUIZZES_PER_PAGE = 8;

export function QuizSelectionScreen({ onSelectQuiz, onBack, onViewProfile }: QuizSelectionScreenProps) {
  const [showAIModal, setShowAIModal] = useState(false);
  const [sortBy, setSortBy] = useState<"order" | "votes" | "newest" | "difficulty">("order");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const quizzes = useQuery(api.quiz.getAvailableQuizzes, { 
    sortBy,
    searchQuery: searchQuery.trim() || undefined
  }) as QuizWithVoting[] | undefined;
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const voteOnQuiz = useMutation(api.voting.voteOnQuiz);

  const handleVote = async (quizId: string, voteType: "upvote" | "downvote") => {
    if (!loggedInUser) {
      toast.error("Please sign in to vote on quizzes");
      return;
    }

    try {
      await voteOnQuiz({ quizId: quizId as any, voteType });
      toast.success(`${voteType === "upvote" ? "Liked" : "Disliked"} quiz!`);
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Advanced": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Expert": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "technology": return "💻";
      case "science": return "🔬";
      case "mathematics": return "📐";
      case "data science": return "📊";
      case "physics": return "⚛️";
      case "ai generated": return "🤖";
      default: return "📚";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Pagination calculations
  const totalQuizzes = quizzes?.length || 0;
  const totalPages = Math.ceil(totalQuizzes / QUIZZES_PER_PAGE);
  const startIndex = (currentPage - 1) * QUIZZES_PER_PAGE;
  const endIndex = startIndex + QUIZZES_PER_PAGE;
  const currentQuizzes = quizzes?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of quiz grid
    document.getElementById('quiz-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
        }`}
      >
        ← Previous
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            i === currentPage
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
        }`}
      >
        Next →
      </button>
    );

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        {pages}
      </div>
    );
  };

  if (!quizzes) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark mb-1 sm:mb-2">Choose Your Quiz</h1>
            <p className="text-sm sm:text-base text-secondary">Select a quiz to test your knowledge and earn achievements</p>
          </div>
          
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
            <button
              onClick={() => setShowAIModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-xs sm:text-sm min-h-[40px] flex items-center justify-center"
            >
              🤖 Generate AI Quiz
            </button>
            {loggedInUser && (
              <button
                onClick={onViewProfile}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm min-h-[40px] flex items-center justify-center"
              >
                👤 View Profile
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <form onSubmit={handleSearchSubmit} className="relative max-w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search quizzes... (Press Enter to search)"
              className="block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm min-h-[44px]"
            />
            {(searchInput || searchQuery) && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] justify-center"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
          {searchQuery && (
            <p className="text-sm text-secondary mt-2">
              {totalQuizzes} quiz{totalQuizzes !== 1 ? 'es' : ''} found for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm text-secondary font-medium flex items-center">Sort by:</span>
          <button
            onClick={() => handleSortChange("order")}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors min-h-[32px] flex items-center ${
              sortBy === "order" 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Default Order
          </button>
          <button
            onClick={() => handleSortChange("votes")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              sortBy === "votes" 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Most Voted
          </button>
          <button
            onClick={() => handleSortChange("newest")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              sortBy === "newest" 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => handleSortChange("difficulty")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              sortBy === "difficulty" 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            By Difficulty
          </button>
        </div>

        {/* Results Summary */}
        {totalQuizzes > 0 && (
          <div className="flex items-center justify-between text-sm text-secondary mb-4">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, totalQuizzes)} of {totalQuizzes} quizzes
            </span>
            {totalPages > 1 && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quiz Grid */}
      <div id="quiz-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {currentQuizzes.map((quiz) => (
          <div
            key={quiz._id}
            className={`bg-white rounded-lg sm:rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
              quiz.isUnlocked 
                ? "border-gray-200 hover:border-primary/30" 
                : "border-gray-100 opacity-60"
            }`}
          >
            {/* Quiz Header */}
            <div className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 lg:pb-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-lg sm:text-xl lg:text-2xl">{getCategoryIcon(quiz.category)}</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
              </div>

              {/* Quiz Title with Voting */}
              <div className="flex items-start justify-between mb-2 gap-2">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-dark flex-1 line-clamp-2 leading-tight">{quiz.title}</h3>
                
                {/* Voting Buttons */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleVote(quiz._id, "upvote")}
                    disabled={!loggedInUser || !quiz.isUnlocked}
                    className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 rounded-md transition-all min-h-[32px] min-w-[32px] justify-center ${
                      quiz.userVote === "upvote"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600 border border-gray-200"
                    } ${(!loggedInUser || !quiz.isUnlocked) ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
                    title={!loggedInUser ? "Sign in to vote" : !quiz.isUnlocked ? "Complete previous quiz to vote" : "Like this quiz"}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span className="text-xs font-medium">{quiz.upvotes}</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote(quiz._id, "downvote")}
                    disabled={!loggedInUser || !quiz.isUnlocked}
                    className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 rounded-md transition-all min-h-[32px] min-w-[32px] justify-center ${
                      quiz.userVote === "downvote"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                    } ${(!loggedInUser || !quiz.isUnlocked) ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
                    title={!loggedInUser ? "Sign in to vote" : !quiz.isUnlocked ? "Complete previous quiz to vote" : "Dislike this quiz"}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ transform: 'rotate(180deg)' }}>
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span className="text-xs font-medium">{quiz.downvotes}</span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-secondary mb-4 line-clamp-3">{quiz.description}</p>

              {/* Quiz Stats */}
              <div className="flex items-center justify-between text-xs text-secondary mb-4">
                <span>{quiz.totalQuestions} questions</span>
                <span>Level {quiz.level}</span>
                <span className="flex items-center gap-1">
                  <span className={quiz.voteScore >= 0 ? "text-green-600" : "text-red-600"}>
                    {quiz.voteScore >= 0 ? "+" : ""}{quiz.voteScore}
                  </span>
                  <span className="text-gray-400">score</span>
                </span>
              </div>

              {/* Progress Indicators */}
              <div className="flex items-center gap-2 mb-4">
                {quiz.isCompleted && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    ✓ Completed
                  </span>
                )}
                {quiz.hasNFT && (
                  <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    🏆 NFT Earned
                  </span>
                )}
                {quiz.bestScore !== null && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Best: {quiz.bestScore}/{quiz.totalQuestions}
                  </span>
                )}
              </div>
            </div>

            {/* Quiz Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => quiz.isUnlocked && onSelectQuiz(quiz._id)}
                disabled={!quiz.isUnlocked}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  quiz.isUnlocked
                    ? "bg-primary hover:bg-primary/90 text-white transform hover:scale-105 shadow-md hover:shadow-lg"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {quiz.isUnlocked ? "Start Quiz" : "🔒 Locked"}
              </button>
              
              {!quiz.isUnlocked && quiz.unlockRequirement && (
                <p className="text-xs text-secondary text-center mt-2">
                  Complete the previous quiz with a perfect score to unlock
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Empty State */}
      {totalQuizzes === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-dark mb-2">
            {searchQuery ? "No Quizzes Found" : "No Quizzes Available"}
          </h3>
          <p className="text-secondary mb-6">
            {searchQuery 
              ? `No quizzes match your search for "${searchQuery}". Try a different search term.`
              : "Create your first AI-generated quiz to get started!"
            }
          </p>
          {searchQuery ? (
            <button
              onClick={clearSearch}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors mr-4"
            >
              Clear Search
            </button>
          ) : null}
          <button
            onClick={() => setShowAIModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🤖 Generate AI Quiz
          </button>
        </div>
      )}

      {/* AI Quiz Generator Modal */}
      <AIQuizGeneratorModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onQuizGenerated={(quizId) => {
          setShowAIModal(false);
          onSelectQuiz(quizId);
        }}
      />
    </div>
  );
}
