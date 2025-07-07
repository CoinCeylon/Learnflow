import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  quizzes: defineTable({
    title: v.string(),
    description: v.string(),
    level: v.number(),
    difficulty: v.union(v.literal("Beginner"), v.literal("Intermediate"), v.literal("Advanced"), v.literal("Expert")),
    category: v.string(),
    order: v.number(),
    isActive: v.boolean(),
    unlockRequirement: v.optional(v.id("quizzes")),
    questions: v.array(v.object({
      question: v.string(),
      options: v.array(v.string()),
      correctAnswer: v.number(),
      explanation: v.string(),
    })),
    // AI-generated quiz fields
    isAIGenerated: v.optional(v.boolean()),
    generatedAt: v.optional(v.number()),
    topic: v.optional(v.string()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.optional(v.number()),
    // Voting fields
    upvotes: v.optional(v.number()),
    downvotes: v.optional(v.number()),
    voteScore: v.optional(v.number()), // upvotes - downvotes for easy sorting
  })
    .index("by_order", ["order"])
    .index("by_level", ["level"])
    .index("by_difficulty", ["difficulty"])
    .index("by_category", ["category"])
    .index("by_vote_score", ["voteScore"]),

  quizVotes: defineTable({
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
    votedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_quiz", ["quizId"])
    .index("by_user_and_quiz", ["userId", "quizId"]),

  quizResults: defineTable({
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    score: v.number(),
    totalQuestions: v.number(),
    completedAt: v.number(),
    walletAddress: v.optional(v.string()),
    nftTransactionId: v.optional(v.string()),
    timeSpent: v.optional(v.number()),
    isPerfectScore: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_quiz", ["quizId"])
    .index("by_user_and_quiz", ["userId", "quizId"])
    .index("by_completion_date", ["completedAt"]),

  userProgress: defineTable({
    userId: v.id("users"),
    currentLevel: v.number(),
    totalQuizzesCompleted: v.number(),
    totalPerfectScores: v.number(),
    totalNFTsEarned: v.number(),
    lastActiveAt: v.number(),
    achievements: v.array(v.string()),
    streakCount: v.number(),
    lastStreakDate: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_level", ["currentLevel"])
    .index("by_total_score", ["totalPerfectScores"])
    .index("by_last_active", ["lastActiveAt"]),

  nftBadges: defineTable({
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    transactionId: v.string(),
    policyId: v.string(),
    assetName: v.string(),
    mintedAt: v.number(),
    walletAddress: v.string(),
    metadata: v.object({
      name: v.string(),
      description: v.string(),
      image: v.string(),
      mediaType: v.optional(v.string()),
      attributes: v.any(),
    }),
  })
    .index("by_user", ["userId"])
    .index("by_quiz", ["quizId"])
    .index("by_transaction", ["transactionId"])
    .index("by_minted_date", ["mintedAt"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
