import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateUserRoleOnMessages = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("standard")),
  },
  handler: async (ctx, { userId, role }) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    for (const message of messages) {
      await ctx.db.patch(message._id, {
        userRole: role,
      });
    }
  },
});
