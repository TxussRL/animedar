import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

            <div>
                <h2 className="text-white font-bold">{title}</h2>
                <p className="text-yellow-400 text-sm">
                    ⭐ {anime.meanScore ?? "?"}
                </p>
            </div>
        </div>
    );
}

export default function Top100Anime() {
    const [topAnime, setTopAnime] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:3000/api/top/anime/full");
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