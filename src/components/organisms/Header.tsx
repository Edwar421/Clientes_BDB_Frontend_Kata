import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FaClipboardList,
    FaPlusCircle,
    FaSignOutAlt,
    FaChevronDown,
    FaUserShield,
} from "react-icons/fa";

import { ThemeToggle } from "../atoms/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import logo from "../../../logo.png";

export const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { hasPermission } = usePermissions();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const canViewRegister = hasPermission("create_customers");
    const canViewAudit = hasPermission("view_audit");

    return (
        <header className="sticky top-0 z-50 w-full bg-[#0D418C]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 h-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-4">

                {/* Mobile: Logo centrado + toggle arriba */}
                <div className="flex items-center justify-between md:hidden mb-2">
                    <div className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="Banco de Bogotá"
                            className="h-8 w-auto"
                        />
                        <div>
                            <h1 className="text-white font-bold text-sm">
                                Clientes BDB
                            </h1>
                            <p className="text-sky-200 text-xs leading-tight">
                                Gestión de Clientes
                            </p>
                        </div>
                    </div>
                    <div className="rounded-full bg-white/10 px-2 py-1.5 flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="text-white hover:text-sky-200 transition-colors"
                        >
                            <FaSignOutAlt size={16} />
                        </button>
                    </div>
                </div>

                {/* Mobile: Navegación horizontal */}
                <div className="flex items-center justify-center gap-2 md:hidden pb-1">
                    <Link
                        to="/dashboard"
                        className={`
                            flex items-center justify-center gap-1.5
                            rounded-lg
                            px-3 py-2
                            text-xs sm:text-sm
                            transition-all
                            ${location.pathname === "/dashboard"
                                ? "bg-white text-[#0D418C] font-semibold"
                                : "text-white bg-white/10"
                            }
                        `}
                    >
                        <FaClipboardList />
                        Lista Clientes
                    </Link>

                    {canViewRegister && (
                        <Link
                            to="/register"
                            className={`
                                flex items-center justify-center gap-1.5
                                rounded-lg
                                px-3 py-2
                                text-xs sm:text-sm
                                transition-all
                                ${location.pathname === "/register"
                                    ? "bg-sky-500 text-white font-semibold"
                                    : "text-white bg-white/10"
                                }
                            `}
                        >
                            <FaPlusCircle />
                            Registrar
                        </Link>
                    )}

                    {canViewAudit && (
                        <Link
                            to="/audit"
                            className={`
                                flex items-center justify-center gap-1.5
                                rounded-lg
                                px-3 py-2
                                text-xs sm:text-sm
                                transition-all
                                ${location.pathname === "/audit"
                                    ? "bg-amber-400 text-[#0D418C] font-semibold"
                                    : "text-white bg-white/10"
                                }
                            `}
                        >
                            <FaUserShield />
                            Auditoría
                        </Link>
                    )}
                </div>

                {/* Desktop: Layout original */}
                <div className="hidden md:flex md:items-center md:justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="Banco de Bogotá"
                            className="h-10 w-auto"
                        />
                        <div>
                            <h1 className="text-white font-bold text-lg">
                                Clientes BDB
                            </h1>
                            <p className="text-sky-200 text-xs leading-tight">
                                Gestión de Clientes
                            </p>
                        </div>
                    </div>

                    {/* Navegación */}
                    <div className="flex items-center gap-4 lg:gap-6">

                        <Link
                            to="/dashboard"
                            className={`
                                flex items-center justify-center gap-2
                                rounded-lg
                                px-4 py-2.5
                                text-sm
                                transition-all
                                whitespace-nowrap
                                ${location.pathname === "/dashboard"
                                    ? "bg-white text-[#0D418C] font-semibold"
                                    : "text-white hover:bg-white/10"
                                }
                            `}
                        >
                            <FaClipboardList />
                            Lista Clientes
                        </Link>

                        {canViewRegister && (
                            <Link
                                to="/register"
                                className={`
                                    flex items-center justify-center gap-2
                                    rounded-lg
                                    px-4 py-2.5
                                    text-sm
                                    transition-all
                                    whitespace-nowrap
                                    ${location.pathname === "/register"
                                        ? "bg-sky-500 text-white font-semibold"
                                        : "text-white hover:bg-white/10"
                                    }
                                `}
                            >
                                <FaPlusCircle />
                                Registrar Cliente
                            </Link>
                        )}

                        {canViewAudit && (
                            <Link
                                to="/audit"
                                className={`
                                    flex items-center justify-center gap-2
                                    rounded-lg
                                    px-4 py-2.5
                                    text-sm
                                    transition-all
                                    whitespace-nowrap
                                    ${location.pathname === "/audit"
                                        ? "bg-amber-400 text-[#0D418C] font-semibold"
                                        : "text-white hover:bg-white/10"
                                    }
                                `}
                            >
                                <FaUserShield />
                                Auditoría
                            </Link>
                        )}

                        <div className="rounded-full bg-white/10 px-3 py-2 flex items-center">
                            <ThemeToggle />
                        </div>

                        {/* MENÚ DE USUARIO */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="
                                    flex items-center justify-center gap-2
                                    rounded-lg
                                    px-4 py-2.5
                                    text-sm
                                    text-white
                                    bg-white/10
                                    hover:bg-white/20
                                    transition-all
                                    whitespace-nowrap
                                "
                            >
                                <div className="text-left">
                                    <div className="text-xs font-semibold">
                                        {user?.name}
                                    </div>
                                    <div className="text-xs text-sky-200">
                                        {user?.role}
                                    </div>
                                </div>
                                <FaChevronDown
                                    size={12}
                                    className={`transition-transform ${
                                        showUserMenu ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* DROPDOWN */}
                            {showUserMenu && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        mt-2
                                        w-48
                                        rounded-lg
                                        bg-white
                                        dark:bg-gray-800
                                        shadow-lg
                                        border
                                        border-gray-200
                                        dark:border-gray-700
                                        overflow-hidden
                                        z-50
                                    "
                                >
                                    {/* INFO USUARIO */}
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {user?.email}
                                        </p>
                                        <div className="mt-2">
                                            <span
                                                className="
                                                    inline-block
                                                    px-2
                                                    py-1
                                                    rounded
                                                    text-xs
                                                    font-semibold
                                                    bg-blue-100
                                                    text-blue-800
                                                    dark:bg-blue-900
                                                    dark:text-blue-200
                                                "
                                            >
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* LOGOUT */}
                                    <button
                                        onClick={handleLogout}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-2
                                            px-4
                                            py-3
                                            text-left
                                            text-sm
                                            text-red-600
                                            dark:text-red-400
                                            hover:bg-red-50
                                            dark:hover:bg-red-900/20
                                            transition-colors
                                        "
                                    >
                                        <FaSignOutAlt size={14} />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </div>
        </header>
    );
};