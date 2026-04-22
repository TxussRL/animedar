import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/FormIniciarSessio";
import Register from "../components/FormRegister";
import VerifyEmail from "../components/VerifyEmail";

function AuthRoutes({ onLogin, user }) {
    return (
        <Routes>
            <Route index element={<Navigate to="login" replace />} />
            <Route
                path="login"
                element={<div className="flex justify-center items-center min-h-screen pt-20"><Login onLogin={onLogin} user={user} /></div>}
            />
            <Route path="register" element={<div className="flex justify-center items-center min-h-screen pt-20"><Register /></div>} />
            <Route path="verify-email" element={<div className="flex justify-center items-center min-h-screen pt-20"><VerifyEmail /></div>} />
            <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
    );
}

export default AuthRoutes;