import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function StaffInformation() {
    const { personId } = useParams();
    const navigate = useNavigate();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStaff() {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/people/${personId}`);
                const json = await res.json();
                setStaff(json?.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStaff();
    }, [personId]);

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
    if (!staff) return <div className="text-red-400 p-10">Error cargando staff</div>;

    return (
        <div className="bg-[#0B0F1A] min-h-screen px-6 md:px-20 py-10 text-white pt-20">
            {/* Header */}
            <section className="flex flex-col md:flex-row gap-10">
                <div className="flex flex-col items-center gap-4">
                    <img
                        className="rounded-2xl w-[220px] h-[320px] object-cover"
                        src={staff?.image?.large}
                        alt={staff?.name?.full}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 text-white/70 text-sm mb-3">
                        <span onClick={() => navigate("/")} className="cursor-pointer hover:text-[#01c6e5]">Inicio</span>
                        <span>/</span>
                        <span className="text-[#01c6e5]">{staff?.name?.full}</span>
                    </div>

                    <h1 className="text-3xl font-black">{staff?.name?.full}</h1>
                    {staff?.name?.native && (
                        <h2 className="text-gray-500 font-black">{staff.name.native}</h2>
                    )}

                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                        {staff?.language && (
                            <p><span className="text-white">Language:</span> {staff.language}</p>
                        )}
                        {staff?.yearsActive?.length > 0 && (
                            <p><span className="text-white">Years Active:</span> {staff.yearsActive.join(", ")}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Descripción */}
            {staff?.description && (
                <section className="mt-8 bg-[#121827] rounded-xl p-5">
                    <h3 className="font-semibold mb-3">Biografía</h3>
                    <p
                        className="text-slate-300 text-sm leading-6"
                        dangerouslySetInnerHTML={{ __html: formatAnilistDescription(staff.description) }}
                    />
                </section>
            )}

            {/* Trabajos / Media */}
            {staff?.staffMedia?.nodes?.length > 0 && (
                <section className="mt-10">
                    <h3 className="font-semibold mb-4">Trabajos / Media</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {staff.staffMedia.nodes.map((anime) => (
                            <div
                                key={anime.id}
                                className="bg-[#121827] rounded-xl p-2 cursor-pointer hover:bg-[#1a2a3b] transition"
                                onClick={() => navigate(`/anime/${anime.id}`)}
                            >
                                <img
                                    className="rounded-lg w-full h-40 object-cover"
                                    src={anime?.coverImage?.large}
                                    alt={anime?.title?.romaji}
                                />
                                <p className="text-xs mt-2 truncate">
                                    {anime?.title?.english || anime?.title?.romaji}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}