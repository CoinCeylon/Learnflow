import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Vote on a quiz (upvote or downvote)
export const voteOnQuiz = mutation({
  args: {
    quizId: v.id("quizzes"),
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated to vote");
    }

    // Check if user has already voted on this quiz
    const existingVote = await ctx.db.query("quizVotes")
      .withIndex("by_user_and_quiz", (q) => 
        q.eq("userId", userId).eq("quizId", args.quizId))
      .first();

    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    let upvotes = quiz.upvotes || 0;
    let downvotes = quiz.downvotes || 0;

    if (existingVote) {
      // User is changing their vote or removing it
      if (existingVote.voteType === args.voteType) {
        // Same vote type - remove the vote
        await ctx.db.delete(existingVote._id);
        
        if (args.voteType === "upvote") {
          upvotes = Math.max(0, upvotes - 1);
        } else {
          downvotes = Math.max(0, downvotes - 1);
        }
      } else {
        // Different vote type - update the vote
        await ctx.db.patch(existingVote._id, {
          voteType: args.voteType,
          votedAt: Date.now(),
        });
        
        if (args.voteType === "upvote") {
          upvotes += 1;
          downvotes = Math.max(0, downvotes - 1);
        } else {
          downvotes += 1;
          upvotes = Math.max(0, upvotes - 1);
        }
      }
    } else {
      // New vote
      await ctx.db.insert("quizVotes", {
        userId,
        quizId: args.quizId,
        voteType: args.voteType,
        votedAt: Date.now(),
      });
      
      if (args.voteType === "upvote") {
        upvotes += 1;
      } else {
        downvotes += 1;
      }
    }

    // Update quiz vote counts and score
    const voteScore = upvotes - downvotes;
    await ctx.db.patch(args.quizId, {
      upvotes,
      downvotes,
      voteScore,
    });

    return { upvotes, downvotes, voteScore };
  },
});

// Get user's vote for a specific quiz
export const getUserVote = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const vote = await ctx.db.query("quizVotes")
      .withIndex("by_user_and_quiz", (q) => 
        q.eq("userId", userId).eq("quizId", args.quizId))
      .first();

    return vote ? vote.voteType : null;
  },
});

// Get voting statistics for a quiz
export const getQuizVotingStats = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      return null;
    }

    return {
      upvotes: quiz.upvotes || 0,
      downvotes: quiz.downvotes || 0,
      voteScore: quiz.voteScore || 0,
    };
  },
});

// Initialize voting data for existing quizzes
export const initializeVotingData = mutation({
  args: {},
  handler: async (ctx) => {
    const quizzes = await ctx.db.query("quizzes").collect();
    
    for (const quiz of quizzes) {
      if (quiz.upvotes === undefined || quiz.downvotes === undefined) {
        await ctx.db.patch(quiz._id, {
          upvotes: 0,
          downvotes: 0,
          voteScore: 0,
        });
      }
    }
    
    return "Voting data initialized for all quizzes";
  },
});
