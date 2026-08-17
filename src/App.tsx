import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuditPage } from "./pages/AuditPage";
import { LandingPage } from "./pages/LandingPage";

const App: React.FC = () => {
    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.body.setAttribute("data-theme", "dark");
        } else {
            document.body.setAttribute("data-theme", "light");
        }
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <ProtectedRoute>
                                <RegisterPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/audit"
                        element={
                            <ProtectedRoute requiredRoles={["ADMIN"]}>
                                <AuditPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
