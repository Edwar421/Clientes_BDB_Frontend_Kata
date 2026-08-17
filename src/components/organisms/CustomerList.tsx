import React from "react";
import { CustomerCard } from "../molecules/CustomerCard";
import { FaClipboardList } from "react-icons/fa";
import type { Customer } from "../../types/types";

interface CustomerListProps {
    customers: Customer[];
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
    customers,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="space-y-4">
            {customers.length === 0 ? (
                <div className="flex flex-col items-center">
                    <FaClipboardList className="w-12 h-12 text-sky-300 dark:text-white" />
                    <p className="text-center text-gray-500 mt-4">
                        Agrega un cliente para comenzar.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {customers.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
