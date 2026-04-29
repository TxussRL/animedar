import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


let colors = [
    {
        bg: "bg-red-500/15",
        text: "text-red-300"
    },
    {
        bg: "bg-blue-500/15",
        text: "text-blue-300"
    },
    {
        bg: "bg-green-500/15",
        text: "text-green-300"
    },
    {
        bg: "bg-yellow-500/15",
        text: "text-yellow-300"
    },
    {
        bg: "bg-purple-500/15",
        text: "text-purple-300"
    },
    {
        bg: "bg-pink-500/15",
        text: "text-pink-300"
    },
    {
        bg: "bg-cyan-500/15",
        text: "text-cyan-300"
    },
    {
        bg: "bg-orange-500/15",
        text: "text-orange-300"
    }
];
export default function AnimeInformation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        async function fetchAnime() {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:3000/api/anime/${id}`,
                    { signal: controller.signal }
                );

                const data = await response.json();

                if (!ignore) {
                    setAnime(data.data);
                }

            } catch (err) {
                if (err.name === "AbortError") return; // 👈 CLAVE

                console.error(err);

                if (!ignore) {
                    setAnime(null);
                }

            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        fetchAnime();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [id]);

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center text-white">
                Cargando...
            </div>
        );

    if (!anime)
        return (
            <div className="flex h-screen items-center justify-center text-red-400">
                Error cargando anime
            </div>
        );

    return (
        <div>
            <section className="flex">
                <img
                    className="rounded-2xl my-24 mx-24"
                    src={anime.images.jpg.image_url}
                    alt={anime.title} />
                <div className="flex flex-col my-24">
                    <div className="flex flex-row gap-2 text-white mb-5">
                        <a onClick={() => navigate("/")} className="cursor-pointer hover:text-[#01c6e5]">Inicio</a>
                        <p> / </p>
                        <a onClick={() => navigate("/anime/buscar")} className="cursor-pointer hover:text-[#01c6e5]">Buscar</a>
                        <p> / </p>
                        <p className="text-[#01c6e5] cursor-pointer">{anime.title}</p>
                    </div>
                    <div className="flex flex-row">
                        <h1 className="text-white text-3xl font-black">{anime.title}</h1>
                    </div>
                    <div className="flex flex-row mb-4">
                        <h2 className="text-gray-500 font-black">{anime.title_japanese}</h2>
                    </div>
                    <div className="flex flex-row gap-4">
                        {anime.genres.map((gen, index) => {
                            if (gen.name !== "Award Winning") {
                                return <p className={`${colors[index].text} ${colors[index].bg} py-1 px-4 rounded-3xl`}> {gen.name}</p>
                            }
                        })}
                    </div>
                </div>
            </section >
        </div >
    );
}