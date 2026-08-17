export type UserRole = "ADMIN" | "ASESOR";

export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: string | number;
    user: User;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export type typeIdentification =
    | "Cedula de Ciudadania"
    | "Cedula de Extranjeria"
    | "Pasaporte";

export type CustomerProduct =
    | "Cuenta de Ahorros"
    | "Cuenta Corriente"
    | "Tarjeta de Crédito"
    | "Crédito Libre Inversión"
    | "Crédito de Vehículo"
    | "Crédito Rotativo";

export interface Customer {
    id: number;
    typeIdentification: typeIdentification;
    identification: string;
    name: string;
    age: number;
    email: string;
    product: CustomerProduct;
    createdAt: string;
}

export interface CustomerInput {
    typeIdentification: typeIdentification;
    identification: string;
    name: string;
    age: number;
    email: string;
    product: CustomerProduct;
}

export type AuditAction =
    | "CUSTOMER_CREATED"
    | "CUSTOMER_UPDATED"
    | "CUSTOMER_DELETED";

export interface AuditLog {
    id: number;
    action: AuditAction;
    entityName: string;
    entityId: number | null;
    performedBy: string;
    performedByRole: UserRole;
    details: Record<string, unknown> | null;
    createdAt: string;
}

export interface AuditLogsPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AuditLogsResponse {
    data: AuditLog[];
    pagination: AuditLogsPagination;
    filters?: {
        action: AuditAction | null;
        role: UserRole | null;
        performedBy: string | null;
        dateFrom: string | null;
        dateTo: string | null;
    };
}
