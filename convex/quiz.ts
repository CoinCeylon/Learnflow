import { query, mutation, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Initialize all quizzes
export const initializeQuizzes = mutation({
  args: {},
  handler: async (ctx) => {
    const existingQuizzes = await ctx.db.query("quizzes").collect();
    if (existingQuizzes.length > 0) {
      return "Quizzes already initialized";
    }

    const quizzes = [
      // Level 1 - Beginner
      {
        title: "Technology Fundamentals",
        description: "Learn the basic concepts of modern technology and computing",
        level: 1,
        difficulty: "Beginner" as const,
        category: "Technology",
        order: 1,
        isActive: true,
        upvotes: 0,
        downvotes: 0,
        voteScore: 0,
        questions: [
          {
            question: "What does CPU stand for?",
            options: [
              "Computer Processing Unit",
              "Central Processing Unit",
              "Central Program Unit",
              "Computer Program Unit"
            ],
            correctAnswer: 1,
            explanation: "CPU stands for Central Processing Unit, which is the main component of a computer that performs calculations and executes instructions."
          },
          {
            question: "What is the primary function of RAM in a computer?",
            options: [
              "Permanent storage",
              "Temporary storage for active programs",
              "Internet connectivity",
              "Display graphics"
            ],
            correctAnswer: 1,
            explanation: "RAM (Random Access Memory) provides temporary storage for programs and data that are currently being used by the computer."
          },
          {
            question: "What does 'www' stand for in web addresses?",
            options: [
              "World Wide Web",
              "World Web Wide",
              "Web World Wide",
              "Wide World Web"
            ],
            correctAnswer: 0,
            explanation: "WWW stands for World Wide Web, which is the system of interlinked hypertext documents accessed via the Internet."
          }
        ]
      },
      {
        title: "Science Basics",
        description: "Explore fundamental concepts in physics, chemistry, and biology",
        level: 1,
        difficulty: "Beginner" as const,
        category: "Science",
        order: 2,
        isActive: true,
        upvotes: 0,
        downvotes: 0,
        voteScore: 0,
        questions: [
          {
            question: "What is the chemical symbol for water?",
            options: [
              "H2O",
              "HO2",
              "H3O",
              "HO"
            ],
            correctAnswer: 0,
            explanation: "Water's chemical formula is H2O, meaning it consists of two hydrogen atoms and one oxygen atom."
          },
          {
            question: "What force keeps planets in orbit around the sun?",
            options: [
              "Magnetism",
              "Gravity",
              "Friction",
              "Electricity"
            ],
            correctAnswer: 1,
            explanation: "Gravity is the force that attracts objects with mass toward each other, keeping planets in orbit around the sun."
          },
          {
            question: "What is the basic unit of life?",
            options: [
              "Atom",
              "Molecule",
              "Cell",
              "Tissue"
            ],
            correctAnswer: 2,
            explanation: "The cell is the basic structural and functional unit of all living organisms."
          }
        ]
      },
      // Level 2 - Intermediate
      {
        title: "Programming Concepts",
        description: "Understanding software development and programming principles",
        level: 2,
        difficulty: "Intermediate" as const,
        category: "Technology",
        order: 3,
        isActive: true,
        upvotes: 0,
        downvotes: 0,
        voteScore: 0,
        questions: [
          {
            question: "What is a variable in programming?",
            options: [
              "A fixed value",
              "A container for storing data",
              "A type of loop",
              "A programming language"
            ],
            correctAnswer: 1,
            explanation: "A variable is a container or storage location with an associated name that holds data which can be modified during program execution."
          },
          {
            question: "What does 'debugging' mean in programming?",
            options: [
              "Writing new code",
              "Finding and fixing errors in code",
              "Deleting old code",
              "Running a program"
            ],
            correctAnswer: 1,
            explanation: "Debugging is the process of finding and fixing errors (bugs) in computer programs to ensure they work correctly."
          },
          {
            question: "What is an algorithm?",
            options: [
              "A programming language",
              "A step-by-step procedure to solve a problem",
              "A type of computer",
              "A software application"
            ],
            correctAnswer: 1,
            explanation: "An algorithm is a step-by-step procedure or set of rules designed to solve a specific problem or perform a task."
          },
          {
            question: "What is the purpose of a loop in programming?",
            options: [
              "To store data",
              "To repeat a block of code",
              "To create variables",
              "To end a program"
            ],
            correctAnswer: 1,
            explanation: "A loop is used to repeat a block of code multiple times, making programs more efficient and reducing code duplication."
          }
        ]
      },
      {
        title: "Mathematics Fundamentals",
        description: "Essential mathematical concepts and problem-solving",
        level: 2,
        difficulty: "Intermediate" as const,
        category: "Mathematics",
        order: 4,
        isActive: true,
        upvotes: 0,
        downvotes: 0,
        voteScore: 0,
        questions: [
          {
            question: "What is the value of π (pi) approximately?",
            options: [
              "3.14159",
              "2.71828",
              "1.41421",
              "1.61803"
            ],
            correctAnswer: 0,
            explanation: "Pi (π) is approximately 3.14159, representing the ratio of a circle's circumference to its diameter."
          },
          {
            question: "What is the Pythagorean theorem?",
            options: [
              "a + b = c",
              "a² + b² = c²",
              "a × b = c",
              "a ÷ b = c"
            ],
            correctAnswer: 1,
            explanation: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²."
          },
          {
            question: "What is a prime number?",
            options: [
              "A number divisible by many factors",
              "A number greater than 10",
              "A number divisible only by 1 and itself",
              "An even number"
            ],
            correctAnswer: 2,
            explanation: "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself."
          }
        ]
      },
      // Level 3 - Advanced
      {
        title: "Data Science & Analytics",
        description: "Advanced concepts in data analysis and machine learning",
        level: 3,
        difficulty: "Advanced" as const,
        category: "Data Science",
        order: 5,
        isActive: true,
        upvotes: 0,
        downvotes: 0,
        voteScore: 0,
        questions: [
          {
            question: "What is machine learning?",
            options: [
              "Programming robots",
              "A subset of AI that learns from data",
              "Computer hardware",
              "A programming language"
            ],
            correctAnswer: 1,
            explanation: "Machine learning is a subset of artificial intelligence that enables computers to learn and improve from data without being explicitly programmed."
          },
          {
            question: "What is the purpose of data visualization?",
            options: [
              "To store data",
              "To make data easier to understand",
              "To delete unnecessary data",
              "To encrypt data"
            ],
            correctAnswer: 1,
            explanation: "Data visualization helps present data in graphical formats to make complex information easier to understand and analyze."
          },
          {
            question: "What is a neural network?",
            options: [
              "A computer network",
              "A computing system inspired by biological neural networks",
              "A type of database",
              "A programming framework"
            ],
            correctAnswer: 1,
            explanation: "A neural network is a computing system inspired by biological neural networks, used in machine learning to recognize patterns and make decisions."
          },
          {
            question: "What does 'big data' refer to?",
            options: [
              "Large file sizes",
              "Datasets too large for traditional processing",
              "Important data",
              "Expensive data storage"
            ],
            correctAnswer: 1,
            explanation: "Big data refers to datasets that are too large, complex, or fast-changing for traditional data processing methods to handle effectively."
          },
          {
            question: "What is statistical correlation?",
            options: [
              "Causation between variables",
              "A measure of linear relationship between variables",
              "Data storage method",
              "A type of graph"
            ],
            correctAnswer: 1,
            explanation: "Statistical correlation measures the strength and direction of a linear relationship between two variables, ranging from -1 to +1."
          }
        ]
      },
      // Level 4 - Expert
      {
        title: "Advanced Physics & Engineering",
        description: "Complex concepts in physics, engineering, and applied sciences",
        level: 4,
        difficulty: "Expert" as const,
        category: "Physics",
        order: 6,
        isActive: true,
        upvotes: 0,
        downvotes: 0,
        voteScore: 0,
        questions: [
          {
            question: "What is quantum entanglement?",
            options: [
              "A type of chemical bond",
              "A phenomenon where particles remain connected",
              "A mathematical equation",
              "A type of energy"
            ],
            correctAnswer: 1,
            explanation: "Quantum entanglement is a phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently."
          },
          {
            question: "What is the theory of relativity primarily about?",
            options: [
              "Chemical reactions",
              "Space, time, and gravity",
              "Biological evolution",
              "Computer algorithms"
            ],
            correctAnswer: 1,
            explanation: "Einstein's theory of relativity describes the relationship between space, time, and gravity, fundamentally changing our understanding of the universe."
          },
          {
            question: "What is thermodynamics?",
            options: [
              "Study of motion",
              "Study of heat and energy transfer",
              "Study of light",
              "Study of sound"
            ],
            correctAnswer: 1,
            explanation: "Thermodynamics is the branch of physics that deals with heat, work, temperature, and energy transfer in physical systems."
          },
          {
            question: "What is electromagnetic radiation?",
            options: [
              "Nuclear decay",
              "Waves of electric and magnetic fields",
              "Chemical reactions",
              "Gravitational waves"
            ],
            correctAnswer: 1,
            explanation: "Electromagnetic radiation consists of waves of electric and magnetic fields traveling through space, including light, radio waves, and X-rays."
          },
          {
            question: "What is the uncertainty principle?",
            options: [
              "A mathematical theorem",
              "A fundamental limit on measurement precision",
              "A type of probability",
              "A computer algorithm"
            ],
            correctAnswer: 1,
            explanation: "Heisenberg's uncertainty principle states that there's a fundamental limit to how precisely we can simultaneously know certain pairs of properties of a particle."
          },
          {
            question: "What is superconductivity?",
            options: [
              "Very fast computing",
              "Zero electrical resistance in materials",
              "High-speed internet",
              "Advanced programming"
            ],
            correctAnswer: 1,
            explanation: "Superconductivity is a phenomenon where certain materials exhibit zero electrical resistance and expel magnetic fields when cooled below a critical temperature."
          }
        ]
      }
    ];

    // Insert quizzes and set unlock requirements
    const insertedQuizzes = [];
    for (const quiz of quizzes) {
      const quizId = await ctx.db.insert("quizzes", quiz);
      insertedQuizzes.push({ id: quizId, ...quiz });
    }

    // Set unlock requirements (each quiz unlocks the next)
    for (let i = 1; i < insertedQuizzes.length; i++) {
      await ctx.db.patch(insertedQuizzes[i].id, {
        unlockRequirement: insertedQuizzes[i - 1].id
      });
    }

    return "Quizzes initialized successfully";
  },
});

// Get all available quizzes with unlock status and voting data
export const getAvailableQuizzes = query({
  args: {
    sortBy: v.optional(v.union(v.literal("order"), v.literal("votes"), v.literal("newest"), v.literal("difficulty"))),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const sortBy = args.sortBy || "order";
    const searchQuery = args.searchQuery?.toLowerCase().trim();
    
    let quizzes;
    if (sortBy === "votes") {
      quizzes = await ctx.db.query("quizzes")
        .withIndex("by_vote_score")
        .filter((q) => q.eq(q.field("isActive"), true))
        .order("desc")
        .collect();
    } else if (sortBy === "newest") {
      quizzes = await ctx.db.query("quizzes")
        .filter((q) => q.eq(q.field("isActive"), true))
        .order("desc")
        .collect();
    } else if (sortBy === "difficulty") {
      quizzes = await ctx.db.query("quizzes")
        .withIndex("by_difficulty")
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    } else {
      quizzes = await ctx.db.query("quizzes")
        .withIndex("by_order")
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    }

    // Apply search filter if provided
    if (searchQuery && searchQuery.length > 0) {
      quizzes = quizzes.filter(quiz => {
        const titleMatch = quiz.title.toLowerCase().includes(searchQuery);
        const descriptionMatch = quiz.description.toLowerCase().includes(searchQuery);
        const categoryMatch = quiz.category.toLowerCase().includes(searchQuery);
        const topicMatch = quiz.topic?.toLowerCase().includes(searchQuery);
        const difficultyMatch = quiz.difficulty.toLowerCase().includes(searchQuery);
        
        return titleMatch || descriptionMatch || categoryMatch || topicMatch || difficultyMatch;
      });
    }

    if (!userId) {
      // For unauthenticated users, only show the first quiz as unlocked
      return quizzes.map((quiz, index) => ({
        ...quiz,
        isUnlocked: index === 0,
        isCompleted: false,
        bestScore: null,
        hasNFT: false,
        userVote: null,
        upvotes: quiz.upvotes || 0,
        downvotes: quiz.downvotes || 0,
        voteScore: quiz.voteScore || 0,
      }));
    }

    // Get user's completed quizzes
    const userResults = await ctx.db.query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const completedQuizIds = new Set(
      userResults
        .filter(result => result.isPerfectScore)
        .map(result => result.quizId)
    );

    // Get user's NFT badges
    const userNFTs = await ctx.db.query("nftBadges")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const nftQuizIds = new Set(userNFTs.map(nft => nft.quizId));

    // Get user's votes
    const userVotes = await ctx.db.query("quizVotes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const voteMap = new Map(userVotes.map(vote => [vote.quizId, vote.voteType]));

    return quizzes.map((quiz, index) => {
      const userResult = userResults
        .filter(result => result.quizId === quiz._id)
        .sort((a, b) => b.score - a.score)[0]; // Best score

      const isUnlocked = index === 0 || 
        !quiz.unlockRequirement || 
        completedQuizIds.has(quiz.unlockRequirement);

      return {
        ...quiz,
        isUnlocked,
        isCompleted: completedQuizIds.has(quiz._id),
        bestScore: userResult ? userResult.score : null,
        totalQuestions: quiz.questions.length,
        hasNFT: nftQuizIds.has(quiz._id),
        userVote: voteMap.get(quiz._id) || null,
        upvotes: quiz.upvotes || 0,
        downvotes: quiz.downvotes || 0,
        voteScore: quiz.voteScore || 0,
      };
    });
  },
});

// Get specific quiz by ID
export const getQuiz = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      // For unauthenticated users, only allow the first quiz
      const firstQuiz = await ctx.db.query("quizzes")
        .withIndex("by_order")
        .filter((q) => q.eq(q.field("order"), 1))
        .first();
      
      if (quiz._id !== firstQuiz?._id) {
        throw new Error("Please sign in to access this quiz");
      }
    } else {
      // Check if quiz is unlocked for authenticated users
      if (quiz.unlockRequirement) {
        const userResults = await ctx.db.query("quizResults")
          .withIndex("by_user_and_quiz", (q) => 
            q.eq("userId", userId).eq("quizId", quiz.unlockRequirement!))
          .filter((q) => q.eq(q.field("isPerfectScore"), true))
          .first();

        if (!userResults) {
          throw new Error("Complete the previous quiz with a perfect score to unlock this quiz");
        }
      }
    }

    return quiz;
  },
});

