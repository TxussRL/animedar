import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const [contrasenya, setContrasenya] = useState("");
    const [confirmarContrasenya, setConfirmarContrasenya] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    const isStrongPassword = (pass) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);
    };

    useEffect(() => {
        const verify = async () => {
            const tokenParam = searchParams.get("token");
            if (!tokenParam) {
                setStatus("error");
                setMessage("Token no proporcionat");
                return;
            }

            setToken(tokenParam);
            setStatus("form");
        };

        verify();
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isStrongPassword(contrasenya)) {
            setMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
            return;
        }

        if (contrasenya !== confirmarContrasenya) {
            setMessage("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, contrasenya }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message);
            } else {
                setStatus("error");
                setMessage(data.message || "Error al cambiar la contraseña");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-[#111d2a]/90 border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
            {status === "loading" && (
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-cyan-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-300 font-medium">Verificando token...</p>
                </div>
            )}

            {status === "form" && (
                <div>
                    <h2 className="text-3xl font-extrabold text-white text-center mb-2">
                        Cambiar contraseña
                    </h2>
                    <p className="text-sm text-slate-400 text-center mb-6">
                        Ingresa tu nueva contraseña.
                    </p>

                    {message && (
                        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                value={contrasenya}
                                onChange={(e) => setContrasenya(e.target.value)}
                                className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-4 py-2.5 text-white outline-none focus:border-cyan-500/60"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Confirmar contraseña
                            </label>
                            <input
                                type="password"
                                value={confirmarContrasenya}
                                onChange={(e) => setConfirmarContrasenya(e.target.value)}
                                className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-4 py-2.5 text-white outline-none focus:border-cyan-500/60"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 py-2.5 font-semibold hover:bg-cyan-500/30 hover:border-cyan-400/60 transition disabled:opacity-60"
                        >
                            {loading ? "Cambiando..." : "Cambiar contraseña"}
                        </button>
                    </form>
                </div>
            )}

            {status === "success" && (
                <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 text-center">Contraseña cambiada</h2>
                    <p className="text-slate-400 mb-6 text-center">{message}</p>
                    <Link
                        to="/auth/login"
                        className="inline-block w-full px-6 py-3 text-white bg-cyan-500/40 border border-cyan-500/60 hover:bg-cyan-500/50 rounded-lg font-medium transition-colors text-center"
                    >
                        Ir al login
                    </Link>
                </div>
            )}

            {status === "error" && (
                <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 text-center">Error</h2>
                    <p className="text-slate-400 mb-6 text-center">{message}</p>
                    <Link
                        to="/auth/login"
                        className="inline-block w-full px-6 py-3 text-cyan-300 bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 rounded-lg font-medium transition-colors text-center"
                    >
                        Volver al login
                    </Link>
                </div>
            )}
        </div>
    );
}
