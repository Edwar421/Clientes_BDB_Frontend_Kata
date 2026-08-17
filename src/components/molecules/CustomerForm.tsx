import React, { useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { FaPlusCircle } from "react-icons/fa";
import { FaUser, FaEnvelope, FaIdCard, FaBirthdayCake, FaChevronDown, } from "react-icons/fa";
import { createCustomer } from "../../services/api";
import type { CustomerInput, CustomerProduct, typeIdentification } from "../../types/types";

interface CustomerFormProps {
    onCustomerCreated: () => void;
    onSuccess?: () => void;
}

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

const isCustomerType = (value: string): value is typeIdentification =>
    customerTypes.includes(value as typeIdentification);

const isCustomerProduct = (value: string): value is CustomerProduct =>
    customerProducts.includes(value as CustomerProduct);

export const TaskForm: React.FC<CustomerFormProps> = ({
    onCustomerCreated,
    onSuccess,
}) => {
    const [identification, setIdentification] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [identificationType, setIdentificationType] = useState<
        typeIdentification | ""
    >("");
    const [product, setProduct] = useState<CustomerProduct | "">("");
    const [errors, setErrors] = useState<{
        typeIdentification?: string;
        identification?: string;
        name?: string;
        age?: string;
        email?: string;
        product?: string;
        submit?: string;
    }>({});

    const validate = () => {
        const newErrors: {
            typeIdentification?: string;
            identification?: string;
            name?: string;
            age?: string;
            email?: string;
            product?: string;
            submit?: string;
        } = {};
        if (!identificationType) {
            newErrors.typeIdentification =
                "Se debe seleccionar un tipo de identificación.";
        } else if (!isCustomerType(identificationType)) {
            newErrors.typeIdentification =
                "Selecciona un tipo de identificación válido.";
        }

        if (!/^\d{7,10}$/.test(identification.trim())) {
            newErrors.identification =
                "La identificación debe contener entre 7 y 10 números.";
        }

        if (name.trim().length < 2 || name.trim().length > 100) {
            newErrors.name = "El nombre debe tener entre 2 y 100 caracteres.";
        }

        const numericAge = Number(age);
        if (!Number.isInteger(numericAge) || numericAge < 18 || numericAge > 100) {
            newErrors.age = "La edad debe ser un número entero entre 18 y 100.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            newErrors.email = "El correo electrónico debe ser válido.";
        }

        if (!product) {
            newErrors.product = "Se debe seleccionar un producto.";
        } else if (!isCustomerProduct(product)) {
            newErrors.product = "Selecciona un producto válido.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const selectedIdentificationType = identificationType as typeIdentification;
        const selectedProduct = product as CustomerProduct;
        const customer: CustomerInput = {
            typeIdentification: selectedIdentificationType,
            identification: identification.trim(),
            name: name.trim(),
            age: Number(age),
            email: email.trim(),
            product: selectedProduct,
        };

        try {
            await createCustomer(customer);
            setIdentificationType("");
            setIdentification("");
            setName("");
            setAge("");
            setEmail("");
            setProduct("");
            setErrors({});
            onCustomerCreated();
            onSuccess?.();
        } catch (error) {
            console.log("Error creando cliente", error);
            let errorMessage = "No se pudo conectar con el backend. Verifica que esté corriendo en el puerto 8080.";
            
            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
                if (axiosError.response?.status === 409) {
                    errorMessage = "Ya existe un cliente registrado con ese número de identificación.";
                } else if (axiosError.response?.status === 400) {
                    errorMessage = axiosError.response?.data?.message || "Datos inválidos. Por favor verifica la información.";
                } else if (axiosError.response?.status && axiosError.response.status >= 500) {
                    errorMessage = "Error en el servidor. Por favor intenta más tarde.";
                }
            }
            
            setErrors((currentErrors) => ({
                ...currentErrors,
                submit: errorMessage,
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="px-8 py-4">
            <label htmlFor="identificationType" className="sr-only">Tipo de identificación</label>
            <div className="relative mb-5">
                <FaIdCard
                    className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-500
            dark:text-slate-400
        "
                />

                <select
                    id="identificationType"
                    value={identificationType}
                    onChange={(e) =>
                        setIdentificationType(
                            e.target.value as typeIdentification | ""
                        )
                    }
                    className="
            ml-12
            w-[calc(100%-3rem)]
            rounded-xl
            border
            border-gray-300
            bg-gray-50
            py-3
            px-4
            pr-10
            text-gray-900
            appearance-none
            transition-all
            focus:border-sky-500
            focus:outline-none
            focus:ring-4
            focus:ring-sky-200
            dark:border-slate-600
            dark:bg-slate-700
            dark:text-white
            dark:focus:ring-sky-500/20
        "
                >
                    <option value="" disabled>
                        Tipo de identificación
                    </option>

                    {customerTypes.map((customerType) => (
                        <option key={customerType} value={customerType}>
                            {customerType}
                        </option>
                    ))}
                </select>

                <FaChevronDown
                    className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-500
            dark:text-slate-400
            pointer-events-none
        "
                />
            </div>
            {errors.typeIdentification && (
                <p className="mb-2 text-sm text-red-500">
                    {errors.typeIdentification}
                </p>
            )}
            <div className="relative mb-5">
                <FaIdCard className="absolute left-4 top-4 text-slate-400" />
                <Input
                    type="text"
                    name="identification"
                    placeholder="Identificación"
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                    className="pl-12"
                />
            </div>
            {errors.identification && (
                <p className="-mt-2 mb-3 text-sm text-red-500">
                    {errors.identification}
                </p>
            )}
            <div className="relative mb-5">
                <FaUser className="absolute left-4 top-4 text-slate-400" />
                <Input
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12"
                />
            </div>
            {errors.name && (
                <p className="-mt-2 mb-3 text-sm text-red-500">
                    {errors.name}
                </p>
            )}
            <div className="relative mb-5">
                <FaBirthdayCake className="absolute left-4 top-4 text-slate-400" />
                <Input
                    type="number"
                    name="age"
                    placeholder="Edad"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="pl-12"
                />
            </div>
            {errors.age && (
                <p className="-mt-2 mb-3 text-sm text-red-500">
                    {errors.age}
                </p>
            )}
            <div className="relative mb-5">
                <FaEnvelope className="absolute left-4 top-4 text-slate-400" />
                <Input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12"
                />
            </div>
            {errors.email && (
                <p className="-mt-2 mb-3 text-sm text-red-500">
                    {errors.email}
                </p>
            )}
            <label htmlFor="product" className="sr-only">Producto</label>
            <div className="relative mb-5">
                <FaPlusCircle
                    className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-500
            dark:text-slate-400
        "
                />

                <select
                    id="product"
                    value={product}
                    onChange={(e) =>
                        setProduct(
                            e.target.value as CustomerProduct | ""
                        )
                    }
                    className="
            ml-12
            w-[calc(100%-3rem)]
            rounded-xl
            border
            border-gray-300
            bg-gray-50
            py-3
            px-4
            pr-10
            text-gray-900
            appearance-none
            transition-all
            focus:border-sky-500
            focus:outline-none
            focus:ring-4
            focus:ring-sky-200
            dark:border-slate-600
            dark:bg-slate-700
            dark:text-white
            dark:focus:ring-sky-500/20
        "
                >
                    <option value="" disabled>
                        Selecciona un producto
                    </option>

                    {customerProducts.map((customerProduct) => (
                        <option key={customerProduct} value={customerProduct}>
                            {customerProduct}
                        </option>
                    ))}
                </select>

                <FaChevronDown
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                    dark:text-slate-400
                    pointer-events-none
                "
                />
            </div>
            {errors.product && (
                <p className="-mt-2 mb-3 text-sm text-red-500">
                    {errors.product}
                </p>
            )}

            <Button type="submit" className="mt-4 w-full rounded-xl bg-gradient-to-r from-sky-500 to-[#0D418C] py-3 text-white font-semibold shadow-lg hover:scale-[1.01] hover:shadow-xl transition-all">
                <FaPlusCircle className="mr-2" /> Agregar Cliente
            </Button>

            <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                Todos los datos son almacenados de forma segura siguiendo buenas prácticas
                de gestión de información.
            </p>
            {errors.submit && (
                <p className="mt-4 text-sm text-red-500">{errors.submit}</p>
            )}
        </form>
    );
};