// Save quiz result and update progress
export const saveQuizResult = mutation({
  args: {
    quizId: v.id("quizzes"),
    score: v.number(),
    totalQuestions: v.number(),
    timeSpent: v.optional(v.number()),
    walletAddress: v.optional(v.string()),
    nftTransactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const isPerfectScore = args.score === args.totalQuestions;

    // Save quiz result
    const resultId = await ctx.db.insert("quizResults", {
      userId,
      quizId: args.quizId,
      score: args.score,
      totalQuestions: args.totalQuestions,
      completedAt: Date.now(),
      walletAddress: args.walletAddress,
      nftTransactionId: args.nftTransactionId,
      timeSpent: args.timeSpent,
      isPerfectScore,
    });

    // Update user progress
    let userProgress = await ctx.db.query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const quiz = await ctx.db.get(args.quizId);
    const currentLevel = quiz?.level || 1;

    if (!userProgress) {
      // Create new progress record
      await ctx.db.insert("userProgress", {
        userId,
        currentLevel,
        totalQuizzesCompleted: 1,
        totalPerfectScores: isPerfectScore ? 1 : 0,
        totalNFTsEarned: args.nftTransactionId ? 1 : 0,
        lastActiveAt: Date.now(),
        achievements: [],
        streakCount: 1,
        lastStreakDate: Date.now(),
      });
    } else {
      // Update existing progress
      const updates: any = {
        totalQuizzesCompleted: userProgress.totalQuizzesCompleted + 1,
        lastActiveAt: Date.now(),
      };

      if (isPerfectScore) {
        updates.totalPerfectScores = userProgress.totalPerfectScores + 1;
      }

      if (args.nftTransactionId) {
        updates.totalNFTsEarned = userProgress.totalNFTsEarned + 1;
      }

      // Update current level if this quiz level is higher
      if (currentLevel > userProgress.currentLevel) {
        updates.currentLevel = currentLevel;
      }

      // Update streak
      const today = new Date().toDateString();
      const lastStreakDate = userProgress.lastStreakDate ? 
        new Date(userProgress.lastStreakDate).toDateString() : null;
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

      if (lastStreakDate === yesterday) {
        updates.streakCount = userProgress.streakCount + 1;
      } else if (lastStreakDate !== today) {
        updates.streakCount = 1;
      }
      updates.lastStreakDate = Date.now();

      await ctx.db.patch(userProgress._id, updates);
    }

    return resultId;
  },
});

