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
    const [recommendations, setRecommendations] = useState([]);
    const [relations, setRelations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("info");

    const [showListModal, setShowListModal] = useState(false);
    const [status, setStatus] = useState("Watching");
    const [score, setScore] = useState("");
    const [isInList, setIsInList] = useState(false);

    useEffect(() => {
        async function fetchAll() {
            try {
                setLoading(true);

                const res = await fetch(
                    `http://localhost:3000/api/anime/${id}/full`
                );

                const json = await res.json();

                setAnime(json.data?.anime);
                setCharacters(json.data?.characters || []);
                setStaff(json.data?.staff || []);
                setRecommendations(json.data?.recommendations || []);
                setRelations(json.data?.relations || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
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

    const title =
        anime?.title?.english || anime?.title?.romaji || anime?.title?.native || "Sin título";

    return (
        <div className="bg-[#0B0F1A] min-h-screen px-8 md:px-20 py-10 text-white">
            {/* Header */}
            <section className="flex flex-col md:flex-row gap-10 mt-10">
                <div className="flex flex-col items-center gap-4">
                    <img
                        className="rounded-2xl w-[220px] h-[320px] object-cover"
                        src={anime?.coverImage?.large}
                        alt={title}
                    />

                    <button
                        onClick={() => setShowListModal(true)}
                        className="w-full rounded-lg bg-cyan-500 py-2 text-black font-semibold hover:bg-cyan-400"
                    >
                        {isInList ? "Editar / Eliminar de mi lista" : "Añadir a mi lista"}
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 text-white/70 text-sm mb-3">
                        <span onClick={() => navigate("/")} className="cursor-pointer hover:text-[#01c6e5]">Inicio</span>
                        <span>/</span>
                        <span onClick={() => navigate("/anime/buscar")} className="cursor-pointer hover:text-[#01c6e5]">Buscar</span>
                        <span>/</span>
                        <span className="text-[#01c6e5]">{title}</span>
                    </div>

                    <h1 className="text-3xl font-black">{title}</h1>
                    <h2 className="text-gray-500 font-black">{anime?.title?.native}</h2>

                    <div className="flex flex-wrap gap-3 mt-4">
                        {anime?.genres?.map((gen, index) => {
                            const color = colors[index % colors.length];
                            return (
                                <p
                                    key={`${gen}-${index}`}
                                    className={`${color?.text} ${color?.bg} py-1 px-4 rounded-3xl text-xs`}
                                >
                                    {gen}
                                </p>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="mt-10 border-b border-slate-800 text-sm text-slate-400 flex gap-6 w-full md:w-2/3">
                <button onClick={() => setTab("info")} className={`pb-2 cursor-pointer ${tab === "info" ? "border-b-2 border-[#00d3f2] text-white" : "text-[#01c6e5]"}`}>Información</button>
                <button onClick={() => setTab("characters")} className={`pb-2 cursor-pointer ${tab === "characters" ? "border-b-2 border-[#00d3f2] text-white" : "text-[#01c6e5]"}`}>Personajes</button>
                <button onClick={() => setTab("staff")} className={`pb-2 cursor-pointer ${tab === "staff" ? "border-b-2 border-[#00d3f2] text-white" : "text-[#01c6e5]"}`}>Staff</button>
                <button onClick={() => setTab("recommendations")} className={`pb-2 cursor-pointer ${tab === "recommendations" ? "border-b-2 border-[#00d3f2] text-white" : "text-[#01c6e5]"}`}>Recomendaciones</button>
            </section>

            {/* Info + Synopsis */}
            {tab === "info" && (
                <section className="grid md:grid-cols-[260px_1fr] gap-6 mt-8">
                    <aside className="bg-[#121827] rounded-xl p-4 space-y-3 text-sm h-fit self-start">
                        <h3 className="text-white font-semibold">Información</h3>
                        <div className="text-slate-300 space-y-2">
                            <p><span className="text-white">Format:</span> {anime?.format}</p>
                            <p><span className="text-white">Episodes:</span> {anime?.episodes}</p>
                            <p><span className="text-white">Episode Duration:</span> {anime?.duration} mins</p>
                            <p><span className="text-white">Status:</span> {anime?.status}</p>

                            <p>
                                <span className="text-white">Start Date:</span>{" "}
                                {anime?.startDate?.month}/{anime?.startDate?.day}/{anime?.startDate?.year}
                            </p>
                            <p>
                                <span className="text-white">End Date:</span>{" "}
                                {anime?.endDate?.month}/{anime?.endDate?.day}/{anime?.endDate?.year}
                            </p>

                            <p><span className="text-white">Season: </span>
                                <span
                                    onClick={() => navigate(`/anime/buscar?season=${anime?.season}&year=${anime?.seasonYear}`)}
                                    className="cursor-pointer text-cyan-400 hover:text-cyan-300"
                                >
                                    {anime?.season} {anime?.seasonYear}
                                </span></p>
                            <p><span className="text-white">Average Score:</span> {anime?.averageScore}%</p>
                            <p><span className="text-white">Mean Score:</span> {anime?.meanScore}%</p>
                            <p><span className="text-white">Popularity:</span> {anime?.popularity}</p>
                            <p><span className="text-white">Favorites:</span> {anime?.favourites}</p>

                            <p>
                                <span className="text-white">Studios:</span>{" "}
                                {anime?.studios?.edges?.filter(s => s.isMain).map((s) => (
                                    <span
                                        key={s.node.id}
                                        onClick={() => navigate(`/anime/studio/${s.node.id}`)}
                                        className="cursor-pointer text-cyan-400 hover:text-cyan-300"
                                    >
                                        {s.node.name}
                                    </span>
                                ))}
                            </p>
                            <p>
                                <span className="text-white">Producers:</span>{" "}
                                {anime?.studios?.edges?.filter(s => !s.isMain).map(s => s.node.name).join(", ")}
                            </p>

                            <p><span className="text-white">Source:</span> {anime?.source}</p>

                            <p>
                                <span className="text-white">Genres:</span>{" "}
                                {anime?.genres?.join(", ")}
                            </p>

                            <p><span className="text-white">Romaji:</span> {anime?.title?.romaji}</p>
                            <p><span className="text-white">English:</span> {anime?.title?.english}</p>
                            <p><span className="text-white">Native:</span> {anime?.title?.native}</p>

                            <p>
                                <span className="text-white">Synonyms:</span>{" "}
                                {anime?.synonyms?.join(", ")}
                            </p>
                        </div>
                    </aside>

                    <div className="space-y-6">
                        <div className="bg-[#121827] rounded-xl p-5">
                            <h3 className="font-semibold mb-3">Sinopsis</h3>
                            <p className="text-slate-300 text-sm leading-6"> {anime?.description}</p>
                        </div>

                        {/* RELATIONS */}
                        {relations.length > 0 && (
                            <div className="bg-[#121827] rounded-xl p-5">
                                <h3 className="font-semibold mb-4">Relations</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {relations.map((r, i) => (
                                        <div
                                            key={r?.node?.id ?? `rel-${i}`}
                                            className="bg-[#1a2a3b] rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                                            onClick={() => navigate(`/anime/${r?.node?.id}`)}
                                        >
                                            <img
                                                className="w-full h-28 object-cover"
                                                src={r?.node?.coverImage?.large}
                                                alt={r?.node?.title?.romaji}
                                            />
                                            <div className="p-2 text-xs">
                                                <p className="text-white font-semibold truncate">
                                                    {r?.node?.title?.english || r?.node?.title?.romaji}
                                                </p>
                                                <p className="text-slate-400">{r?.relationType}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-[#121827] rounded-xl p-5">
                            <h3 className="font-semibold mb-3">Puntuación de los usuarios</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-amber-400 font-semibold text-lg">★ {anime?.meanScore ?? "?"}</span>
                            </div>
                        </div>
                    </div>
                </section >
            )
            }

            {/* Characters */}
            {
                tab === "characters" && (
                    <section className="mt-10">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            {characters.slice(0, 25).map((c) => (
                                <div key={c?.id} className="flex flex-col items-center">
                                    <img className="rounded-full w-16 h-16 object-cover border border-slate-700" src={c?.image?.large} alt={c?.name?.full} />
                                    <p className="text-xs mt-2 text-center">{c?.name?.full}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }

            {/* Staff */}
            {
                tab === "staff" && (
                    <section className="mt-10">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            {staff.slice(0, 25).map((s, i) => (
                                <div key={s?.id ?? `staff-${i}`} className="flex flex-col items-center cursor-pointer" onClick={() => navigate(`/anime/staff/${s?.id}`)}>
                                    <img className="rounded-full w-16 h-16 object-cover border border-slate-700" src={s?.image?.large} alt={s?.name?.full} />
                                    <p className="text-xs mt-2 text-center">{s?.name?.full}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }

            {/* Recommendations */}
            {
                tab === "recommendations" && (
                    <section className="mt-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recommendations.slice(0, 8).map((r, i) => (
                                <div
                                    key={r?.mediaRecommendation?.id ?? `rec-${i}`}
                                    className="bg-[#121827] rounded-xl p-3 cursor-pointer hover:bg-[#1a2a3b] transition"
                                    onClick={() => navigate(`/anime/${r?.mediaRecommendation?.id}`)}
                                >
                                    <img
                                        className="rounded-lg w-full h-40 object-cover"
                                        src={r?.mediaRecommendation?.coverImage?.large}
                                        alt={r?.mediaRecommendation?.title?.romaji}
                                    />
                                    <p className="text-sm mt-2">
                                        {r?.mediaRecommendation?.title?.english || r?.mediaRecommendation?.title?.romaji}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }

            {/* POPUP LISTA */}
            {
                showListModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div className="bg-[#121827] rounded-xl p-6 w-[90%] max-w-md text-white shadow-xl">
                            <h3 className="text-lg font-semibold mb-4">{isInList ? "Editar en mi lista" : "Añadir a mi lista"}</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-300">Estado</label>
                                    <select
                                        className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0f1923] p-2"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option>Watching</option>
                                        <option>Completed</option>
                                        <option>On Hold</option>
                                        <option>Dropped</option>
                                        <option>Plan to Watch</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-slate-300">Puntuación</label>
                                    <input
                                        className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0f1923] p-2"
                                        placeholder="0 - 10"
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowListModal(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                                >
                                    Cancelar
                                </button>

                                {isInList ? (
                                    <button className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-black font-semibold">
                                        Eliminar
                                    </button>
                                ) : (
                                    <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
                                        Guardar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}