import { internal } from "./_generated/api";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ✅ Store the authenticated user in Convex DB (upsert)
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity
    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (existing) {
  // Update fields if changed
  const patch = {};
  if (existing.name !== identity.name) patch.name = identity.name ?? "Anonymous";
  if (existing.email !== identity.email) patch.email = identity.email;
  if (existing.imageUrl !== identity.pictureUrl) patch.imageUrl = identity.pictureUrl;

  if (Object.keys(patch).length > 0) {
    await ctx.db.patch(existing._id, patch);
  }
  return existing._id;
}

    // Insert new user
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      imageUrl: identity.pictureUrl, // FIX: use Clerk's pictureUrl instead of identity.imageUrl
    });
  },
});

// ✅ Get the currently signed-in user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("No user found in DB — did you call storeUser after login?");
    }

    return user;
  },
});

// ✅ Search users by name/email (excluding yourself)
export const searchUsers = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    // Don't search if query too short
    if (args.query.length < 3) {
      return [];
    }

    // Search by name
    const nameResults = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) =>
        q.search("name", args.query)
      )
      .collect();

    // Search by email
    const emailResults = await ctx.db
      .query("users")
      .withSearchIndex("search_email", (q) =>
        q.search("email", args.query)
      )
      .collect();

    // Merge & deduplicate
    const users = [
      ...nameResults,
      ...emailResults.filter(
        (email) => !nameResults.some((name) => name._id === email._id)
      ),
    ];

    return users
      .filter((u) => u._id !== currentUser._id)
      .map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        imageUrl: u.imageUrl,
      }));
  },
});
