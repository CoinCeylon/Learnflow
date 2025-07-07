import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface LandingScreenProps {
  onStartQuiz: () => void;
  onViewProfile: () => void;
  onViewLeaderboard: () => void;
  onSignIn: () => void;
}

export function LandingScreen({ onStartQuiz, onViewProfile, onViewLeaderboard, onSignIn }: LandingScreenProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Hero Section */}
      <section className="text-center py-6 sm:py-12 lg:py-16 xl:py-20">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-primary to-secondary rounded-xl sm:rounded-2xl lg:rounded-3xl mb-4 sm:mb-6 lg:mb-8">
            <img 
              src="https://imghost.net/ib/sxl1RdarvDfWycC_1751921188.png" 
              alt="LearnFlow Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 object-contain"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) nextElement.style.display = 'inline';
              }}
            />
            <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl hidden">🎓</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-dark mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Master Any Subject with
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block sm:inline sm:ml-2 lg:ml-3">
              Interactive Learning
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary mb-4 sm:mb-6 lg:mb-8 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
            Learn any topic through interactive quizzes and AI-powered content. 
            Earn achievement badges, track your progress, and compete with learners worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-4 max-w-lg sm:max-w-none mx-auto">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all transform hover:scale-105 shadow-xl text-sm sm:text-base lg:text-lg min-h-[48px] sm:min-h-[52px] flex items-center justify-center"
            >
              🚀 Start Learning
            </button>
            
            <button
              onClick={onViewLeaderboard}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base lg:text-lg min-h-[48px] sm:min-h-[52px] flex items-center justify-center"
            >
              🏆 View Leaderboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-6 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-dark mb-6 sm:mb-8 lg:mb-12">
            Why Choose LearnFlow?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Interactive Learning */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl lg:rounded-2xl mb-3 sm:mb-4 lg:mb-6">
                <span className="text-lg sm:text-2xl lg:text-3xl">🧠</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark mb-2 sm:mb-3 lg:mb-4">Interactive Quizzes</h3>
              <p className="text-secondary leading-relaxed text-xs sm:text-sm lg:text-base">
                Engage with dynamic quizzes across multiple subjects. Get instant feedback and detailed explanations for every answer.
              </p>
            </div>

            {/* AI-Powered Content */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg sm:rounded-xl lg:rounded-2xl mb-3 sm:mb-4 lg:mb-6">
                <span className="text-lg sm:text-2xl lg:text-3xl">🤖</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark mb-2 sm:mb-3 lg:mb-4">AI-Generated Content</h3>
              <p className="text-secondary leading-relaxed text-xs sm:text-sm lg:text-base">
                Create custom quizzes on any topic using our advanced AI. Personalized learning experiences tailored to your interests.
              </p>
            </div>

            {/* Achievement System */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🏆</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-dark mb-3 sm:mb-4">Achievement Badges</h3>
              <p className="text-secondary leading-relaxed text-sm sm:text-base">
                Earn digital badges for perfect scores and milestones. Track your learning journey and showcase your expertise.
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">📊</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-dark mb-3 sm:mb-4">Progress Tracking</h3>
              <p className="text-secondary leading-relaxed text-sm sm:text-base">
                Monitor your learning progress with detailed analytics. See your strengths and areas for improvement.
              </p>
            </div>

            {/* Global Competition */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🌍</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-dark mb-3 sm:mb-4">Global Leaderboard</h3>
              <p className="text-secondary leading-relaxed text-sm sm:text-base">
                Compete with learners worldwide. Climb the leaderboard and see how you rank against other students.
              </p>
            </div>

            {/* Diverse Subjects */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">📚</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-dark mb-3 sm:mb-4">Diverse Subjects</h3>
              <p className="text-secondary leading-relaxed text-sm sm:text-base">
                From technology and science to arts and humanities. Explore a wide range of topics and expand your knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-8 sm:mb-12">
            Join Our Learning Community
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm sm:text-base text-secondary">Active Learners</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-2">50+</div>
              <div className="text-sm sm:text-base text-secondary">Subject Areas</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-sm sm:text-base text-secondary">Quizzes Completed</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-sm sm:text-base text-secondary">Badges Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of learners who are already expanding their knowledge and earning achievements.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {loggedInUser ? (
                <>
                  <button
                    onClick={onStartQuiz}
                    className="w-full sm:w-auto bg-white hover:bg-gray-100 text-primary font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg text-base sm:text-lg"
                  >
                    Continue Learning
                  </button>
                  <button
                    onClick={onViewProfile}
                    className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all transform hover:scale-105 text-base sm:text-lg"
                  >
                    View Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onSignIn}
                    className="w-full sm:w-auto bg-white hover:bg-gray-100 text-primary font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg text-base sm:text-lg"
                  >
                    Sign Up Free
                  </button>
                  <button
                    onClick={onStartQuiz}
                    className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all transform hover:scale-105 text-base sm:text-lg"
                  >
                    Try Demo Quiz
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
