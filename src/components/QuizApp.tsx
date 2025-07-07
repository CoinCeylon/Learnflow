import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LandingScreen } from "./LandingScreen";
import { QuizSelectionScreen } from "./QuizSelectionScreen";
import { QuizScreen } from "./QuizScreen";
import { ResultsScreen } from "./ResultsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { LeaderboardScreen } from "./LeaderboardScreen";
import { SignInModal } from "./SignInModal";
import { SignOutButton } from "../SignOutButton";


export interface QuizData {
  _id: string;
  title: string;
  description: string;
  level: number;
  difficulty: string;
  category: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent?: number;
  isPerfectScore: boolean;
}

type Screen = 'landing' | 'selection' | 'quiz' | 'results' | 'profile' | 'leaderboard';

export function QuizApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const availableQuizzes = useQuery(api.quiz.getAvailableQuizzes, { sortBy: "order" });
  const initializeVoting = useMutation(api.voting.initializeVotingData);

  // Initialize voting data on first load
  useEffect(() => {
    const initVoting = async () => {
      try {
        await initializeVoting({});
      } catch (error) {
        console.log("Voting data already initialized or error:", error);
      }
    };
    initVoting();
  }, [initializeVoting]);

  const handleStartQuiz = () => {
    setCurrentScreen('selection');
  };

  const handleSelectQuiz = (quizId: string) => {
    const quiz = availableQuizzes?.find(q => q._id === quizId);
    if (quiz) {
      setSelectedQuiz(quiz);
      setCurrentScreen('quiz');
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentScreen('results');
  };

  const handleBackToSelection = () => {
    setSelectedQuiz(null);
    setQuizResult(null);
    setCurrentScreen('selection');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleViewProfile = () => {
    if (!loggedInUser) {
      setShowSignInModal(true);
      return;
    }
    setCurrentScreen('profile');
  };

  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const renderNavigation = () => {
    if (currentScreen === 'landing') return null;

    return (
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo/Brand */}
            <button
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors min-w-0"
            >
              <img 
                src="https://imghost.net/ib/sxl1RdarvDfWycC_1751921188.png" 
                alt="LearnFlow Logo" 
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) nextElement.style.display = 'inline';
                }}
              />
              <span className="text-xl sm:text-2xl hidden">🎓</span>
              <span className="text-lg sm:text-xl font-bold truncate">LearnFlow</span>
            </button>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <button
                onClick={() => setCurrentScreen('selection')}
                className={`text-sm lg:text-base font-medium transition-colors ${
                  currentScreen === 'selection' 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Quizzes
              </button>
              <button
                onClick={handleViewLeaderboard}
                className={`text-sm lg:text-base font-medium transition-colors ${
                  currentScreen === 'leaderboard' 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Leaderboard
              </button>
              {loggedInUser && (
                <button
                  onClick={handleViewProfile}
                  className={`text-sm lg:text-base font-medium transition-colors ${
                    currentScreen === 'profile' 
                      ? 'text-primary border-b-2 border-primary pb-1' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Profile
                </button>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0">
              {loggedInUser ? (
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 hidden lg:block truncate max-w-32">
                    Welcome, {loggedInUser.name || 'Learner'}
                  </span>
                  <SignOutButton />
                </div>
              ) : (
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base min-h-[40px] flex items-center justify-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
          <div className="flex justify-around py-2 px-2">
            <button
              onClick={() => setCurrentScreen('selection')}
              className={`flex flex-col items-center py-2 px-2 text-xs min-h-[60px] rounded-lg transition-colors ${
                currentScreen === 'selection' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <span className="text-base sm:text-lg mb-1">📚</span>
              <span className="font-medium">Quizzes</span>
            </button>
            <button
              onClick={handleViewLeaderboard}
              className={`flex flex-col items-center py-2 px-2 text-xs min-h-[60px] rounded-lg transition-colors ${
                currentScreen === 'leaderboard' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <span className="text-base sm:text-lg mb-1">🏆</span>
              <span className="font-medium">Leaderboard</span>
            </button>
            {loggedInUser && (
              <button
                onClick={handleViewProfile}
                className={`flex flex-col items-center py-2 px-2 text-xs min-h-[60px] rounded-lg transition-colors ${
                  currentScreen === 'profile' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                }`}
              >
                <span className="text-base sm:text-lg mb-1">👤</span>
                <span className="font-medium">Profile</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    );
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return (
          <LandingScreen 
            onStartQuiz={handleStartQuiz}
            onViewProfile={handleViewProfile}
            onViewLeaderboard={handleViewLeaderboard}
            onSignIn={() => setShowSignInModal(true)}
          />
        );
      case 'selection':
        return (
          <QuizSelectionScreen 
            quizzes={availableQuizzes || []}
            onSelectQuiz={handleSelectQuiz}
            onBack={handleBackToLanding}
            onViewProfile={handleViewProfile}
          />
        );
      case 'quiz':
        return selectedQuiz ? (
          <QuizScreen 
            quiz={selectedQuiz}
            onFinish={handleQuizComplete}
            onBack={handleBackToSelection}
          />
        ) : null;
      case 'results':
        return quizResult && selectedQuiz ? (
          <ResultsScreen 
            result={quizResult}
            quiz={selectedQuiz}
            onRetry={() => setCurrentScreen('quiz')}
            onBackToSelection={handleBackToSelection}
            onViewProfile={handleViewProfile}
          />
        ) : null;
      case 'profile':
        return (
          <ProfileScreen 
            onBack={handleBackToSelection}
            onSelectQuiz={handleSelectQuiz}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardScreen 
            onBack={handleBackToSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {renderNavigation()}
      
      <main className="flex-1">
        {renderCurrentScreen()}
      </main>
      
      <SignInModal 
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </div>
  );
}
