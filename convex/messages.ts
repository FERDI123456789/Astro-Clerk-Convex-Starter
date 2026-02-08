import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { RateLimiter, SECOND } from "@convex-dev/rate-limiter"; // Import here
import { components } from "./_generated/api"; // Add if missing
import { Id } from "./_generated/dataModel"; // Add this import to resolve the Id type

type Role = "admin" | "standard";

export const listPublicMessages = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject ?? null;

    // Get user role from the "users" table
    let userRole: Role = "standard";
    let voteMap = new Map<Id<"messages">, "up" | "down">();
    if (userId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
      userRole = user?.role ?? "standard";

      const userVotes = await ctx.db
        .query("votes")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      voteMap = new Map(userVotes.map((v) => [v.messageId, v.voteType]));
    }

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("type"), "public"))
      .order("desc")
      .collect();

    return messages.map((message) => {
      const isAdmin = userRole === "admin";
      const isOwner = userId !== null && message.userId === userId;
      const canDelete = isAdmin || isOwner;

      return {
        ...message,
        upVoted: voteMap.get(message._id) === "up",
        downVoted: voteMap.get(message._id) === "down",
        canDelete,
      };
    });
  },
});

export const userRole = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No Identity");

    const userId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return user?.role === "admin";
  },
});

export const listPrivateMessages = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("type"), "private"))
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("desc")
      .collect();
  },
});

export const listUserPublicMessages = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const viewerId = identity?.subject ?? null;

    let voteMap = new Map<Id<"messages">, "up" | "down">();
    let viewerRole: Role = "standard";
    if (viewerId) {
      const viewer = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", viewerId))
        .first();
      viewerRole = viewer?.role ?? "standard";

      const userVotes = await ctx.db
        .query("votes")
        .withIndex("by_user", (q) => q.eq("userId", viewerId))
        .collect();
      voteMap = new Map(userVotes.map((v) => [v.messageId, v.voteType]));
    }

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("type"), "public"))
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    return messages.map((message) => {
      const isAdmin = viewerRole === "admin";
      const isOwner = viewerId !== null && message.userId === viewerId;
      const canDelete = isAdmin || isOwner;

      return {
        ...message,
        upVoted: voteMap.get(message._id) === "up",
        downVoted: voteMap.get(message._id) === "down",
        canDelete,
      };
    });
  },
});

export const createMessage = mutation({
  args: {
    text: v.string(),
    type: v.union(v.literal("public"), v.literal("private")),
    upVotes: v.number(),
    downVotes: v.number(),
    pinned: v.boolean(),
  },
  handler: async (ctx, { text, type, upVotes, downVotes, pinned }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && type === "private") {
      throw new Error("Not authenticated to create private messages");
    }

    const userId = identity ? identity.subject : null;
    const userName = identity?.name || identity?.nickname || "Anonymous";
    const userProfilePic = identity?.pictureUrl || null;

    // Get latest role from "users" table
    let userRole: Role = "standard";
    if (userId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
      userRole = user?.role ?? "standard";
    }

    // Rate limiter
    const rateLimiter = new RateLimiter(components.rateLimiter, {
      createMessage: {
        kind: "token bucket",
        rate: 8,
        period: 8 * SECOND,
        capacity: 8,
      },
    });
    await rateLimiter.limit(ctx, "createMessage", {
      key: userId ?? "anonymous",
      throws: true,
    });

    await ctx.db.insert("messages", {
      text,
      type,
      upVotes,
      downVotes,
      pinned,
      userId,
      userName,
      userProfilePic,
      userRole,
      creationTime: Date.now(),
    });
  },
});

export const togglePin = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const message = await ctx.db.get(messageId);
    await ctx.db.patch(messageId, {
      pinned: !message?.pinned,
    });
  },
});

export const toggleUpvote = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_message_and_user", (q) =>
        q.eq("messageId", messageId).eq("userId", userId),
      )
      .first();

    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");

    if (existingVote?.voteType === "up") {
      await ctx.db.delete(existingVote._id);
      await ctx.db.patch(messageId, {
        upVotes: Math.max(0, (message.upVotes ?? 0) - 1),
      });
    } else {
      if (existingVote) {
        await ctx.db.delete(existingVote._id);
        await ctx.db.patch(messageId, {
          downVotes: Math.max(0, (message.downVotes ?? 0) - 1),
        });
      }
      await ctx.db.insert("votes", {
        messageId,
        userId,
        voteType: "up",
      });
      await ctx.db.patch(messageId, {
        upVotes: (message.upVotes ?? 0) + 1,
      });
    }
  },
});

export const toggleDownvote = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_message_and_user", (q) =>
        q.eq("messageId", messageId).eq("userId", userId),
      )
      .first();

    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");

    if (existingVote?.voteType === "down") {
      await ctx.db.delete(existingVote._id);
      await ctx.db.patch(messageId, {
        downVotes: Math.max(0, (message.downVotes ?? 0) - 1),
      });
    } else {
      if (existingVote) {
        await ctx.db.delete(existingVote._id);
        await ctx.db.patch(messageId, {
          upVotes: Math.max(0, (message.upVotes ?? 0) - 1),
        });
      }
      await ctx.db.insert("votes", {
        messageId,
        userId,
        voteType: "down",
      });
      await ctx.db.patch(messageId, {
        downVotes: (message.downVotes ?? 0) + 1,
      });
    }
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userProfilePic: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { userId, userName, userProfilePic }) => {
    const messagesToUpdate = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    for (const message of messagesToUpdate) {
      await ctx.db.patch(message._id, {
        userName,
        userProfilePic,
      });
    }
  },
});

export const updateUserRoleOnMessages = internalMutation({
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
      if (message.userRole !== role) {
        await ctx.db.patch(message._id, {
          userRole: role,
        });
      }
    }
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, { messageId }) => {
    await ctx.db.delete(messageId);
  },
});

export const upsertUser = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userProfilePic: v.union(v.string(), v.null()),
    role: v.union(v.literal("admin"), v.literal("standard")),
  },
  handler: async (ctx, { userId, userName, userProfilePic, role }) => {
    // Try to fetch the user using the index "by_userId"
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      // Patch the existing user
      await ctx.db.patch(existing._id, {
        userName,
        userProfilePic,
        role,
      });
    } else {
      // Insert a new user
      await ctx.db.insert("users", {
        userId,
        userName,
        userProfilePic,
        role,
      });
    }
  },
});
