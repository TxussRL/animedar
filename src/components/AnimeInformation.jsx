import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

export default function AnimeInformation() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [anime, setAnime] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [staff, setStaff] = useState([]);
    const [videos, setVideos] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAll() {
            try {
                setLoading(true);

                const res = await fetch(
                    `http://localhost:3000/api/anime/${id}/full`
                );

                const json = await res.json();

                setAnime(json.data?.anime);
                setCharacters(json.data?.characters);
                setStaff(json.data?.staff);
                setVideos(json.data?.videos);
                setRecommendations(json.data?.recommendations);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchAll();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    if (!anime) {
        return (
            <div className="flex h-screen items-center justify-center text-red-400">
                Error cargando anime
            </div>
        );
    }

    return (
        <div className="bg-[#0B0F1A] min-h-screen px-8 md:px-20 py-10 text-white">
            {/* Header */}
            <section className="flex flex-col md:flex-row gap-10 mt-10">
                <img
                    className="rounded-2xl w-[220px] h-[320px] object-cover"
                    src={anime?.images?.jpg?.image_url}
                    alt={anime?.title}
                />

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 text-white/70 text-sm mb-3">
                        <span onClick={() => navigate("/")} className="cursor-pointer hover:text-[#01c6e5]">Inicio</span>
                        <span>/</span>
                        <span onClick={() => navigate("/anime/buscar")} className="cursor-pointer hover:text-[#01c6e5]">Buscar</span>
                        <span>/</span>
                        <span className="text-[#01c6e5]">{anime?.title}</span>
                    </div>

                    <h1 className="text-3xl font-black">{anime?.title}</h1>
                    <h2 className="text-gray-500 font-black">{anime?.title_japanese}</h2>

                    <div className="flex flex-wrap gap-3 mt-4">
                        {anime?.genres?.filter(g => g?.name !== "Award Winning").map((gen, index) => {
                            const color = colors[index % colors.length];
                            return (
                                <p
                                    key={gen?.mal_id}
                                    className={`${color?.text} ${color?.bg} py-1 px-4 rounded-3xl text-xs`}
                                >
                                    {gen?.name}
                                </p>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="mt-10 border-b border-slate-800 text-sm text-slate-400 flex gap-6 w-full md:w-2/3">
                <button className="pb-2 border-b-2 border-[#00d3f2] text-white">Información</button>
                <button className="pb-2 text-[#01c6e5]">Personajes</button>
                <button className="pb-2 text-[#01c6e5]">Episodios</button>
                <button className="pb-2 text-[#01c6e5]">Recomendaciones</button>
            </section>

            {/* Info + Synopsis */}
            <section className="grid md:grid-cols-[260px_1fr] gap-6 mt-8">
                <aside className="bg-[#121827] rounded-xl p-4 space-y-3 text-sm">
                    <h3 className="text-white font-semibold">Información</h3>
                    <div className="text-slate-300 space-y-2">
                        <p><span className="text-white">Título:</span> {anime?.title}</p>
                        <p><span className="text-white">Tipo:</span> {anime?.type}</p>
                        <p><span className="text-white">Episodios:</span> {anime?.episodes}</p>
                        <p><span className="text-white">Estado:</span> {anime?.status}</p>
                        <p><span className="text-white">Temporada:</span> {anime?.season} {anime?.year}</p>
                        <p><span className="text-white">Emitido:</span> {anime?.aired?.string}</p>
                        <p><span className="text-white">Estudio:</span> {anime?.studios?.[0]?.name}</p>
                        <p><span className="text-white">Productores:</span> {anime?.producers?.map(p => p.name).join(", ")}</p>
                        <p><span className="text-white">Licencias:</span> {anime?.licensors?.map(l => l.name).join(", ")}</p>
                    </div>
                </aside>

                <div className="space-y-6">
                    <div className="bg-[#121827] rounded-xl p-5">
                        <h3 className="font-semibold mb-3">Sinopsis</h3>
                        <p className="text-slate-300 text-sm leading-6">{anime?.synopsis}</p>
                    </div>

                    <div className="bg-[#121827] rounded-xl p-5">
                        <h3 className="font-semibold mb-3">Puntuación de los usuarios</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-semibold text-lg">★ {anime?.score}</span>
                            <span className="text-slate-400 text-sm">{anime?.scored_by?.toLocaleString()} votos</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Characters */}
            <section className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Personajes principales</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {characters.slice(0, 8).map((c) => (
                        <div key={c?.character?.mal_id} className="bg-[#121827] rounded-xl p-3">
                            <img className="rounded-lg w-full h-40 object-cover" src={c?.character?.images?.jpg?.image_url} alt={c?.character?.name} />
                            <p className="text-sm mt-2">{c?.character?.name}</p>
                            <p className="text-xs text-slate-400">{c?.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Staff */}
            <section className="mt-10">
                <h3 className="font-semibold mb-4">Staff</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {staff.slice(0, 8).map((s) => (
                        <div key={s?.person?.mal_id} className="bg-[#121827] rounded-xl p-3">
                            <img className="rounded-lg w-full h-40 object-cover" src={s?.person?.images?.jpg?.image_url} alt={s?.person?.name} />
                            <p className="text-sm mt-2">{s?.person?.name}</p>
                            <p className="text-xs text-slate-400">{s?.positions?.[0]}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Videos */}
            <section className="mt-10">
                <h3 className="font-semibold mb-4">Videos</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {videos?.promo?.slice(0, 2).map((v) => (
                        <iframe
                            key={v?.trailer?.youtube_id}
                            className="w-full h-64 rounded-xl"
                            src={v?.trailer?.embed_url}
                            title={v?.title}
                            allowFullScreen
                        />
                    ))}
                </div>
            </section>

            {/* Recommendations */}
            <section className="mt-10">
                <h3 className="font-semibold mb-4">Recomendaciones</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendations.slice(0, 8).map((r) => (
                        <div key={r?.entry?.mal_id} className="bg-[#121827] rounded-xl p-3 cursor-pointer hover:bg-[#1a2a3b] transition" onClick={() => navigate(`/anime/${r.entry.mal_id}`)}>
                            <img className="rounded-lg w-full h-40 object-cover" src={r?.entry?.images?.jpg?.image_url} alt={r?.entry?.title} />
                            <p className="text-sm mt-2">{r?.entry?.title}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}