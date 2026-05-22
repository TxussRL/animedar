import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function StudioInfo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [studio, setStudio] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchStudio(1, true);
    }, [id]);

    async function fetchStudio(currentPage, reset = false) {
        try {
            if (currentPage === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/anime/studio/${id}?page=${currentPage}`
            );

            const json = await res.json();

            const incomingStudio = json.data?.studio;

            setStudio(prev => {
                if (!prev || reset) {
                    return incomingStudio;
                }

                return {
                    ...incomingStudio,
                    media: {
                        ...incomingStudio.media,
                        nodes: [
                            ...(prev.media?.nodes || []),
                            ...(incomingStudio.media?.nodes || [])
                        ]
                    }
                };
            });

            setHasMore(json.data?.hasMore);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    if (!studio) {
        return (
            <div className="flex h-screen items-center justify-center text-red-400">
                Error cargando studio
            </div>
        );
    }

    const groupedByYear = (studio?.media?.nodes || [])
        .filter(n => n.type === "ANIME")
        .reduce((acc, anime) => {
            const year = anime?.startDate?.year || "TBA";

            if (!acc[year]) {
                acc[year] = [];
            }

            // evitar duplicados
            if (!acc[year].some(a => a.id === anime.id)) {
                acc[year].push(anime);
            }

            return acc;
        }, {});

    const sortedYears = Object.keys(groupedByYear).sort((a, b) => {
        if (a === "TBA") return -1;
        if (b === "TBA") return 1;
        return b - a;
    });

    return (
        <div className="bg-[#0B0F1A] min-h-screen px-8 md:px-20 py-10 text-white pt-20">
            <h1 className="text-3xl font-black mb-8">
                {studio?.name}
            </h1>

            {sortedYears.map((year) => (
                <section key={year} className="mb-10">
                    <h2 className="text-xl font-semibold mb-4">
                        {year}
                    </h2>

                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {groupedByYear[year].map((anime) => (
                            <div
                                key={anime?.id}
                                onClick={() => navigate(`/anime/${anime?.id}`)}
                                className="cursor-pointer hover:scale-105 transition"
                            >
                                <img
                                    className="rounded-md w-full aspect-[2/3] object-cover"
                                    src={anime?.coverImage?.large}
                                    alt={anime?.title?.romaji}
                                />

                                <p className="text-xs mt-1 text-slate-300 truncate">
                                    {anime?.title?.english || anime?.title?.romaji}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => {
                            const nextPage = page + 1;

                            setPage(nextPage);

                            fetchStudio(nextPage);
                        }}
                        disabled={loadingMore}
                        className="px-5 py-2 rounded-lg bg-[#1f2937] hover:bg-[#374151] transition text-sm"
                    >
                        {loadingMore
                            ? "Cargando..."
                            : "Cargar más"}
                    </button>
                </div>
            )}
        </div>
    );
}