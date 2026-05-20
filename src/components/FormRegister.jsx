import { useState } from "react";

export default function Register() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);


    const isStrongPassword = (pass) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isStrongPassword(password)) {
            alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
            return;
        }

        if (password !== confirm) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const usuario = { nom_usuari: nom, correu: email, contrasenya: password };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario),
            });

            const data = await res.json();
            if (res.ok) setSent(true);
            setMessage(data.message);
        } catch (error) {
            console.log(error);
        }
    };

    if (sent) {
        return (
            <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-[#111d2a]/90 p-8 text-white shadow-2xl">
                <h2 className="text-2xl font-bold mb-2">📧 Revisa tu correo</h2>
                <p className="text-slate-300">
                    Hemos enviado un enlace de verificación a <strong>{email}</strong>
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-[#111d2a]/90 p-8 shadow-2xl">
            <h2 className="text-3xl font-extrabold text-white text-center mb-2">
                Registro
            </h2>
            <p className="text-sm text-slate-400 text-center mb-6">
                Crea tu cuenta para guardar y seguir animes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Usuario
                    </label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-4 py-2.5 text-white outline-none focus:border-cyan-500/60"
                        required
                    />
                </div>

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

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-4 py-2.5 text-white outline-none focus:border-cyan-500/60"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-4 py-2.5 text-white outline-none focus:border-cyan-500/60"
                        required
                    />
                </div>

                {message && (
                    <p className="text-center text-sm text-red-300">{message}</p>
                )}

                <button
                    type="submit"
                    className="w-full rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 py-2.5 font-semibold hover:bg-cyan-500/30 hover:border-cyan-400/60 transition"
                >
                    Registrarse
                </button>
                <p className="text-center text-sm text-slate-400 mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <a href="/auth/login" className="text-cyan-300 hover:text-cyan-200">
                        Inicia sesión
                    </a>
                </p>
            </form>
        </div>
    );
}