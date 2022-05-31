import type { FC, ReactNode } from "react";
import type { User, UserCredentials, UserRegistrationCredentials } from "types";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

interface AuthContext {
    user: User | null;
    token: string | null;
    loggedIn: boolean;
    login: (credentials: UserCredentials) => Promise<{
        success: boolean;
        error: { field: string; message: string } | null;
    }>;
    register: (credentials: UserRegistrationCredentials) => Promise<{
        success: boolean;
        error: { field: string; message: string };
    }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const useAuthContext = (): AuthContext => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be within AuthProvider");
    }
    return context;
};

export const AuthProvider: FC<{
    sessionUser: User | null;
    sessionToken: string | null;
    children: ReactNode;
}> = ({ sessionUser, sessionToken, children }) => {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<User | null>(sessionUser);
    const [token, setToken] = useState<string | null>(sessionToken);
    const [loggedIn, setLoggedIn] = useState(false);

    const login = async (credentials: UserCredentials) => {
        try {
            const response = await axios.post<{
                message: string;
                user: User;
                token: string;
            }>("/api/auth/login", credentials, {
                withCredentials: true,
            });

            setUser(response.data.user);
            setToken(response.data.token);
            setLoggedIn(true);

            return { success: true, error: null };
        } catch (error: any) {
            if (error.response.data?.field) {
                return { success: false, error: error.response.data };
            } else {
                console.log(error);
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return { success: false, error: null };
            }
        }
    };

    const register = async (credentials: UserRegistrationCredentials) => {
        try {
            await axios.post<{ message: string }>("/api/auth/register", credentials, {
                withCredentials: true,
            });

            return { success: true, error: null };
        } catch (error: any) {
            if (error.response.data?.field) {
                return { success: false, error: error.response.data };
            } else {
                console.log(error);
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return { success: false, error: null };
            }
        }
    };

    const logout = async () => {
        try {
            await axios.get("/api/auth/logout", {
                headers: {
                    authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setUser(null);
            setLoggedIn(false);
            await router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (sessionUser !== null) {
            setLoggedIn(true);
        }
    }, []);

    const value = useMemo(
        () => ({
            user,
            token,
            loggedIn,
            login,
            register,
            logout,
        }),
        [user, loggedIn, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};