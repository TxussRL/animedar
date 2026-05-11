import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
    const query = (searchParams.get("q") || "").trim();

    const [searchTerm, setSearchTerm] = useState(query);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [textoBuscado, setDebouncedTerm] = useState(query);

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedTerm(searchTerm.trim());
            if (!searchTerm.trim()) {
                setSearchParams({});
            } else {
                setSearchParams({ q: searchTerm.trim() });
            }
        }, 400);

        return () => clearTimeout(id);
    }, [searchTerm, setSearchParams]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchAnime = async () => {
            if (!textoBuscado) {
                setResults([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `http://localhost:3000/api/anime/buscar?q=${encodeURIComponent(textoBuscado)}`,
                    { signal: controller.signal }
                );

                if (!response.ok) throw new Error("No se pudo cargar el catálogo");

                const json = await response.json();
                const newItems = Array.isArray(json?.data) ? json.data : [];
                setResults(newItems);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Error al buscar anime");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnime();

        return () => controller.abort();
    }, [textoBuscado]);

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0f1923] px-4 pb-14 pt-28 md:px-8">
            <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-6 right-8 h-56 w-56 rounded-full bg-blue-500/10 blur-[90px]" />

            <div className="relative mx-auto max-w-[1440px]">
                <header className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">Explorar</p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Busca anime a tu estilo</h1>
                    <p className="mt-2 max-w-2xl text-slate-300/80">
                        {query ? `Resultados para "${query}"` : "Escribe para buscar por título."}
                    </p>
                </header>

                <form onSubmit={(e) => e.preventDefault()} className="mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
                    <div className="group relative max-w-2xl">
                        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/50 via-blue-500/35 to-emerald-400/35 opacity-0 blur-sm transition-opacity duration-300 group-focus-within:opacity-100" />
                        <div className="relative flex items-center rounded-2xl border border-slate-700/60 bg-[#152332]/95 backdrop-blur-xl">
                            <svg className="ml-4 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
                                placeholder="Busca por título..."
                            />
                        </div>
                    </div>
                </form>

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

                {loading && <p className="mt-6 text-sm text-slate-400">Cargando...</p>}
            </div>
        </section>
    );
}