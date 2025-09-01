"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
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
