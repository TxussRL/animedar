import { useEffect, useRef, useState } from "react";
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
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <svg
                    className="w-4 h-4 fill-yellow-400"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Z" />
                </svg>

                <span className="font-semibold">
                    {anime.averageScore ?? anime.meanScore ?? "?"}%
                </span>
            </div>
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
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    let observer = useRef();
    const navigate = useNavigate();

    // FETCH DATA
    const loadAnime = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/top/anime?page=${page}&perPage=25`
        );

        const json = await res.json();

        setTopAnime((prev) => [...prev, ...json.data]);
        setHasMore(json.hasNextPage);
        setLoading(false);
    };

    useEffect(() => {
        loadAnime();
    }, [page]);


    const lastAnimeRef = (node) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    };

    return (
        <section className="min-h-screen bg-[#0f1923] p-8 mt-12">
            <h1 className="text-white text-4xl font-black mb-8">
                Top Anime
            </h1>

            <div className="flex flex-col gap-3">
                {topAnime.map((anime, index) => {
                    const isLast = index === topAnime.length - 1;

                    return (
                        <div
                            key={anime.id}
                            ref={isLast ? lastAnimeRef : null}
                        >
                            <RowCard
                                anime={anime}
                                rank={index + 1}
                                onClick={() => navigate(`/anime/${anime.id}`)}
                            />
                        </div>
                    );
                })}
            </div>

            {loading && (
                <p className="text-center text-white mt-6">
                    Cargando más...
                </p>
            )}
        </section>
    );
}