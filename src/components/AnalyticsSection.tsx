import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AnalyticsSectionProps {
  userProgress: any;
  quizResults: any[];
  nftBadges: any[];
}

export function AnalyticsSection({ userProgress, quizResults, nftBadges }: AnalyticsSectionProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const generateAnalytics = useAction(api.analytics.generateProgressAnalytics);

  const handleGenerateAnalytics = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAnalytics({
        userProgress,
        quizResults,
        nftBadges,
      });
      setAnalytics(result);
      toast.success("AI analytics generated!");
    } catch (error) {
      console.error("Error generating analytics:", error);
      toast.error("Failed to generate analytics");
    } finally {
      setIsGenerating(false);
    }
  };

  const getProgressColor = (rating: number) => {
    if (rating >= 8) return "text-green-600 bg-green-100";
    if (rating >= 6) return "text-yellow-600 bg-yellow-100";
    if (rating >= 4) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="text-2xl flex-shrink-0">🤖</div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">AI Learning Analytics</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Get personalized insights about your learning progress
            </p>
          </div>
        </div>
        
        <button
          onClick={handleGenerateAnalytics}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-400 disabled:to-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:cursor-not-allowed text-sm sm:text-base flex-shrink-0"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              <span className="hidden sm:inline">Analyzing...</span>
              <span className="sm:hidden">...</span>
            </div>
          ) : (
            <>
              <span className="hidden sm:inline">Generate Insights</span>
              <span className="sm:hidden">Generate</span>
            </>
          )}
        </button>
      </div>

      {analytics ? (
        <div className="space-y-6">
          {/* Overall Assessment */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 min-w-0">Overall Assessment</h3>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${getProgressColor(analytics.progressRating)}`}>
                {analytics.progressRating}/10
              </span>
            </div>
            <p className="text-blue-800 text-sm sm:text-base">{analytics.overallAssessment}</p>
          </div>

          {/* Strengths and Areas for Improvement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-3 flex items-center">
                <span className="text-lg sm:text-xl mr-2">💪</span>
                Your Strengths
              </h3>
              <ul className="space-y-2">
                {analytics.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-green-800 flex items-start text-sm sm:text-base">
                    <span className="text-green-600 mr-2 flex-shrink-0">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-orange-900 mb-3 flex items-center">
                <span className="text-lg sm:text-xl mr-2">🎯</span>
                Areas to Focus On
              </h3>
              <ul className="space-y-2">
                {analytics.areasForImprovement.map((area: string, index: number) => (
                  <li key={index} className="text-orange-800 flex items-start text-sm sm:text-base">
                    <span className="text-orange-600 mr-2 flex-shrink-0">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-3 flex items-center">
              <span className="text-lg sm:text-xl mr-2">💡</span>
              Personalized Recommendations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analytics.recommendations.map((rec: string, index: number) => (
                <div key={index} className="bg-white rounded-lg p-2 sm:p-3 border border-purple-100">
                  <p className="text-purple-800 text-xs sm:text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-emerald-900 mb-3 flex items-center">
              <span className="text-lg sm:text-xl mr-2">🚀</span>
              Next Steps
            </h3>
            <ul className="space-y-2">
              {analytics.nextSteps.map((step: string, index: number) => (
                <li key={index} className="text-emerald-800 flex items-start text-sm sm:text-base">
                  <span className="text-emerald-600 mr-2 font-bold flex-shrink-0">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-2">🌟</div>
            <p className="text-pink-800 font-medium text-sm sm:text-base">{analytics.motivationalMessage}</p>
          </div>

          {/* Learning Style & Metadata */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="break-words">
                <span className="font-medium text-gray-700">Learning Style:</span>
                <span className="ml-1 sm:ml-2 text-gray-600">{analytics.learningStyle}</span>
              </div>
              <div className="break-words">
                <span className="font-medium text-gray-700">Analysis Generated:</span>
                <span className="ml-1 sm:ml-2 text-gray-600">
                  {new Date(analytics.generatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Discover Your Learning Insights
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-2">
            Get AI-powered analysis of your progress, strengths, and personalized recommendations
          </p>
          <p className="text-xs sm:text-sm text-gray-500 px-2">
            Click "Generate Insights" to analyze your learning journey
          </p>
        </div>
      )}
    </div>
  );
}
