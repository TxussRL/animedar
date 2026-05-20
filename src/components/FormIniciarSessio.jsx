import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin, user }) {
    const [correu, setCorreu] = useState("");
    const [contrasenya, setContrasenya] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correu, contrasenya }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Error en el login");
                return;
            }

            onLogin(data.token, data.user);
            navigate("/");
        } catch (error) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-[#111d2a]/90 p-8 shadow-2xl">
            <h2 className="text-3xl font-extrabold text-white text-center mb-2">
                Iniciar sesión
            </h2>
            <p className="text-sm text-slate-400 text-center mb-6">
                Accede para guardar tu lista y explorar.
            </p>

            {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Correo
                    </label>
                    <input
                        type="email"
                        value={correu}
                        onChange={(e) => setCorreu(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-4 py-2.5 text-white outline-none focus:border-cyan-500/60"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={contrasenya}
                        onChange={(e) => setContrasenya(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-4 py-2.5 text-white outline-none focus:border-cyan-500/60"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 py-2.5 font-semibold hover:bg-cyan-500/30 hover:border-cyan-400/60 transition disabled:opacity-60"
                >
                    {loading ? "Cargando..." : "Iniciar sesión"}
                </button>
                <p className="text-center text-sm text-slate-400 mt-2">
                    ¿Has olvidado la contraseña?{" "}
                    <a href="/auth/forgot-password" className="text-cyan-300 hover:text-cyan-200">
                        Recuperar
                    </a>
                </p>
                <p className="text-center text-sm text-slate-400 mt-4">
                    ¿No tienes cuenta?{" "}
                    <a href="/auth/register" className="text-cyan-300 hover:text-cyan-200">
                        Regístrate
                    </a>
                </p>
            </form>
        </div>
    );
}