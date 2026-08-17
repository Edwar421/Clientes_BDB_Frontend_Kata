import type { UserRole } from "../types/types";
import { useAuth } from "./useAuth";

type Permission = 
    | "view_users"
    | "filter_users"
    | "create_users"
    | "edit_users"
    | "delete_users"
    | "view_customers"
    | "create_customers"
    | "edit_customers"
    | "delete_customers"
    | "view_dashboard"
    | "view_charts"
    | "use_filters"
    | "view_audit";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    ADMIN: [
        "view_users",
        "filter_users",
        "create_users",
        "edit_users",
        "delete_users",
        "view_customers",
        "create_customers",
        "edit_customers",
        "delete_customers",
        "view_dashboard",
        "view_charts",
        "use_filters",
        "view_audit",
    ],
    ASESOR: [
        "view_users",
        "filter_users",
        "create_users",
        "view_customers",
        "create_customers",
        "view_dashboard",
        "view_charts",
        "use_filters",
    ],
};

export const usePermissions = () => {
    const { user } = useAuth();

    const hasPermission = (permission: Permission): boolean => {
        if (!user) return false;
        return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
    };

    const hasRole = (role: UserRole): boolean => {
        return user?.role === role;
    };

    const hasAllPermissions = (permissions: Permission[]): boolean => {
        return permissions.every((permission) => hasPermission(permission));
    };

    const hasAnyPermission = (permissions: Permission[]): boolean => {
        return permissions.some((permission) => hasPermission(permission));
    };

    return {
        hasPermission,
        hasRole,
        hasAllPermissions,
        hasAnyPermission,
        permissions: user ? ROLE_PERMISSIONS[user.role] : [],
    };
};
