import React, { useEffect, useMemo, useState } from "react";
import { Header } from "../components/organisms/Header";
import { getAuditLogs } from "../services/api";
import type { AuditAction, AuditLog, UserRole } from "../types/types";
import {
    FaUserShield,
    FaFilter,
    FaSyncAlt,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

const ACTION_LABELS: Record<AuditAction, string> = {
    CUSTOMER_CREATED: "Cliente creado",
    CUSTOMER_UPDATED: "Cliente actualizado",
    CUSTOMER_DELETED: "Cliente eliminado",
};

const ROLE_LABELS: Record<UserRole, string> = {
    ADMIN: "Admin",
    ASESOR: "Asesor",
};

const ACTION_BADGE_STYLES: Record<AuditAction, string> = {
    CUSTOMER_CREATED:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    CUSTOMER_UPDATED:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    CUSTOMER_DELETED:
        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export const AuditPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
    const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
    const [userFilter, setUserFilter] = useState("");
    const [dateFromFilter, setDateFromFilter] = useState("");
    const [dateToFilter, setDateToFilter] = useState("");

    const loadAuditLogs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAuditLogs({
                page,
                limit: 12,
                action: actionFilter,
                role: roleFilter,
                performedBy: userFilter,
                dateFrom: dateFromFilter || undefined,
                dateTo: dateToFilter || undefined,
            });

            setLogs(response.data);
            setTotalPages(response.pagination.totalPages || 1);
            setTotalItems(response.pagination.total || 0);
        } catch (fetchError) {
            setError("No se pudo cargar la auditoría. Intenta de nuevo. ");
            console.error("Error cargando auditoría", fetchError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuditLogs();
    }, [page]);

    const hasActiveFilters = useMemo(
        () =>
            actionFilter !== "all" ||
            roleFilter !== "all" ||
            userFilter.trim() !== "" ||
            dateFromFilter !== "" ||
            dateToFilter !== "",
        [actionFilter, roleFilter, userFilter, dateFromFilter, dateToFilter]
    );

    const handleApplyFilters = () => {
        setPage(1);
        loadAuditLogs();
    };

    const handleResetFilters = () => {
        setActionFilter("all");
        setRoleFilter("all");
        setUserFilter("");
        setDateFromFilter("");
        setDateToFilter("");
        setPage(1);

        setTimeout(() => {
            loadAuditLogs();
        }, 0);
    };

    return (
        <>
            <Header />

            <section className="min-h-[calc(100vh-80px)] px-6 py-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
                            <FaUserShield />
                            Auditoría de Actividad
                        </h1>
                        <p className="mt-2 text-sky-200">
                            Consulta los eventos críticos del sistema y el historial de acciones realizadas.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(13,65,140,0.25)] dark:border-slate-700 dark:bg-slate-800">
                        <div className="grid gap-4 rounded-2xl bg-slate-100 p-5 dark:bg-slate-700/30 md:grid-cols-2 xl:grid-cols-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Acción
                                </label>
                                <select
                                    value={actionFilter}
                                    onChange={(e) => setActionFilter(e.target.value as AuditAction | "all")}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">Todas</option>
                                    <option value="CUSTOMER_CREATED">Cliente creado</option>
                                    <option value="CUSTOMER_UPDATED">Cliente actualizado</option>
                                    <option value="CUSTOMER_DELETED">Cliente eliminado</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Rol
                                </label>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">Todos</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="ASESOR">Asesor</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Usuario
                                </label>
                                <input
                                    type="text"
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    placeholder="Buscar por usuario"
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    value={dateFromFilter}
                                    onChange={(e) => setDateFromFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    value={dateToFilter}
                                    onChange={(e) => setDateToFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {totalItems} registros encontrados
                            </p>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleApplyFilters}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#0D418C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B3675]"
                                >
                                    <FaFilter />
                                    Aplicar filtros
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                                    disabled={!hasActiveFilters}
                                >
                                    <FaSyncAlt />
                                    Limpiar
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-100 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                            Fecha
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                            Acción
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                            Entidad
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                            Usuario
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                            Rol
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                            Detalles
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-slate-600 dark:text-slate-300">
                                                Cargando auditoría...
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-red-500">
                                                {error}
                                            </td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-slate-600 dark:text-slate-300">
                                                No hay registros para los filtros seleccionados.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                                                    {new Date(log.createdAt).toLocaleString("es-CO")}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ACTION_BADGE_STYLES[log.action]}`}
                                                    >
                                                        {ACTION_LABELS[log.action]}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                                                    {log.entityName} #{log.entityId ?? "-"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                                                    {log.performedBy}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                                                    {ROLE_LABELS[log.performedByRole]}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                                                    {log.details ? (
                                                        <details>
                                                            <summary className="cursor-pointer text-[#0D418C] dark:text-sky-300">
                                                                Ver detalles
                                                            </summary>
                                                            <pre className="mt-2 max-w-xs overflow-x-auto rounded-md bg-slate-100 p-2 text-xs dark:bg-slate-700/60">
                                                                {JSON.stringify(log.details, null, 2)}
                                                            </pre>
                                                        </details>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                                disabled={page <= 1 || loading}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <FaChevronLeft />
                                Anterior
                            </button>

                            <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                Página {page} de {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                                disabled={page >= totalPages || loading}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                Siguiente
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
