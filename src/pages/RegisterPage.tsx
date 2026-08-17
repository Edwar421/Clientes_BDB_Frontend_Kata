import React from "react";
import { useNavigate } from "react-router-dom";

import { TaskForm } from "../components/molecules/CustomerForm";
import { Header } from "../components/organisms/Header";

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />

            <section className="min-h-[calc(100vh-80px)] px-6 py-10">
                <div className="mx-auto max-w-7xl">

                    <div className="grid gap-10 lg:grid-cols-2 items-center">

                        {/* PANEL INFORMATIVO */}
                        <div className="hidden lg:flex flex-col justify-center text-white">

                            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                                Banco de Bogotá
                            </span>

                            <h1 className="mb-6 text-5xl font-bold leading-tight">
                                Registro de Clientes
                            </h1>

                            <p className="mb-10 text-xl text-sky-100 leading-relaxed">
                                Gestiona la información de los clientes de forma
                                segura, rápida y centralizada mediante una
                                plataforma moderna inspirada en los estándares
                                digitales del Banco de Bogotá.
                            </p>

                            <div className="space-y-5">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
                                        ✓
                                    </div>
                                    <span className="text-lg">
                                        Registro seguro
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
                                        ✓
                                    </div>
                                    <span className="text-lg">
                                        Validación automática de datos
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
                                        ✓
                                    </div>
                                    <span className="text-lg">
                                        Información centralizada
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
                                        ✓
                                    </div>
                                    <span className="text-lg">
                                        Experiencia bancaria moderna
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* FORMULARIO */}
                        <div className="flex justify-center">

                            <div
                                className="
                                w-full
                                max-w-xl
                                overflow-hidden
                                rounded-3xl
                                border
                                border-slate-100
                                bg-white
                                shadow-[0_20px_60px_rgba(13,65,140,0.25)]
                                dark:border-gray-700
                                dark:bg-gray-800
                                "
                            >
                                {/* CABECERA */}
                                <div className="border-b border-slate-200 px-8 py-6 dark:border-gray-700">

                                    <h2
                                        className="
                                        mt-2
                                        text-3xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                        "
                                    >
                                        Registrar cliente
                                    </h2>

                                    <p
                                        className="
                                        mt-2
                                        text-sm
                                        text-slate-600
                                        dark:text-gray-300
                                        "
                                    >
                                        Completa la información para registrar
                                        un nuevo cliente.
                                    </p>
                                </div>

                                {/* FORMULARIO */}
                                <TaskForm
                                    onCustomerCreated={() => undefined}
                                    onSuccess={() => navigate("/dashboard")}
                                />
                            </div>

                        </div>

                    </div>

                </div>
            </section>
        </>
    );
};