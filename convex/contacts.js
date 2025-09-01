import { internal } from "./_generated/api";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all contacts (people + groups) for the current user.
 * People are derived from shared one-on-one expenses or splits.
 */
export const getAllContacts = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    if (!currentUser) {
      throw new Error("User not authenticated or not stored in Convex");
    }

    // Collect all one-on-one expense partners
    const expenses = await ctx.db
      .query("expenses")
      .filter((q) =>
        q.or(
          q.eq(q.field("payerId"), currentUser._id),
          q.eq(q.field("participants"), currentUser._id)
        )
      )
      .collect();

    const contactIds = new Set();
    for (const exp of expenses) {
      if (exp.payerId !== currentUser._id) contactIds.add(exp.payerId);
      for (const p of exp.participants ?? []) {
        if (p !== currentUser._id) contactIds.add(p);
      }
    }

    // Fetch user details
    const users = [];
    for (const id of contactIds) {
      const u = await ctx.db.get(id);
      if (u) {
        users.push({
          _id: u._id,
          name: u.name,
          email: u.email,
          imageUrl: u.imageUrl,
        });
      }
    }

    // Fetch groups where user is a member
    const groups = await ctx.db
      .query("groups")
      .filter((q) =>
        q.or(
          q.eq(q.field("members.userId"), currentUser._id)
        )
      )
      .collect();

    return { users, groups };
  },
});

/**
 * Create a new group with the given members.
 */
export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    memberIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    if (!currentUser) {
      throw new Error("User must be logged in to create a group");
    }

    // Always include the creator as admin
    const members = [
      { userId: currentUser._id, role: "admin", joinedAt: Date.now() },
      ...args.memberIds.map((id) => ({
        userId: id,
        role: "member",
        joinedAt: Date.now(),
      })),
    ];

    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description ?? "",
      members,
      createdBy: currentUser._id,
      createdAt: Date.now(),
    });

    return groupId;
  },
});

/**
 * Get details for a single group.
 */
export const getGroup = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    const group = await ctx.db.get(groupId);
    if (!group) throw new Error("Group not found");
    return group;
  },
});
