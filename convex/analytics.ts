"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateProgressAnalytics = action({
  args: {
    userProgress: v.any(),
    quizResults: v.array(v.any()),
    nftBadges: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }

    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Prepare data for analysis
      const progressData = {
        currentLevel: args.userProgress?.currentLevel || 1,
        totalQuizzesCompleted: args.userProgress?.totalQuizzesCompleted || 0,
        totalPerfectScores: args.userProgress?.totalPerfectScores || 0,
        totalNFTsEarned: args.userProgress?.totalNFTsEarned || 0,
        streakCount: args.userProgress?.streakCount || 0,
        recentResults: args.quizResults.slice(-5),
        averageScore: args.quizResults.length > 0 ? 
          args.quizResults.reduce((sum: number, r: any) => sum + (r.score / r.totalQuestions), 0) / args.quizResults.length : 0,
        strongestCategories: getStrongestCategories(args.quizResults),
        weakestAreas: getWeakestAreas(args.quizResults),
        learningTrends: getLearningTrends(args.quizResults),
      };

      const prompt = `Analyze this student's learning progress and provide personalized insights:

Student Progress Data:
- Current Level: ${progressData.currentLevel}
- Total Quizzes Completed: ${progressData.totalQuizzesCompleted}
- Perfect Scores: ${progressData.totalPerfectScores}
- NFT Badges Earned: ${progressData.totalNFTsEarned}
- Current Streak: ${progressData.streakCount} days
- Average Score: ${Math.round(progressData.averageScore * 100)}%
- Strongest Categories: ${progressData.strongestCategories.join(', ')}
- Areas for Improvement: ${progressData.weakestAreas.join(', ')}

Recent Quiz Performance:
${progressData.recentResults.map((r: any, i: number) => 
  `${i + 1}. Score: ${r.score}/${r.totalQuestions} (${Math.round((r.score/r.totalQuestions)*100)}%)`
).join('\n')}

Please provide a JSON response with the following structure:
{
  "overallAssessment": "Brief overall assessment of the student's progress",
  "strengths": ["List of 2-3 key strengths"],
  "areasForImprovement": ["List of 2-3 areas to focus on"],
  "recommendations": ["List of 3-4 specific actionable recommendations"],
  "motivationalMessage": "Encouraging message based on their progress",
  "nextSteps": ["List of 2-3 suggested next steps"],
  "learningStyle": "Assessment of their learning pattern",
  "progressRating": "A rating from 1-10 of their overall progress"
}

Focus on:
- Blockchain and Web3 learning context
- Encouraging continued learning
- Specific actionable advice
- Recognition of achievements
- Areas where they can improve`;

      console.log("Generating analytics with Gemini API...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Raw Gemini analytics response:", text);

      // Parse the JSON response
      let analyticsData;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in response");
        }
        analyticsData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        // Fallback analytics
        analyticsData = generateFallbackAnalytics(progressData);
      }

      return {
        ...analyticsData,
        generatedAt: Date.now(),
        dataSnapshot: progressData
      };

    } catch (error) {
      console.error("Error generating analytics:", error);
      // Return fallback analytics
      return generateFallbackAnalytics({
        currentLevel: args.userProgress?.currentLevel || 1,
        totalQuizzesCompleted: args.userProgress?.totalQuizzesCompleted || 0,
        totalPerfectScores: args.userProgress?.totalPerfectScores || 0,
        averageScore: args.quizResults.length > 0 ? 
          args.quizResults.reduce((sum: number, r: any) => sum + (r.score / r.totalQuestions), 0) / args.quizResults.length : 0,
      });
    }
  },
});

function getStrongestCategories(results: any[]): string[] {
  const categoryScores: { [key: string]: { total: number, count: number } } = {};
  
  results.forEach(result => {
    // This would need quiz data to get category, for now use placeholder
    const category = "Blockchain"; // Placeholder
    if (!categoryScores[category]) {
      categoryScores[category] = { total: 0, count: 0 };
    }
    categoryScores[category].total += result.score / result.totalQuestions;
    categoryScores[category].count += 1;
  });

  return Object.entries(categoryScores)
    .map(([category, data]) => ({ category, average: data.total / data.count }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 3)
    .map(item => item.category);
}

function getWeakestAreas(results: any[]): string[] {
  // Simplified implementation - in real app would analyze question types
  if (results.length === 0) return ["Complete more quizzes for analysis"];
  
  const recentLowScores = results
    .slice(-5)
    .filter(r => (r.score / r.totalQuestions) < 0.8);
    
  if (recentLowScores.length > 0) {
    return ["Review fundamental concepts", "Practice more challenging questions"];
  }
  
  return ["Continue challenging yourself with advanced topics"];
}

function getLearningTrends(results: any[]): string {
  if (results.length < 2) return "Not enough data";
  
  const recent = results.slice(-3);
  const older = results.slice(-6, -3);
  
  if (recent.length === 0 || older.length === 0) return "Building learning history";
  
  const recentAvg = recent.reduce((sum, r) => sum + (r.score / r.totalQuestions), 0) / recent.length;
  const olderAvg = older.reduce((sum, r) => sum + (r.score / r.totalQuestions), 0) / older.length;
  
  if (recentAvg > olderAvg + 0.1) return "Improving";
  if (recentAvg < olderAvg - 0.1) return "Declining";
  return "Stable";
}

function generateFallbackAnalytics(data: any) {
  const { currentLevel, totalQuizzesCompleted, totalPerfectScores, averageScore } = data;
  
  return {
    overallAssessment: `You're at Level ${currentLevel} with ${totalQuizzesCompleted} quizzes completed. ${
      averageScore > 0.8 ? "Excellent progress!" : "Good foundation, keep practicing!"
    }`,
    strengths: [
      totalPerfectScores > 0 ? "Achieving perfect scores" : "Consistent learning",
      currentLevel > 1 ? "Progressing through levels" : "Building fundamentals",
      "Commitment to blockchain education"
    ],
    areasForImprovement: [
      averageScore < 0.8 ? "Focus on accuracy" : "Challenge yourself with harder topics",
      "Maintain consistent study habits",
      "Explore practical applications"
    ],
    recommendations: [
      "Review incorrect answers to learn from mistakes",
      "Take time to understand explanations",
      "Practice regularly to maintain momentum",
      "Connect concepts to real-world blockchain applications"
    ],
    motivationalMessage: totalPerfectScores > 0 
      ? "🎉 Great job earning perfect scores! You're mastering blockchain concepts."
      : "🚀 Keep up the great work! Every quiz brings you closer to blockchain mastery.",
    nextSteps: [
      currentLevel < 4 ? "Complete current level to unlock advanced topics" : "Explore specialized blockchain areas",
      "Earn more NFT badges with perfect scores",
      "Share your knowledge with the community"
    ],
    learningStyle: totalQuizzesCompleted > 5 ? "Consistent learner" : "Getting started",
    progressRating: Math.min(10, Math.max(1, Math.round(currentLevel * 2 + (averageScore * 4)))),
    generatedAt: Date.now()
  };
}
