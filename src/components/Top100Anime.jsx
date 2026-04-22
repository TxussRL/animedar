import { useEffect, useState } from "react";

function TopCard({ anime, rank }) {
    const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "/hero-bg.png";
    const title = anime.title || "Sin titulo";
    const score = anime.score;

    return (
        <article className="group animate-in fade-in slide-in-from-bottom-3 duration-500 overflow-hidden rounded-2xl border border-slate-700/60 bg-[#132130] transition-all hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/15">
            <div className="relative aspect-[3/4] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <span className="absolute left-2 top-2 rounded-lg border border-cyan-400/40 bg-[#0b1722]/80 px-2 py-1 text-xs font-bold text-cyan-200 backdrop-blur">
                    #{rank}
                </span>

                {typeof score === "number" && (
                    <span className="absolute right-2 top-2 rounded-lg border border-amber-400/30 bg-black/45 px-2 py-1 text-xs font-semibold text-amber-300 backdrop-blur">
                        {score.toFixed(1)}
                    </span>
                )}
            </div>

            <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-white">{title}</h3>
            </div>
        </article>
    );
}

function TopCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-[#132130]">
            <div className="aspect-[3/4] animate-pulse bg-slate-800" />
            <div className="p-3">
                <div className="h-3 w-4/5 animate-pulse rounded bg-slate-700" />
            </div>
        </div>
    );
}

async function fetchWithRetry(url, retries = 2) {
    let lastError = null;

    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            const response = await fetch(url, { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const json = await response.json();
            return Array.isArray(json?.data) ? json.data : [];
        } catch (error) {
            lastError = error;
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
            }
        }
    }

    throw lastError || new Error("Error al cargar top anime");
}

export default function Top100Anime() {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const [topAnime, setTopAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchTop100 = async () => {
            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                }

                const collected = [];

                for (let page = 1; page <= 4; page += 1) {
                    let pageData = [];

                    try {
                        pageData = await fetchWithRetry(`${API_BASE}/api/top/anime?page=${page}&limit=25`);
                    } catch {
                        pageData = await fetchWithRetry(`${API_BASE}/api/trending/anime?page=${page}&limit=25`);
                    }

                    collected.push(...pageData);
                }

                const uniqueById = [];
                const seenIds = new Set();
                for (const anime of collected) {
                    if (!seenIds.has(anime.mal_id)) {
                        seenIds.add(anime.mal_id);
                        uniqueById.push(anime);
                    }
                }

                if (isMounted) {
                    setTopAnime(uniqueById.slice(0, 100));
                }
            } catch (err) {
                if (isMounted) {
                    setTopAnime([]);
                    setError(err.message || "Error al cargar el Top 100");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTop100();

        return () => {
            isMounted = false;
        };
    }, [API_BASE]);

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0f1923] px-4 pb-16 pt-28 md:px-8">
            <div className="pointer-events-none absolute left-12 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="relative mx-auto max-w-[1500px]">
                <header className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">Ranking Global</p>
                    <h1 className="text-3xl font-extrabold text-white md:text-4xl">Top 100 de anime</h1>
                    <p className="mt-2 max-w-2xl text-slate-300/80">Los 100 animes mas populares para explorar y guardar en tu lista.</p>
                </header>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                        {Array.from({ length: 18 }).map((_, index) => (
                            <TopCardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                        {topAnime.map((anime, index) => (
                            <TopCard key={anime.mal_id} anime={anime} rank={index + 1} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
