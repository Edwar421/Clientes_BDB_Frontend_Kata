import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/types";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles,
}) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D418C]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles && !requiredRoles.includes(user!.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0D418C] dark:text-sky-400 mb-4">
                        403
                    </h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                        No tienes permiso para acceder a esta página
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tu rol ({user!.role}) no tiene acceso a este recurso.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
