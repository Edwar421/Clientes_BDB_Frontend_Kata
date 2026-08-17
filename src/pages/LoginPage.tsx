import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../../logo.png";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
            navigate("/dashboard");
        } catch {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D418C] to-[#1a5bb8] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* LOGO Y HEADER */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img
                            src={logo}
                            alt="Banco de Bogotá"
                            className="h-12 w-auto"
                        />
                        <div>
                            <h1 className="text-white font-bold text-2xl">
                                Clientes BDB
                            </h1>
                            <p className="text-sky-200 text-sm">
                                Gestión de Clientes
                            </p>
                        </div>
                    </div>
                </div>

                {/* TARJETA DE LOGIN */}
                <div
                    className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/10
                    backdrop-blur-xl
                    shadow-2xl
                    dark:bg-gray-800/50
                    "
                >
                    {/* CABECERA */}
                    <div className="border-b border-white/20 px-8 py-6">
                        <h2
                            className="
                            text-3xl
                            font-bold
                            text-white
                            "
                        >
                            Iniciar Sesión
                        </h2>
                        <p
                            className="
                            mt-2
                            text-sm
                            text-sky-100
                            "
                        >
                            Accede a tu cuenta de Clientes BDB
                        </p>
                    </div>

                    {/* CONTENIDO DEL FORMULARIO */}
                    <div className="px-8 py-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* USERNAME */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-white/90 mb-2"
                                >
                                    Usuario
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="admin o asesor"
                                    className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-white/20
                                    bg-white/10
                                    px-4
                                    py-3
                                    text-white
                                    placeholder-white/50
                                    backdrop-blur
                                    transition-colors
                                    focus:border-sky-400
                                    focus:bg-white/20
                                    focus:outline-none
                                    "
                                />
                            </div>

                            {/* CONTRASEÑA */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-white/90 mb-2"
                                >
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        placeholder="••••••••"
                                        className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-white/20
                                        bg-white/10
                                        px-4
                                        py-3
                                        text-white
                                        placeholder-white/50
                                        backdrop-blur
                                        transition-colors
                                        focus:border-sky-400
                                        focus:bg-white/20
                                        focus:outline-none
                                        pr-12
                                        "
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-white/70
                                        hover:text-white
                                        transition-colors
                                        "
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                            </div>

                            {/* MENSAJE DE ERROR */}
                            {error && (
                                <div
                                    className="
                                    rounded-lg
                                    bg-red-500/20
                                    border
                                    border-red-500/50
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-200
                                    "
                                >
                                    {error}
                                </div>
                            )}

                            {/* BOTÓN DE LOGIN */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="
                                w-full
                                rounded-lg
                                bg-gradient-to-r
                                from-sky-400
                                to-sky-500
                                px-4
                                py-3
                                font-semibold
                                text-[#0D418C]
                                transition-all
                                hover:from-sky-300
                                hover:to-sky-400
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                shadow-lg
                                shadow-sky-500/50
                                "
                            >
                                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </button>

                            {/* NOTA INFORMATIVA */}
                            <div
                                className="
                                rounded-lg
                                bg-sky-500/20
                                border
                                border-sky-400/50
                                px-4
                                py-3
                                text-xs
                                text-sky-100
                                "
                            >
                                <p className="font-semibold mb-1">
                                    Credenciales de prueba:
                                </p>
                                <p>ADMIN: admin / admin123</p>
                                <p>ASESOR: asesor / asesor123</p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* PIE DE PÁGINA */}
                <div className="mt-8 text-center text-white/70">
                    <p className="text-sm">
                        © 2024 Banco de Bogotá. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};
