"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";

// ✅ Query wrapper
export const useConvexQuery = (query, ...args) => {
  const result = useQuery(query, ...args);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (result === undefined) {
      // still fetching OR skipped
      setIsLoading(true);
      setData(null); // ✅ clear stale data
    } else {
      try {
        setData(result ?? null); // ✅ always normalize
        setError(null);
      } catch (err) {
        setError(err);
        toast.error(err.message || "Query error");
      } finally {
        setIsLoading(false);
      }
    }
  }, [result]);

  return { data, error, isLoading };
};

// ✅ Mutation wrapper
export const useConvexMutation = (mutation) => {
  const mutationFn = useMutation(mutation);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(...args);
      setData(response ?? null);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.message || "Mutation error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, error, isLoading };
};