// Get user progress and statistics
export const getUserProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const progress = await ctx.db.query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const results = await ctx.db.query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const nftBadges = await ctx.db.query("nftBadges")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      progress,
      recentResults: results.slice(-5).reverse(),
      nftBadges,
      totalQuizzesTaken: results.length,
      averageScore: results.length > 0 ? 
        results.reduce((sum, r) => sum + (r.score / r.totalQuestions), 0) / results.length : 0,
    };
  },
});

// Get user's NFT badges with quiz details
export const getUserNFTBadges = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const nftBadges = await ctx.db.query("nftBadges")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get quiz details for each NFT
    const badgesWithQuizDetails = await Promise.all(
      nftBadges.map(async (badge) => {
        const quiz = await ctx.db.get(badge.quizId);
        return {
          ...badge,
          quiz: quiz ? {
            title: quiz.title,
            difficulty: quiz.difficulty,
            category: quiz.category,
            level: quiz.level
          } : null
        };
      })
    );

    return badgesWithQuizDetails.sort((a, b) => b.mintedAt - a.mintedAt);
  },
});

// Internal mutation to save NFT badge to database
export const saveNFTBadge = internalMutation({
  args: {
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    walletAddress: v.string(),
    studentName: v.string(),
    quizTitle: v.string(),
    transactionId: v.string(),
    policyId: v.string(),
    assetName: v.string(),
    metadata: v.object({
      name: v.string(),
      description: v.string(),
      image: v.string(),
      mediaType: v.optional(v.string()),
      attributes: v.any(),
    }),
  },
  handler: async (ctx, args) => {
    console.log("Saving NFT Badge to database:", args);
    
    // Save the NFT badge to the database
    const nftBadgeId = await ctx.db.insert("nftBadges", {
      userId: args.userId,
      quizId: args.quizId,
      transactionId: args.transactionId,
      policyId: args.policyId,
      assetName: args.assetName,
      mintedAt: Date.now(),
      walletAddress: args.walletAddress,
      metadata: args.metadata,
    });
    
    console.log("NFT Badge saved successfully with ID:", nftBadgeId);
    return args.transactionId;
  },
});

