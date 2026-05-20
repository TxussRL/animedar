import { useEffect, useState } from "react";
import clsx from "clsx"; // instala clsx (npm i clsx) para clases dinámicas

const STATUS_LABELS = {
    all: "Todos",
    watching: "Watching",
    completed: "Completed",
    plan_to_watch: "Plan to Watch",
    dropped: "Dropped",
};

export default function PerfilLista({ usuario }) {
    const [user, setUser] = useState(null);
    const [animes, setAnimes] = useState([]);
    const [filter, setFilter] = useState("all");
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchList() {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lista/${usuario.id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                setUser(data.user);
                setAnimes(data.list);

                // Contadores por estado
                const summary = data.list.reduce(
                    (acc, anime) => {
                        acc[anime.estat] = (acc[anime.estat] || 0) + 1;
                        acc.all = (acc.all || 0) + 1;
                        return acc;
                    },
                    { all: 0 }
                );
                setCounts(summary);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchList();
    }, [usuario.id]);

    const filtered = filter === "all"
        ? animes
        : animes.filter((a) => a.estat === filter);

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    return (
        <div className="bg-[#121827] min-h-screen">
            {/* Banner / Profile header */}
            <div className="w-full h-[220px] bg-gradient-to-b from-[#26354a] to-[#0B0F1A] flex items-end p-8 pb-2">
                <div className="flex items-end gap-6">
                    <img
                        src={user.imatge_perfil ? `${import.meta.env.VITE_API_URL}${user.imatge_perfil}` : "https://static.vecteezy.com/system/resources/thumbnails/036/885/313/small/blue-profile-icon-free-png.png"}
                        alt={user.nom_usuari}
                        className="rounded-full w-28 h-28 border-4 border-[#283a4f] object-cover"
                        style={{ boxShadow: "0 2px 8px #000A" }}
                    />
                    <h1 className="text-3xl font-bold text-white drop-shadow">{user.nom_usuari}</h1>
                </div>
            </div>

            <div className="flex px-8 py-8 gap-8">
                {/* Barra lateral de filtros */}
                <aside className="bg-[#1a2533] rounded-2xl min-w-[200px] p-6 text-white/80 shadow flex flex-col gap-1">
                    <div className="font-bold mb-4 text-white text-lg">Listas</div>
                    {Object.entries({
                        all: STATUS_LABELS["all"],
                        watching: "Watching",
                        completed: "Completed",
                        plan_to_watch: "Plan to Watch",
                        dropped: "Dropped",
                    }).map(([key, label]) => (
                        <button
                            key={key}
                            className={clsx(
                                "text-left w-full px-1 py-1 rounded flex justify-between items-center gap-4",
                                filter === key ? "bg-[#01c6e5]/30 text-[#01c6e5] font-bold" : "hover:bg-[#293852]"
                            )}
                            onClick={() => setFilter(key)}
                        >
                            {label}
                            <span className={clsx(
                                "ml-auto text-xs font-bold",
                                filter === key ? "text-cyan-300" : "text-slate-300"
                            )}>
                                {counts[key] || 0}
                            </span>
                        </button>
                    ))}
                </aside>

                {/* Lista de animes */}
                <main className="flex-1">
                    <h2 className="text-2xl text-white font-bold mb-6">
                        {STATUS_LABELS[filter] || "Lista"} ({filtered.length})
                    </h2>
                    {filtered.length === 0 ? (
                        <div className="text-slate-400 p-12">No hay animes en esta lista.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {filtered.map((anime) => (
                                <div
                                    key={anime.id_anime}
                                    className="bg-[#0B0F1A] rounded-xl p-2 hover:bg-[#1a2a3b] shadow cursor-pointer flex flex-col items-center transition"
                                    onClick={() => window.location.assign(`/anime/${anime.id_anime}`)}
                                >
                                    <img
                                        src={anime.imatge}
                                        alt={anime.titol}
                                        className="rounded-lg mb-2 w-full h-36 object-cover"
                                    />
                                    <p className="text-white font-semibold text-xs text-center truncate w-full">{anime.titol}</p>
                                    <div className="flex flex-col text-[11px] text-slate-400 mt-1 w-full items-center">
                                        <span>Estado: <span className="capitalize">{STATUS_LABELS[anime.estat]}</span></span>
                                        {anime.valoracio && <span>Valoración: {anime.valoracio}</span>}
                                        {anime.favorit && <span className="text-yellow-400 font-bold">★ Favorito</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}