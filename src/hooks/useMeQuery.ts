
import { AuthUser } from "@/lib/auth/types";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import { ApiError } from "next/dist/server/api-utils";

export const meQueryKey = ["auth", "me"] as const;

export function useMeQuery(): UseQueryResult<AuthUser | null, Error> {
    return useQuery({
        queryKey: meQueryKey,
        queryFn: async () => {
            const result = await api.get<AuthUser | null>("/api/user/me");
            return result.data;
        },
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
            if (error instanceof ApiError && error.statusCode === 401) {
                console.log("Unauthorized error, not retrying.");
                return false;
            }

            return failureCount < 2;
        },
    })
}