// Save AI-generated quiz to database
export const saveAIGeneratedQuiz = mutation({
  args: {
    quizData: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated to create AI quizzes");
    }

    // Insert the AI-generated quiz with voting data
    const quizId = await ctx.db.insert("quizzes", {
      ...args.quizData,
      createdBy: userId,
      createdAt: Date.now(),
      upvotes: 0,
      downvotes: 0,
      voteScore: 0,
    });

    return quizId;
  },
});

// AI Quiz Generation Action (Enhanced with Gemini API)
export const generateAIQuiz = action({
  args: {
    topic: v.string(),
    difficulty: v.union(v.literal("Beginner"), v.literal("Intermediate"), v.literal("Advanced"), v.literal("Expert")),
    numQuestions: v.number(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated to generate AI quizzes");
    }

    // Check for Gemini API key
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured. Please set GEMINI_API_KEY environment variable.");
    }

    try {
      // Import Gemini AI
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create a detailed prompt for quiz generation
      const prompt = `Generate a ${args.difficulty.toLowerCase()} level quiz about "${args.topic}" with exactly ${args.numQuestions} questions.

Requirements:
- Each question should have exactly 4 multiple choice options
- Only one option should be correct
- Include a brief explanation for each correct answer
- Questions should be appropriate for ${args.difficulty.toLowerCase()} level learners
- Focus on practical knowledge and understanding
- Make questions engaging and educational

Please respond with a valid JSON object in this exact format:
{
  "title": "Quiz title here",
  "description": "Brief description of the quiz",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of why this answer is correct"
    }
  ]
}

Topic: ${args.topic}
Difficulty: ${args.difficulty}
Number of questions: ${args.numQuestions}`;

      console.log("Generating AI quiz with Gemini API...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Raw Gemini response:", text);

      // Parse the JSON response
      let quizData;
      try {
        // Extract JSON from the response (remove any markdown formatting)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in response");
        }
        quizData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        throw new Error("Failed to parse AI response. Please try again.");
      }

      // Validate the response structure
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error("Invalid quiz structure from AI");
      }

      // Validate each question
      for (let i = 0; i < quizData.questions.length; i++) {
        const q = quizData.questions[i];
        if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Invalid question structure at index ${i}`);
        }
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error(`Invalid correct answer at index ${i}`);
        }
      }

      // Create the final quiz object
      const finalQuiz = {
        title: quizData.title || `AI Quiz: ${args.topic}`,
        description: quizData.description || `An AI-generated ${args.difficulty.toLowerCase()} level quiz about ${args.topic}`,
        category: args.category || 'AI Generated',
        difficulty: args.difficulty,
        level: args.difficulty === "Beginner" ? 1 : args.difficulty === "Intermediate" ? 2 : args.difficulty === "Advanced" ? 3 : 4,
        isAIGenerated: true,
        generatedAt: Date.now(),
        topic: args.topic,
        order: 999,
        isActive: true,
        questions: quizData.questions
      };

      console.log("Generated quiz:", finalQuiz);

      // Save the quiz to database
      const quizId: any = await ctx.runMutation(api.quiz.saveAIGeneratedQuiz, {
        quizData: finalQuiz,
      });

      return { ...finalQuiz, _id: quizId };

    } catch (error) {
      console.error("Error generating AI quiz:", error);
      
      // Fallback to sample quiz if AI generation fails
      console.log("Falling back to sample quiz generation...");
      const fallbackQuiz = {
        title: `AI Quiz: ${args.topic}`,
        description: `An AI-generated ${args.difficulty.toLowerCase()} level quiz about ${args.topic}`,
        category: args.category || 'AI Generated',
        difficulty: args.difficulty,
        level: args.difficulty === "Beginner" ? 1 : args.difficulty === "Intermediate" ? 2 : args.difficulty === "Advanced" ? 3 : 4,
        isAIGenerated: true,
        generatedAt: Date.now(),
        topic: args.topic,
        order: 999,
        isActive: true,
        questions: Array.from({ length: args.numQuestions }, (_, i) => ({
          question: `Sample question ${i + 1} about ${args.topic}?`,
          options: [
            `Correct answer for ${args.topic}`,
            `Incorrect option A`,
            `Incorrect option B`,
            `Incorrect option C`
          ],
          correctAnswer: 0,
          explanation: `This explains the correct answer for ${args.topic}.`
        }))
      };

      // Save the fallback quiz to database
      const quizId: any = await ctx.runMutation(api.quiz.saveAIGeneratedQuiz, {
        quizData: fallbackQuiz,
      });

      return { ...fallbackQuiz, _id: quizId };
    }
  },
});
