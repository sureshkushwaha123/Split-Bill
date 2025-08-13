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

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
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
  },
});
