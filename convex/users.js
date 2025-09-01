import { internal } from "./_generated/api";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

<<<<<<< HEAD
// ✅ Store the authenticated user in Convex DB (upsert)
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
=======




export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("IDENTITY:", identity);
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

<<<<<<< HEAD
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
=======
    // Check if we've already stored this identity before.
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
<<<<<<< HEAD
      imageUrl: identity.pictureUrl, // FIX: use Clerk's pictureUrl instead of identity.imageUrl
=======
      imageUrl: identity.imageUrl,
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
    });
  },
});

<<<<<<< HEAD
// ✅ Get the currently signed-in user
export const getCurrentUser = query({
=======
export const getCurrentUser = query({   
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
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
<<<<<<< HEAD
      .unique();

    if (!user) {
      throw new Error("No user found in DB — did you call storeUser after login?");
    }

    return user;
  },
});

// ✅ Search users by name/email (excluding yourself)
=======
      .first();

    if (!user) {
      throw new Error("No user found ");
    }
    return user;
  },
}); 

>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
export const searchUsers = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

<<<<<<< HEAD
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
=======
      //do not search if query is too short 
      if (args.query.length < 3) {
        return [];
      }

      // Search users by name
      const nameResults = await ctx.db
        .query("users")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.query)
        )
        .collect();

      // Search users by email
      const emailResults = await ctx.db
        .query("users")
        .withSearchIndex("search_email", (q) =>
          q.search("email", args.query)
        )
        .collect();

      // Combine and deduplicate results
      const users=[
        ...nameResults,
        ...emailResults.filter(
          (email) => !nameResults.some((name) => name._id === email._id)
        ),
      ];

      return users
      .filter(user => user._id !== currentUser._id)
      .map((user)=>({
        id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      }));
  },
});
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
