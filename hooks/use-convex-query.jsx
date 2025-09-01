<<<<<<< HEAD
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
=======
import { useEffect,useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import React from 'react'



export const useConvexQuery = (query,...args) =>{
    const result= useQuery(query, ...args);

    const [data, setData] = React.useState(undefined);
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        if (result===undefined) {
            setIsLoading(true);
        }else{
            try{
                setData(result);
                setError(null);
            }catch(err){
                setError(err);
                toast.error(err.message);
            }finally{
                setIsLoading(false);
            }
        }
    }, [result]);

    return { data, error, isLoading };
}



export const useConvexMutation = (mutation) =>{
    const mutationFn= useMutation(mutation);

    const [data, setData] = React.useState(undefined);
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const mutate = async (...args) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await mutationFn(...args);
            setData(response);
            return response;
        }catch (err) {
            setError(err);
            toast.error(err.message);
        }finally {
            setIsLoading(false);
        }
    };

    return { mutate, data, error, isLoading };
};
>>>>>>> a7b0366583fa7d72da969687668b9f81871e9872
