import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin, user }) {
    const [correu, setCorreu] = useState("");
    const [contrasenya, setContrasenya] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Si ya está logueado, redirige a inicio
    if (user) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ correu, contrasenya }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Error en el login");
                return;
            }

            // Llama a la función onLogin del App
            onLogin(data.token, data.user);
            navigate("/");
        } catch (error) {
            setError("Error de conexión con el servidor");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">
                    Iniciar sesión
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={correu}
                            onChange={(e) => setCorreu(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={contrasenya}
                            onChange={(e) => setContrasenya(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
                    >
                        {loading ? "Cargando..." : "Iniciar sesión"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;