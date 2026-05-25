import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correu: email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message);
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.message || "Error al enviar el correo");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-[#111d2a]/90 p-8 shadow-2xl">
            {status === null && (
                <>
                    <h2 className="text-3xl font-extrabold text-white text-center mb-2">
                        Recuperar contraseña
                    </h2>
                    <p className="text-sm text-slate-400 text-center mb-6">
                        Ingresa tu correo para recibir instrucciones de recuperación.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Correo
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-4 py-2.5 text-white outline-none focus:border-cyan-500/60"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 py-2.5 font-semibold hover:bg-cyan-500/30 hover:border-cyan-400/60 transition disabled:opacity-60"
                        >
                            {loading ? "Enviando..." : "Enviar instrucciones"}
                        </button>

                        <p className="text-center text-sm text-slate-400 mt-4">
                            <Link to="/auth/login" className="text-cyan-300 hover:text-cyan-200">
                                Volver al login
                            </Link>
                        </p>
                    </form>
                </>
            )}

            {status === "success" && (
                <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 text-center">Correo enviado</h2>
                    <p className="text-slate-400 mb-6 text-center">{message}</p>
                    <Link
                        to="/auth/login"
                        className="inline-block w-full px-6 py-3 text-white bg-cyan-500/40 border border-cyan-500/60 hover:bg-cyan-500/50 rounded-lg font-medium transition-colors text-center"
                    >
                        Volver al login
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
                    <button
                        onClick={() => setStatus(null)}
                        className="inline-block w-full px-6 py-3 text-cyan-300 bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 rounded-lg font-medium transition-colors text-center"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            )}
        </div>
    );
}
