import axios from "axios";
import type {
    AuditAction,
    AuditLogsResponse,
    Customer,
    CustomerInput,
    UserRole,
} from "../types/types";
import config from "../config";

const API_URL = config.API_URL;
const AUDIT_API_URL = config.AUDIT_API_URL;

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

type BackendCustomer = {
    id: number;
    typeId: string;
    identification: string;
    name: string;
    age: number;
    email: string;
    product: string;
    createdAt: string;
};

const customerTypeLabels: Record<string, Customer["typeIdentification"]> = {
    "cedula de ciudadania": "Cedula de Ciudadania",
    "cedula de extranjeria": "Cedula de Extranjeria",
    pasaporte: "Pasaporte",
};

const customerProductLabels: Record<string, Customer["product"]> = {
    "cuenta de ahorros": "Cuenta de Ahorros",
    "cuenta corriente": "Cuenta Corriente",
    "tarjeta de credito": "Tarjeta de Crédito",
    "credito libre inversion": "Crédito Libre Inversión",
    "credito de vehiculo": "Crédito de Vehículo",
    "credito rotativo": "Crédito Rotativo",
};

const normalizeKey = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const normalizeCustomerFromBackend = (customer: BackendCustomer): Customer => ({
    id: customer.id,
    typeIdentification:
        customerTypeLabels[normalizeKey(customer.typeId)] ??
        (customer.typeId as Customer["typeIdentification"]),
    identification: customer.identification,
    name: customer.name,
    age: customer.age,
    email: customer.email,
    product:
        customerProductLabels[normalizeKey(customer.product)] ??
        (customer.product as Customer["product"]),
    createdAt: customer.createdAt,
});

export const getCustomers = async (): Promise<Customer[]> => {
    const response = await axiosInstance.get(API_URL);
    if (Array.isArray(response.data)) {
        return response.data.map((customer: BackendCustomer) =>
            normalizeCustomerFromBackend(customer)
        );
    }

    if (Array.isArray(response.data?.value)) {
        return response.data.value.map((customer: BackendCustomer) =>
            normalizeCustomerFromBackend(customer)
        );
    }

    return [];
};

export const createCustomer = async (customer: CustomerInput) => {
    const response = await axiosInstance.post(API_URL, {
        typeId: customer.typeIdentification,
        identification: customer.identification,
        name: customer.name,
        age: customer.age,
        email: customer.email,
        product: customer.product,
    });
    return response.data;
};

export const updateCustomer = async (id: number, customer: CustomerInput) => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, {
        typeId: customer.typeIdentification,
        identification: customer.identification,
        name: customer.name,
        age: customer.age,
        email: customer.email,
        product: customer.product,
    });
    return response.data;
};

export const deleteCustomer = async (id: number) => {
    await axiosInstance.delete(`${API_URL}/${id}`);
};

type GetAuditLogsParams = {
    page?: number;
    limit?: number;
    action?: AuditAction | "all";
    performedBy?: string;
    role?: UserRole | "all";
    dateFrom?: string;
    dateTo?: string;
};

export const getAuditLogs = async (
    params: GetAuditLogsParams = {}
): Promise<AuditLogsResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.set("page", String(params.page ?? 1));
    queryParams.set("limit", String(params.limit ?? 12));

    if (params.action && params.action !== "all") {
        queryParams.set("action", params.action);
    }

    if (params.role && params.role !== "all") {
        queryParams.set("role", params.role);
    }

    if (params.performedBy?.trim()) {
        queryParams.set("performedBy", params.performedBy.trim());
    }

    if (params.dateFrom) {
        queryParams.set("dateFrom", params.dateFrom);
    }

    if (params.dateTo) {
        queryParams.set("dateTo", params.dateTo);
    }

    const response = await axiosInstance.get<AuditLogsResponse>(
        `${AUDIT_API_URL}?${queryParams.toString()}`
    );

    return response.data;
};
