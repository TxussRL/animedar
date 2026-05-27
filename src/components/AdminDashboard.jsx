import { useEffect, useState } from "react";

export default function AdminDashboard({ token }) {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const data = await res.json();
                    setError(data.message || "No autorizado");
                    return;
                }

                const data = await res.json();
                setStats(data);
            } catch (err) {
                setError("Error al cargar estadísticas");
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, [token]);

    if (loading) {
        return <div className="px-6 py-10 text-slate-300">Cargando estadísticas...</div>;
    }

    if (error) {
        return <div className="px-6 py-10 text-red-300">{error}</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 mt-10">
            <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
            <p className="text-slate-400 mb-8">Aquí puedes ver las métricas principales de la aplicación.</p>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-3xl border border-slate-700/60 bg-[#111f2c]/95 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 mb-3">Usuarios totales</p>
                    <p className="text-4xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="rounded-3xl border border-slate-700/60 bg-[#111f2c]/95 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 mb-3">Usuarios verificados</p>
                    <p className="text-4xl font-bold text-white">{stats.verifiedUsers}</p>
                </div>
                <div className="rounded-3xl border border-slate-700/60 bg-[#111f2c]/95 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 mb-3">Administradores</p>
                    <p className="text-4xl font-bold text-white">{stats.adminUsers}</p>
                </div>
                <div className="rounded-3xl border border-slate-700/60 bg-[#111f2c]/95 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 mb-3">Entradas en listas</p>
                    <p className="text-4xl font-bold text-white">{stats.totalListItems}</p>
                </div>
                <div className="rounded-3xl border border-slate-700/60 bg-[#111f2c]/95 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 mb-3">Animes guardados</p>
                    <p className="text-4xl font-bold text-white">{stats.totalAnimes}</p>
                </div>
            </div>
        </div>
    );
}
