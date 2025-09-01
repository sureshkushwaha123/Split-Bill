<<<<<<< HEAD
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
=======
import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// convex/contacts.js
export const getAllContacts = query({
  handler: async (ctx) => {
    // 1. Get the current user
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    // 2. Find all personal expenses (one-on-one) involving the current user
    const expensesYouPaid = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_group", (q) =>
        q.eq("paidByUserId", currentUser._id).eq("groupId", null)
      )
      .collect();

    const expensesNotPaidByYou = (await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", null))
      .collect()
    ).filter(
      (e) =>
        e.paidByUserId !== currentUser._id &&
        e.splits.some((s) => s.userId === currentUser._id)
    );

    const personalExpenses = [...expensesYouPaid, ...expensesNotPaidByYou];

    // 3. Collect the IDs of all contacts from these expenses
    const contactIds = new Set();
    personalExpenses.forEach((exp) => {
      if (exp.paidByUserId !== currentUser._id)
        contactIds.add(exp.paidByUserId);

      exp.splits.forEach((s) => {
        if (s.userId !== currentUser._id) contactIds.add(s.userId);
      });
    });

    // 4. Fetch the full user objects for all identified contacts
    const contactUsers = await Promise.all(
      [...contactIds].map(async (id) => {
        const user = await ctx.db.get(id);
        return user
          ? {
              id: user._id,
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
              type: "user",
            }
          : null;
      })
    );

    // 5. Find all groups the current user is a member of
    const userGroups = (await ctx.db.query("groups").collect())
      .filter((g) =>
        g.members.some((m) => m.userId === currentUser._id)
      )
      .map((g) => ({
        id: g._id,
        name: g.name,
        description: g.description,
        memberCount: g.members.length,
        type: "group",
      }));

    // 6. Sort the results and return them
    contactUsers.sort((a, b) => a?.name?.localeCompare(b?.name ?? ""));
    userGroups.sort((a, b) => a.name.localeCompare(b.name));

    return {
      users: contactUsers.filter(Boolean),
      groups: userGroups,
    };
  },
});

>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
<<<<<<< HEAD
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
=======
    members: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    if (!args.name.trim()) {
      throw new Error("Group name is required");
    }

    const uniqueMembers = new Set(args.members);
    uniqueMembers.add(currentUser._id);

    // Validate members
    for (const memberId of uniqueMembers) {
      if (!(await ctx.db.get(memberId))) {
        throw new Error(`User with ID ${memberId} does not exist`);
      }
    }

    return await ctx.db.insert("groups", {
      name: args.name.trim(),
      description: args.description?.trim() ?? "",
      members: [...uniqueMembers].map((id) => ({
        userId: id,
        role: id === currentUser._id ? "admin" : "member",
        joinedAt: Date.now(),
      })),
      createdBy: currentUser._id,
    });
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
  },
});
