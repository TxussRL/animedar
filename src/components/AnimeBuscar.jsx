import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Horror", "Sci-Fi"];
const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"];
const FORMATS = ["TV", "TV_SHORT", "MOVIE", "OVA", "ONA", "SPECIAL"];

function SearchCard({ anime, onClick }) {
    const image = anime.coverImage?.large || "/hero-bg.png";
    const title = anime.title?.english || anime.title?.romaji || "Sin título";
    const score = anime.meanScore;
    const genres = (anime.genres || []).slice(0, 2);

    return (
        <article
            className="cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden rounded-xl border border-slate-700/70 bg-[#162331] transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
            onClick={onClick}
        >
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101a24] via-transparent to-transparent" />

                {typeof score === "number" && (
                    <span className="absolute top-2 right-2 rounded-md border border-amber-400/40 bg-black/45 px-2 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                        {(score / 10).toFixed(1)}
                    </span>
                )}
            </div>

            <div className="space-y-2 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-white">{title}</h3>
                <div className="flex flex-wrap gap-1.5">
                    {genres.map((genre) => (
                        <span
                            key={`${anime.id}-${genre}`}
                            className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-200"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}

export default function AnimeBuscar() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialQuery = (searchParams.get("q") || "").trim();
    const initialGenres = (searchParams.get("genres") || "").split(",").filter(Boolean);
    const initialSeason = searchParams.get("season") || "";
    const initialYear = searchParams.get("year") || "";
    const initialFormat = searchParams.get("format") || "";

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [textoBuscado, setDebouncedTerm] = useState(initialQuery);
    const [selectedGenres, setSelectedGenres] = useState(initialGenres);
    const [season, setSeason] = useState(initialSeason);
    const [year, setYear] = useState(initialYear);
    const [format, setFormat] = useState(initialFormat);
    const [genreSelect, setGenreSelect] = useState("");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedTerm(searchTerm.trim());
        }, 400);

        return () => clearTimeout(id);
    }, [searchTerm]);

    useEffect(() => {
        const params = {};
        if (textoBuscado) params.q = textoBuscado;
        if (selectedGenres.length) params.genres = selectedGenres.join(",");
        if (season) params.season = season;
        if (year) params.year = year;
        if (format) params.format = format;

        setSearchParams(params);
    }, [textoBuscado, selectedGenres, season, year, format, setSearchParams]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setResults([]);
        setIsInitialLoaded(false);
    }, [textoBuscado, selectedGenres, season, year, format]);

    const buildUrl = () => {
        const params = new URLSearchParams();
        if (textoBuscado) params.set("q", textoBuscado);
        if (selectedGenres.length) params.set("genres", selectedGenres.join(","));
        if (season) params.set("season", season);
        if (year) params.set("year", year);
        if (format) params.set("format", format);
        params.set("page", page);
        params.set("perPage", 25);
        return `${import.meta.env.VITE_API_URL}/api/anime/buscar?${params.toString()}`;
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchAnime = async () => {
            if (!textoBuscado && !selectedGenres.length && !season && !year && !format) {
                setResults([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(buildUrl(), { signal: controller.signal });
                if (!response.ok) throw new Error("No se pudo cargar el catálogo");

                const json = await response.json();
                const newItems = Array.isArray(json?.data) ? json.data : [];

                setResults((prev) => {
                    const map = new Map(prev.map((item) => [item.id, item]));
                    newItems.forEach((item) => map.set(item.id, item));
                    return Array.from(map.values());
                });
                setHasMore(Boolean(json?.hasNextPage));

                if (page === 1) setIsInitialLoaded(true);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Error al buscar anime");
                }
            } finally {
                setLoading(false);
                isFetchingRef.current = false;
            }
        };

        fetchAnime();

        return () => controller.abort();
    }, [textoBuscado, selectedGenres, season, year, format, page]);

    useEffect(() => {
        if (!observerRef.current) return;
        if (!results.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isFetchingRef.current &&
                    isInitialLoaded
                ) {
                    isFetchingRef.current = true;
                    setPage((p) => p + 1);
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [hasMore, isInitialLoaded, results.length]);

    const handleAddGenre = (value) => {
        if (!value) return;
        setSelectedGenres((prev) => (prev.includes(value) ? prev : [...prev, value]));
        setGenreSelect("");
    };

    const handleRemoveGenre = (value) => {
        setSelectedGenres((prev) => prev.filter((g) => g !== value));
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setDebouncedTerm("");
        setSelectedGenres([]);
        setSeason("");
        setYear("");
        setFormat("");
        setGenreSelect("");
        setSearchParams({});
    };

    const queryLabel = (searchParams.get("q") || "").trim();

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0f1923] px-4 pb-14 pt-28 md:px-8">
            <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-6 right-8 h-56 w-56 rounded-full bg-blue-500/10 blur-[90px]" />

            <div className="relative mx-auto max-w-[1440px]">
                <header className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">Explorar</p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Busca anime a tu estilo</h1>
                    <p className="mt-2 max-w-2xl text-slate-300/80">
                        {queryLabel ? `Resultados para "${queryLabel}"` : "Escribe para buscar por título."}
                    </p>
                </header>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {selectedGenres.map((g) => (
                        <span
                            key={g}
                            className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200"
                        >
                            {g}
                            <button
                                type="button"
                                onClick={() => handleRemoveGenre(g)}
                                className="text-cyan-200 hover:text-white"
                            >
                                ✕
                            </button>
                        </span>
                    ))}

                    {(selectedGenres.length || season || year || format || searchTerm) && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="rounded-full border border-slate-700/60 bg-[#152332] px-3 py-1 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 hover:text-white"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end">
                    <div className="w-full lg:max-w-[260px]">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Search</label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-[#152332] px-3 py-2 shadow-sm">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                placeholder="naruto"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 lg:flex-1">
                        <div className="min-w-[180px]">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Genres</label>
                            <select
                                value={genreSelect}
                                onChange={(e) => handleAddGenre(e.target.value)}
                                className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-3 py-2 text-sm text-white shadow-sm outline-none"
                            >
                                <option value="">Añadir género</option>
                                {GENRES.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="min-w-[140px]">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Year</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-3 py-2 text-sm text-white shadow-sm outline-none"
                            >
                                <option value="">Any</option>
                                {Array.from({ length: 88 }, (_, i) => 2027 - i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div className="min-w-[140px]">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Season</label>
                            <select
                                value={season}
                                onChange={(e) => setSeason(e.target.value)}
                                className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-3 py-2 text-sm text-white shadow-sm outline-none"
                            >
                                <option value="">Any</option>
                                {SEASONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="min-w-[140px]">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Format</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full rounded-xl border border-slate-700/60 bg-[#152332] px-3 py-2 text-sm text-white shadow-sm outline-none"
                            >
                                <option value="">Any</option>
                                {FORMATS.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                    {results.map((anime) => (
                        <SearchCard key={anime.id} anime={anime} onClick={() => navigate(`/anime/${anime.id}`)} />
                    ))}
                </div>

                <div ref={observerRef} className="h-10" />

                {loading && <p className="mt-6 text-sm text-slate-400">Cargando...</p>}
            </div>
        </section>
    );
}