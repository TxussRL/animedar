import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

let colors = [
    { bg: "bg-red-500/15", text: "text-red-300" },
    { bg: "bg-blue-500/15", text: "text-blue-300" },
    { bg: "bg-green-500/15", text: "text-green-300" },
    { bg: "bg-yellow-500/15", text: "text-yellow-300" },
    { bg: "bg-purple-500/15", text: "text-purple-300" },
    { bg: "bg-pink-500/15", text: "text-pink-300" },
    { bg: "bg-cyan-500/15", text: "text-cyan-300" },
    { bg: "bg-orange-500/15", text: "text-orange-300" }
];

function RowCard({ anime, rank, onClick }) {
    const title = anime.title?.english || anime.title?.romaji || "Sin título";

    return (
    <div
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-xl bg-[#132130] hover:bg-[#1a2a3b] cursor-pointer transition"
    >
        <span className="text-3xl font-black text-cyan-400 w-14">
            #{rank}
        </span>

        <img
            src={anime.coverImage?.large}
            alt={title}
            className="w-16 h-20 object-cover rounded-lg"
        />

        <div className="flex-1">
            <h2 className="text-white font-bold">{title}</h2>

            {/* GENRES */}
            <div className="flex flex-wrap gap-2 mt-3">
                {anime?.genres?.map((gen, index) => {
                    const color = colors[index % colors.length];
                    return (
                        <p
                            key={`${gen}-${index}`}
                            className={`${color?.text} ${color?.bg} py-1 px-3 rounded-3xl text-xs`}
                        >
                            {gen}
                        </p>
                    );
                })}
            </div>

        </div>

        {/* RIGHT PANEL (NUEVO) */}
        <div className="hidden sm:grid grid-cols-3 gap-x-1 gap-y-1 text-xs text-slate-300 min-w-[180px] text-right">

            <div>
            <p className="text-yellow-400 text-sm">
                ⭐ {anime.averageScore ?? anime.meanScore ?? "?"}%
            </p>
                <p className="text-white font-semibold">{anime.popularity?.toLocaleString() ?? "?"} popularidad</p>
            </div>

            <div>
                <p className="text-slate-400">{anime?.format ?? "?"}</p>
                <p className="text-white font-semibold">{anime?.episodes ?? "?"} episodios</p>
            </div>

            <div>
                <p className="text-slate-400">{anime?.season ?? "?"} {anime?.seasonYear ?? "?"}</p>
                <p className="text-white font-semibold">{anime?.status}</p>
            </div>

        </div>
    </div>
);
}

export default function Top100Anime() {
    const [topAnime, setTopAnime] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/top/anime/full`);
            const json = await res.json();
            setTopAnime(json.data);
        }

        fetchData();
    }, []);

    return (
        <section className="min-h-screen bg-[#0f1923] p-8 mt-12">
            <h1 className="text-white text-4xl font-black mb-8">
                Top 100 Anime
            </h1>

            <div className="flex flex-col gap-3">
                {topAnime.map((anime, index) => (
                    <RowCard
                        key={anime.id}
                        anime={anime}
                        rank={index + 1}
                        onClick={() => navigate(`/anime/${anime.id}`)}
                    />
                ))}
            </div>
        </section>
    );
}