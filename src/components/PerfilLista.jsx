import { useEffect, useState } from "react";
import clsx from "clsx";

const STATUS_LABELS = {
    all: "Todos",
    watching: "Watching",
    completed: "Completed",
    plan_to_watch: "Plan to Watch",
    paused: "Paused",
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
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/lista/${usuario.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const data = await res.json();
                setUser(data.user);
                setAnimes(data.list);

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

    const filtered =
        filter === "all"
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

            {/* HEADER */}
            <div className="w-full h-[180px] sm:h-[220px] bg-gradient-to-b from-[#26354a] to-[#0B0F1A] flex items-end px-4 sm:px-8 pb-3">
                <div className="flex items-center gap-4 sm:gap-6">
                    <img
                        src={
                            user.imatge_perfil
                                ? `${import.meta.env.VITE_API_URL}${user.imatge_perfil}`
                                : "https://static.vecteezy.com/system/resources/thumbnails/036/885/313/small/blue-profile-icon-free-png.png"
                        }
                        alt={user.nom_usuari}
                        className="rounded-full w-20 h-20 sm:w-28 sm:h-28 border-4 border-[#283a4f] object-cover"
                    />
                    <h1 className="text-xl sm:text-3xl font-bold text-white">
                        {user.nom_usuari}
                    </h1>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="flex flex-col md:flex-row px-4 md:px-8 py-6 gap-6">

                {/* SIDEBAR */}
                <aside className="w-full md:w-[220px] bg-[#1a2533] rounded-2xl p-4 sm:p-6 text-white/80 shadow flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">

                    <div className="font-bold mb-2 text-white text-lg hidden md:block">
                        Listas
                    </div>

                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={clsx(
                                "flex justify-between items-center gap-4 px-3 py-2 rounded-md whitespace-nowrap md:whitespace-normal w-full",
                                filter === key
                                    ? "bg-[#01c6e5]/30 text-[#01c6e5] font-bold"
                                    : "hover:bg-[#293852]"
                            )}
                        >
                            <span>{label}</span>
                            <span className="text-xs text-slate-300">
                                {counts[key] || 0}
                            </span>
                        </button>
                    ))}
                </aside>

                {/* CONTENT */}
                <main className="flex-1">
                    <h2 className="text-xl sm:text-2xl text-white font-bold mb-4">
                        {STATUS_LABELS[filter]} ({filtered.length})
                    </h2>

                    {filtered.length === 0 ? (
                        <div className="text-slate-400 p-8">
                            No hay animes en esta lista.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">

                            {filtered.map((anime) => (
                                <div
                                    key={anime.id_anime}
                                    onClick={() =>
                                        window.location.assign(`/anime/${anime.id_anime}`)
                                    }
                                    className="bg-[#0B0F1A] rounded-xl p-2 hover:bg-[#1a2a3b] shadow cursor-pointer flex flex-col items-center transition"
                                >

                                    {/* IMAGEN FIX RESPONSIVE */}
                                    <img
                                        src={anime.imatge}
                                        alt={anime.titol}
                                        className="rounded-lg mb-2 w-full aspect-[2/3] object-cover"
                                    />

                                    <p className="text-white font-semibold text-xs text-center truncate w-full">
                                        {anime.titol}
                                    </p>

                                    <div className="flex flex-col text-[11px] text-slate-400 mt-1 w-full items-center">
                                        <span>
                                            Estado:{" "}
                                            <span className="capitalize">
                                                {STATUS_LABELS[anime.estat]}
                                            </span>
                                        </span>

                                        {anime.valoracio && (
                                            <span>Valoración: {anime.valoracio}</span>
                                        )}

                                        {anime.favorit && (
                                            <span className="text-yellow-400 font-bold">
                                                ★ Favorito
                                            </span>
                                        )}
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