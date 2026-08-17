import React, { useState, useEffect } from "react";
import { DashboardTemplate } from "../components/templates/DashboardTemplate";
import { getCustomers, updateCustomer, deleteCustomer } from "../services/api";
import type { Customer, CustomerInput, typeIdentification, CustomerProduct } from "../types/types";
import { Header } from "../components/organisms/Header";
import { Modal } from "../components/atoms/Modal";
import { usePermissions } from "../hooks/usePermissions";
import { FaCheckCircle, FaExclamationTriangle, FaIdCard, FaUser, FaBirthdayCake, FaEnvelope, FaChevronDown } from "react-icons/fa";

const customerTypes: typeIdentification[] = [
    "Cedula de Ciudadania",
    "Cedula de Extranjeria",
    "Pasaporte"
];

const customerProducts: CustomerProduct[] = [
    "Cuenta de Ahorros",
    "Cuenta Corriente",
    "Tarjeta de Crédito",
    "Crédito Libre Inversión",
    "Crédito de Vehículo",
    "Crédito Rotativo",
];

export const DashboardPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { hasPermission } = usePermissions();

    const [editForm, setEditForm] = useState({
        typeIdentification: "" as typeIdentification | "",
        identification: "",
        name: "",
        age: "",
        email: "",
        product: "" as CustomerProduct | "",
    });

    const fetchCustomers = async () => {
        const customers = await getCustomers();
        setCustomers(customers);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleEdit = (customer: Customer) => {
        if (!hasPermission("edit_customers")) return;
        setEditingCustomer(customer);
        setEditForm({
            typeIdentification: customer.typeIdentification,
            identification: customer.identification,
            name: customer.name,
            age: String(customer.age),
            email: customer.email,
            product: customer.product,
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (customer: Customer) => {
        if (!hasPermission("delete_customers")) return;
        setDeletingCustomer(customer);
        setIsDeleteModalOpen(true);
    };

    const confirmEdit = async () => {
        if (!editingCustomer || !hasPermission("edit_customers")) return;
        try {
            const customerInput: CustomerInput = {
                typeIdentification: editForm.typeIdentification as typeIdentification,
                identification: editForm.identification,
                name: editForm.name,
                age: Number(editForm.age),
                email: editForm.email,
                product: editForm.product as CustomerProduct,
            };
            await updateCustomer(editingCustomer.id, customerInput);
            setIsEditModalOpen(false);
            setEditingCustomer(null);
            setSuccessMessage("Cliente actualizado correctamente.");
            setIsSuccessModalOpen(true);
            fetchCustomers();
        } catch (error) {
            console.error("Error actualizando cliente", error);
        }
    };

    const confirmDelete = async () => {
        if (!deletingCustomer || !hasPermission("delete_customers")) return;
        try {
            await deleteCustomer(deletingCustomer.id);
            setIsDeleteModalOpen(false);
            setDeletingCustomer(null);
            setSuccessMessage("Cliente eliminado correctamente.");
            setIsSuccessModalOpen(true);
            fetchCustomers();
        } catch (error) {
            console.error("Error eliminando cliente", error);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-[calc(100vh-80px)]">
                <DashboardTemplate 
                    customers={customers} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Modal de Edición */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                Editar Cliente
                            </h3>

                            <div className="space-y-4">
                                <div className="relative">
                                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" />
                                    <select
                                        value={editForm.typeIdentification}
                                        onChange={(e) => setEditForm({...editForm, typeIdentification: e.target.value as typeIdentification})}
                                        className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 appearance-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    >
                                        <option value="" disabled>Tipo de identificación</option>
                                        {customerTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 pointer-events-none" />
                                </div>

                                <div className="relative">
                                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={editForm.identification}
                                        onChange={(e) => setEditForm({...editForm, identification: e.target.value})}
                                        placeholder="Identificación"
                                        className="w-full pl-12 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>

                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        placeholder="Nombre completo"
                                        className="w-full pl-12 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>

                                <div className="relative">
                                    <FaBirthdayCake className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        value={editForm.age}
                                        onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                                        placeholder="Edad"
                                        className="w-full pl-12 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>

                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                        placeholder="Correo electrónico"
                                        className="w-full pl-12 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>

                                <div className="relative">
                                    <FaCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" />
                                    <select
                                        value={editForm.product}
                                        onChange={(e) => setEditForm({...editForm, product: e.target.value as CustomerProduct})}
                                        className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 appearance-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    >
                                        <option value="" disabled>Selecciona un producto</option>
                                        {customerProducts.map((product) => (
                                            <option key={product} value={product}>{product}</option>
                                        ))}
                                    </select>
                                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmEdit}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-[#0D418C] text-white font-semibold shadow-lg hover:scale-[1.01] transition"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmación de Eliminación */}
                {isDeleteModalOpen && deletingCustomer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl text-center">
                            <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                ¿Eliminar cliente?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Estás a punto de eliminar a <strong>{deletingCustomer.name}</strong>. Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 transition"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Éxito */}
                <Modal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title="Éxito"
                    message={successMessage}
                    icon={<FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />}
                />
            </div>
        </>
    );
};
