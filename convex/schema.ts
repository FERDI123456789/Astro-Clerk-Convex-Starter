import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    text: v.string(),
    upVotes: v.number(),
    downVotes: v.number(),
    pinned: v.boolean(),
    type: v.union(v.literal("public"), v.literal("private")),
    userId: v.union(v.string(), v.null()),
    userName: v.string(),
    userProfilePic: v.union(v.string(), v.null()),
    userRole: v.union(v.literal("admin"), v.literal("standard")),
    creationTime: v.number(),
  }),
  votes: defineTable({
    messageId: v.id("messages"),
    userId: v.string(),
    voteType: v.union(v.literal("up"), v.literal("down")),
  })
    .index("by_message_and_user", ["messageId", "userId"])
    .index("by_user", ["userId"]),
  users: defineTable({
    userId: v.string(),
    userName: v.string(),
    userProfilePic: v.union(v.string(), v.null()),
    role: v.union(v.literal("admin"), v.literal("standard")),
  }).index("by_userId", ["userId"]),
});
