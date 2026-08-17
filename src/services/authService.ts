import axios from "axios";
import type { AuthResponse, User } from "../types/types";
import config from "../config";

const AUTH_API_URL = config.AUTH_API_URL;

const authAxiosInstance = axios.create({
    baseURL: AUTH_API_URL,
});

export const authService = {
    /**
     * Realiza login y retorna el token y usuario
     */
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await authAxiosInstance.post<AuthResponse>("/login", {
            username,
            password,
        });
        return response.data;
    },

    /**
     * Obtiene el usuario actual basado en el token
     */
    getCurrentUser: async (token: string): Promise<User> => {
        const response = await authAxiosInstance.get<User>("/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    /**
     * Valida si el token sigue siendo válido
     */
    validateToken: async (token: string): Promise<boolean> => {
        try {
            await authService.getCurrentUser(token);
            return true;
        } catch {
            return false;
        }
    },
};
