import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CharacterInformation() {
    const { characterId } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCharacter() {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/character/${characterId}/full`);
                const json = await res.json();
                setCharacter(json?.data?.character); // ✅ aquí estaba el problema
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchCharacter();
    }, [characterId]);

    function formatAnilistDescription(text) {
        if (!text) return "";

        return text
            // spoilers ~!texto!~ => <span class="spoiler">texto</span>
            .replace(/~!(.*?)!~/g, `<span class="spoiler">$1</span>`)
            // **negrita** con __texto__
            .replace(/__(.*?)__/g, `<strong>$1</strong>`)
            // links [texto](url)
            .replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" target="_blank" rel="noreferrer">$1</a>`)
            // saltos de línea
            .replace(/\n/g, "<br/>");
    }

    if (loading) return <div className="text-white p-10">Cargando...</div>;
    if (!character) return <div className="text-red-400 p-10">Error cargando personaje</div>;

    return (
        <div className="bg-[#0B0F1A] min-h-screen px-6 md:px-20 py-10 text-white pt-20">
            {/* Header */}
            <section className="flex flex-col md:flex-row gap-10">
                <div className="flex flex-col items-center gap-4">
                    <img
                        className="rounded-2xl w-[220px] h-[320px] object-cover"
                        src={character?.image?.large}
                        alt={character?.name?.full}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 text-white/70 text-sm mb-3">
                        <span onClick={() => navigate("/")} className="cursor-pointer hover:text-[#01c6e5]">Inicio</span>
                        <span>/</span>
                        <span className="text-[#01c6e5]">{character?.name?.full}</span>
                    </div>

                    <h1 className="text-3xl font-black">{character?.name?.full}</h1>
                    {character?.name?.native && (
                        <h2 className="text-gray-500 font-black">{character.name.native}</h2>
                    )}

                    {/* Alias */}
                    {character?.name?.alternative?.length > 0 && (
                        <p className="text-sm text-slate-400">
                            {character.name.alternative.join(", ")}
                        </p>
                    )}

                    {/* Info */}
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                        {character?.gender && (
                            <p><span className="text-white">Género:</span> {character.gender}</p>
                        )}
                        {character?.age && (
                            <p><span className="text-white">Edad:</span> {character.age}</p>
                        )}
                        {character?.bloodType && (
                            <p><span className="text-white">Grupo sanguíneo:</span> {character.bloodType}</p>
                        )}
                        {character?.favourites != null && (
                            <p><span className="text-white">Favoritos:</span> {character.favourites}</p>
                        )}
                        {character?.siteUrl && (
                            <p>
                                <span className="text-white">AniList:</span>{" "}
                                <a
                                    href={character.siteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300"
                                >
                                    Ver en AniList
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Descripción */}
            {character?.description && (
                <section className="mt-8 bg-[#121827] rounded-xl p-5">
                    <h3 className="font-semibold mb-3">Biografía</h3>
                    <p
                        className="text-slate-300 text-sm leading-6"
                        dangerouslySetInnerHTML={{ __html: formatAnilistDescription(character.description) }}
                    />
                </section>
            )}

            {/* Media / Animes */}
            {character?.media?.nodes?.length > 0 && (
                <section className="mt-10">
                    <h3 className="font-semibold mb-4">Apariciones</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {character.media.nodes.map((media) => (
                            <div
                                key={media.id}
                                className="bg-[#121827] rounded-xl p-2 cursor-pointer hover:bg-[#1a2a3b] transition"
                                onClick={() => navigate(`/anime/${media.id}`)}
                            >
                                <img
                                    className="rounded-lg w-full h-40 object-cover"
                                    src={media?.coverImage?.large}
                                    alt={media?.title?.romaji}
                                />
                                <p className="text-xs mt-2 truncate">
                                    {media?.title?.english || media?.title?.romaji}
                                </p>
                                {media?.startDate?.year && (
                                    <p className="text-[10px] text-slate-400">
                                        {media.startDate.year} • {media.type}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}