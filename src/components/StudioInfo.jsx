import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function StudioInfo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [studio, setStudio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudio() {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/anime/studio/${id}`);
                const json = await res.json();
                setStudio(json.data?.studio || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStudio();
    }, [id]);

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
            if (!acc[year]) acc[year] = [];
            acc[year].push(anime);
            return acc;
        }, {});

    const sortedYears = Object.keys(groupedByYear)
        .sort((a, b) => (b === "TBA" ? -1 : a === "TBA" ? 1 : b - a));

    return (
        <div className="bg-[#0B0F1A] min-h-screen px-8 md:px-20 py-10 text-white pt-20">
            <h1 className="text-3xl font-black mb-8">{studio?.name}</h1>

            {sortedYears.map((year) => (
                <section key={year} className="mb-10">
                    <h2 className="text-xl font-semibold mb-4">{year}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {groupedByYear[year].map((anime) => (
                            <div
                                key={anime?.id}
                                className="cursor-pointer"
                                onClick={() => navigate(`/anime/${anime?.id}`)}
                            >
                                <img
                                    className="rounded-lg w-full h-56 object-cover"
                                    src={anime?.coverImage?.large}
                                    alt={anime?.title?.romaji}
                                />
                                <p className="text-sm mt-2 text-slate-300">
                                    {anime?.title?.english || anime?.title?.romaji}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}