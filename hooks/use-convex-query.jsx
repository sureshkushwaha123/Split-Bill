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