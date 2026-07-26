"use client";
import {
    createContext,
    ReactNode,
    useContext,
} from "react";
import { useLoginMutation, } from "@/hooks/loginHook";
import { useLogoutMutation } from "@/hooks/logoutHook";
import { useMeQuery } from "@/hooks/useMeQuery";
import { AuthStatus, AuthUser } from "@/lib/auth/types";


interface AuthContextType {
    user: AuthUser | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const meQuery = useMeQuery();
    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation();

    const user = meQuery.data ?? null;

    const status: AuthStatus = meQuery.isPending
        ? "loading"
        : user
            ? "authenticated"
            : "unauthenticated";

    const isAuthenticated = status === "authenticated";



    const login = async (email: string, password: string) => {
      
        const result = await loginMutation.mutateAsync({ email, password });
        await meQuery.refetch();
    };

    const logout = async () => {
        await logoutMutation.mutateAsync();
    };

    const refetchUser = async () => {
        await meQuery.refetch();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                status,
                isAuthenticated,
                login,
                logout,
                refetchUser,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}