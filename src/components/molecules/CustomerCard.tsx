import React from "react";
import { FaUser, FaEnvelope, FaIdCard, FaBirthdayCake, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import type { Customer } from "../../types/types";
import { usePermissions } from "../../hooks/usePermissions";

interface CustomerCardProps {
    customer: Customer;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
    customer,
    onEdit,
    onDelete,
}) => {
    const { hasPermission } = usePermissions();
    const canEdit = hasPermission("edit_customers");
    const canDelete = hasPermission("delete_customers");

    const formatCreatedAt = (value: string) =>
        new Date(value).toLocaleString("es-CO", {
            dateStyle: "medium",
            timeStyle: "short",
        });

    return (
        <div
            className="
        rounded-2xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-800
        p-5
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        "
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div className="flex-1">

                    <div className="flex items-center gap-4 mb-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900">
                            <FaUser className="text-sky-600 dark:text-sky-300" />
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {customer.name}
                            </h3>

                            <span
                                className="
                            inline-flex
                            rounded-full
                            bg-gradient-to-r
                            from-sky-500
                            to-blue-600
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-white
                            "
                            >
                                {customer.product}
                            </span>
                        </div>

                    </div>

                    <div className="grid gap-3 md:grid-cols-2">

                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <FaEnvelope className="text-sky-500" />
                            {customer.email}
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <FaIdCard className="text-sky-500" />
                            {customer.identification}
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <FaBirthdayCake className="text-sky-500" />
                            {customer.age} años
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <FaCalendarAlt className="text-sky-500" />
                            {formatCreatedAt(customer.createdAt)}
                        </div>

                    </div>

                </div>

                {(canEdit || canDelete) && (
                    <div className="flex gap-2">
                        {canEdit && (
                            <button
                                onClick={() => onEdit(customer)}
                                className="rounded-xl border border-sky-500 px-5 py-3 text-sm font-semibold text-sky-600 hover:bg-sky-500 hover:text-white transition flex items-center gap-2">
                                <FaEdit /> Editar
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={() => onDelete(customer)}
                                className="rounded-xl border border-red-500 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-500 hover:text-white transition flex items-center gap-2">
                                <FaTrash /> Eliminar
                            </button>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};