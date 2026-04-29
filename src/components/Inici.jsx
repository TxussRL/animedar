import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const genres = ["Acción", "Aventura", "Comedia", "Fantasía", "Drama", "Romance", "Terror", "Ciencia ficción"];

const genreMap = {
    Action: "Acción",
    Adventure: "Aventura",
    Comedy: "Comedia",
    Fantasy: "Fantasía",
    Drama: "Drama",
    Romance: "Romance",
    Horror: "Terror",
    "Sci-Fi": "Ciencia ficción",
    Mystery: "Misterio",
    Thriller: "Thriller",
    Supernatural: "Sobrenatural",
    Sports: "Deportes",
    "Slice of Life": "Recuentos de la vida",
    Music: "Música",
    Suspense: "Suspense",
    "Award Winning": "Premiado",
};

function mapStatus(status) {
    if (status === "Currently Airing") return "En emisión";
    if (status === "Finished Airing") return "Finalizado";
    if (status === "Not yet aired") return "Próximamente";
    return status;
}

function AnimeCard({ anime, onClick }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const title = anime.title;
    const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
    const rating = anime.score;
    const episodes = anime.episodes;
    const status = mapStatus(anime.status);
    const animeGenres = (anime.genres || []).map((g) => genreMap[g.name] || g.name).slice(0, 2);

    return (
        <div
            className="group relative flex flex-col rounded-xl overflow-hidden bg-[#1a2634] border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="relative aspect-[3/4] overflow-hidden">
                {!imageLoaded && <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>}
                <img
                    src={image}
                    alt={title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"
                        } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2634] via-transparent to-transparent opacity-80"></div>

                <div className="absolute top-3 left-3">
                    <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${status === "En emisión"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : status === "Próximamente"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                    >
                        {status}
                    </span>
                </div>

                {rating && (
                    <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-black/40 backdrop-blur-md text-amber-400 border border-amber-500/20">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                )}

                {episodes && (
                    <div className="absolute bottom-3 right-3">
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-black/40 backdrop-blur-md text-slate-300">
                            {episodes} ep.
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors duration-200">
                    {title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                    {animeGenres.map((genre) => (
                        <span
                            key={genre}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/5 text-slate-400 border border-slate-700/50"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AnimeCardSkeleton() {
    return (
        <div className="flex flex-col rounded-xl overflow-hidden bg-[#1a2634] border border-slate-700/50">
            <div className="relative aspect-[3/4] bg-slate-800 animate-pulse"></div>
            <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4"></div>
                <div className="flex gap-1.5">
                    <div className="h-4 w-12 bg-slate-700 rounded-full animate-pulse"></div>
                    <div className="h-4 w-14 bg-slate-700 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export default function Inici() {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const [searchTerm, setSearchTerm] = useState("");
    const [trendingAnime, setTrendingAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const wait = (ms) => new Promise((resolve) => {
            setTimeout(resolve, ms);
        });

        const fetchTopAnime = async () => {
            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                }

                const endpoints = [
                    `${API_BASE}/api/trending/anime?page=1&limit=8`,
                    `${API_BASE}/api/top/anime?page=1&limit=8`,
                ];

                let lastError = null;

                for (const endpoint of endpoints) {
                    for (let attempt = 1; attempt <= 3; attempt += 1) {
                        try {
                            const res = await fetch(endpoint, { cache: "no-store" });
                            if (!res.ok) {
                                throw new Error(`HTTP ${res.status}`);
                            }

                            const json = await res.json();
                            const animeList = Array.isArray(json?.data) ? json.data : [];

                            if (animeList.length > 0) {
                                if (isMounted) {
                                    setTrendingAnime(animeList);
                                }
                                return;
                            }

                            throw new Error("Sin datos disponibles");
                        } catch (err) {
                            lastError = err;
                            if (attempt < 3) {
                                await wait(300 * attempt);
                            }
                        }
                    }
                }

                throw lastError || new Error("Error al obtener animes");
            } catch (err) {
                console.error("Error fetching anime:", err);
                if (isMounted) {
                    setTrendingAnime([]);
                    setError(err.message || "Error al obtener animes");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTopAnime();

        return () => {
            isMounted = false;
        };
    }, [API_BASE]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const term = searchTerm.trim();

        if (!term) {
            navigate("/anime/buscar");
            return;
        }

        navigate(`/anime/buscar?q=${encodeURIComponent(term)}`);
    };

    return (
        <div className="w-full bg-[#0f1923]">
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/hero-bg.png" alt="" className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,black_55%,black_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,black_75%,transparent_100%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923]/60 via-[#0f1923]/40 to-[#0f1923]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f1923]/80 via-transparent to-[#0f1923]/80"></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f1923]"></div>

                <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                        <span className="block">Descubre tu próximo</span>
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            favorito
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300/80 mb-10 font-light max-w-xl mx-auto leading-relaxed">
                        Rastrea, comparte y conecta con otros fans del anime y manga.
                    </p>

                    {/* Buscador: al pulsar Enter redirige a /anime/buscar */}
                    <form className="relative max-w-xl mx-auto mb-8" onSubmit={handleSearchSubmit}>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center bg-[#1a2634]/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 focus-within:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                                <svg className="w-5 h-5 text-slate-500 ml-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar anime, manga o personajes..."
                                    className="w-full px-4 py-4 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>



                </div>

                {/* Explorar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 group select-none pointer-events-none">
                    <span className="text-xs font-medium tracking-widest uppercase">Explorar</span>
                    <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
                        <div className="w-1 h-2.5 bg-current rounded-full animate-bounce"></div>
                    </div>
                </div>
            </section>

            <section id="tendencias" className="relative py-20 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/3 rounded-full blur-[150px]"></div>

                <div className="max-w-[1400px] mx-auto relative">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Tendencias del momento</h2>
                        <button
                            type="button"
                            onClick={() => navigate("/anime/top-100")}
                            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition-all duration-200 hover:bg-cyan-500/20 hover:border-cyan-400/60 cursor-pointer"
                        >
                            Ver top 100
                        </button>
                    </div>

                    {!loading && !error && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                            {trendingAnime.map((anime) => (
                                <AnimeCard key={anime.mal_id} anime={anime} onClick={() => navigate(`/anime/${anime.mal_id}`)} />
                            ))}
                        </div>
                    )}

                    {!loading && !error && trendingAnime.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-[#111d2a]/70 py-16">
                            <p className="text-slate-200 text-lg font-semibold">No hay animes para mostrar ahora</p>
                            <p className="text-slate-400 text-sm mt-1">Prueba de nuevo en unos minutos.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                            {[...Array(8)].map((_, i) => (
                                <AnimeCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-slate-400 text-lg font-medium">Error al cargar tendencias</p>
                            <p className="text-slate-600 text-sm mt-1">{error}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}