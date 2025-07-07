import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const updateUserName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate name
    const trimmedName = args.name.trim();
    if (!trimmedName) {
      throw new Error("Name cannot be empty");
    }

    if (trimmedName.length > 50) {
      throw new Error("Name cannot be longer than 50 characters");
    }

    // Update the user's name
    await ctx.db.patch(userId, {
      name: trimmedName,
    });

    return { success: true, name: trimmedName };
  },
});
