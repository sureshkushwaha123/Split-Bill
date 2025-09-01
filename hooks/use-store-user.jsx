<<<<<<< HEAD
"use client";

=======
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
<<<<<<< HEAD
import { api } from "@/convex/_generated/api";

/**
 * Hook to ensure the authenticated Clerk user
 * is stored in the Convex `users` table.
 */
export function useStoreUser() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState(null);

  // ✅ fix: mutation name must match backend (`storeUser`)
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (!isAuthenticated) {
      setUserId(null);
      return;
    }

    async function createOrUpdateUser() {
      try {
        const id = await storeUser();
        setUserId(id);
      } catch (err) {
        console.error("Failed to store user in Convex:", err);
        setUserId(null);
      }
    }

    createOrUpdateUser();
    // re-run if auth state or Clerk user id changes
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    // Loading until both Clerk auth and Convex user storage are resolved
    isLoading: authLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
    userId,
  };
}
=======
import { api } from "../convex/_generated/api";

export function useStoreUser() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  // When this state is set we know the server
  // has stored the user.
  const [userId, setUserId] = useState(null);
  const storeUser = useMutation(api.users.store);
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      return;
    }
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }
    createUser();
    return () => setUserId(null);
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [isAuthenticated, storeUser, user?.id]);
  // Combine the local state with the state from context
  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
