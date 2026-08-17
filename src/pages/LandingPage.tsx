import React from "react";
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaChartLine,
    FaShieldAlt,
    FaUsers,
    FaUserShield,
} from "react-icons/fa";
import logo from "../../logo.png";
import { ThemeToggle } from "../components/atoms/ThemeToggle";
import { useAuth } from "../hooks/useAuth";

export const LandingPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <main className="min-h-screen px-6 py-8 md:px-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col">
                <header className="mb-10 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md shadow-xl shadow-black/10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Banco de Bogotá" className="h-10 w-auto" />
                            <div>
                                <p className="text-lg font-bold text-white">Clientes BDB</p>
                                <p className="text-xs text-sky-100">Plataforma de gestión y auditoría</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-white/10 px-3 py-2">
                                <ThemeToggle />
                            </div>

                            {isAuthenticated ? (
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0D418C] transition hover:bg-sky-100"
                                >
                                    Ir al panel
                                    <FaArrowRight />
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0D418C] transition hover:bg-sky-100"
                                >
                                    Iniciar sesión
                                    <FaArrowRight />
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <section className="grid gap-8 lg:grid-cols-2">
                    <article className="flex flex-col justify-center text-white">
                        <span className="mb-4 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                            Banco de Bogotá
                        </span>

                        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                            Gestión de clientes con trazabilidad total
                        </h1>

                        <p className="mt-5 max-w-xl text-base text-sky-100 md:text-lg">
                            Centraliza el registro, edición y seguimiento de clientes en una sola
                            plataforma. Supervisa cambios clave con control de roles y módulo de
                            auditoría para operación segura.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to={isAuthenticated ? "/dashboard" : "/login"}
                                className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-semibold text-[#0D418C] shadow-lg shadow-sky-500/40 transition hover:bg-sky-300"
                            >
                                {isAuthenticated ? "Entrar al dashboard" : "Comenzar ahora"}
                                <FaArrowRight />
                            </Link>

                            {isAuthenticated && user?.role === "ADMIN" && (
                                <Link
                                    to="/audit"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
                                >
                                    Ver auditoría
                                    <FaUserShield />
                                </Link>
                            )}
                        </div>
                    </article>

                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(13,65,140,0.25)] dark:border-slate-700 dark:bg-slate-800 md:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            ¿Qué puedes hacer en la plataforma?
                        </h2>

                        <div className="mt-6 grid gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                                <div className="mb-2 inline-flex rounded-lg bg-[#0D418C] p-2 text-white">
                                    <FaUsers />
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    Gestión de clientes
                                </p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    Registro, actualización y consulta de clientes con validaciones.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                                <div className="mb-2 inline-flex rounded-lg bg-[#0D418C] p-2 text-white">
                                    <FaChartLine />
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    Visualización y reportes
                                </p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    Filtros, estadísticas y exportación en formatos ejecutivos.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                                <div className="mb-2 inline-flex rounded-lg bg-[#0D418C] p-2 text-white">
                                    <FaShieldAlt />
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    Seguridad por roles
                                </p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    Accesos diferenciados para ADMIN y ASESOR con control de permisos.
                                </p>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </main>
    );
};
