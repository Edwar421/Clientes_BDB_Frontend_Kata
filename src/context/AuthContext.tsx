import React, { createContext, useCallback, useEffect, useState } from "react";
import type { AuthContextType, User } from "../types/types";
import { authService } from "../services/authService";

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
            authService
                .validateToken(storedToken)
                .then((isValid) => {
                    if (isValid) {
                        return authService.getCurrentUser(storedToken);
                    } else {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("authUser");
                        setToken(null);
                        return null;
                    }
                })
                .then((currentUser) => {
                    if (currentUser) {
                        setUser(currentUser);
                    }
                })
                .catch(() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("authUser");
                    setToken(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login(username, password);
            const { accessToken, user: userData } = response;

            localStorage.setItem("authToken", accessToken);
            localStorage.setItem("authUser", JSON.stringify(userData));

            setToken(accessToken);
            setUser(userData);
        } catch (error) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
            setToken(null);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setToken(null);
        setUser(null);
    }, []);

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe ser usado dentro de AuthProvider");
    }
    return context;
};
