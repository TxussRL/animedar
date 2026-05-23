import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SocialFeed() {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchFeed() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/lista/social`
                );

                const data = await res.json();
                setFeed(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchFeed();
    }, []);

    const formatDate = (date) =>
        new Date(date).toLocaleString("es-ES", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });

    const actionText = (action) => {
        switch (action) {
            case "added":
                return "ha añadido";
            case "watching":
                return "ha empezado a ver";
            case "completed":
                return "ha completado";
            case "updated_episodes":
                return "ha actualizado episodios de";
            default:
                return "ha actualizado";
        }
    };

    if (loading) {
        return (
            <div className="text-white flex justify-center p-10">
                Cargando actividades...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white p-4 md:p-8 mt-15">
            <h1 className="text-2xl font-bold mb-6">
                Actividad reciente
            </h1>

            <div className="flex flex-col gap-4">

                {feed.map((item) => (
                    <div
                        key={item.id}
                        className="bg-[#121827] rounded-xl p-3 flex items-center gap-3 hover:bg-[#1a2533] transition"
                    >
                        {/* USER */}
                        <img
                            src={
                                item.imatge_perfil
                                    ? `${import.meta.env.VITE_API_URL}${item.imatge_perfil}`
                                    : "https://static.vecteezy.com/system/resources/thumbnails/036/885/313/small/blue-profile-icon-free-png.png"
                            }
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        {/* TEXT */}
                        <div className="flex-1">
                            <div className="flex gap-2 items-center">
                                <span
                                    onClick={() =>
                                        navigate(`/lista/${item.nom_usuari}/${item.id_usuari}`)
                                    }
                                    className="font-bold cursor-pointer hover:underline"
                                >
                                    {item.nom_usuari}
                                </span>

                                <span className="text-xs text-slate-400">
                                    {formatDate(item.created_at)}
                                </span>
                            </div>

                            <p className="text-sm text-slate-300">
                                {actionText(item.action)}
                            </p>

                            <p
                                onClick={() =>
                                    navigate(`/anime/${item.id_anime}`)
                                }
                                className="text-cyan-400 font-semibold cursor-pointer hover:underline"
                            >
                                {item.titol}
                            </p>

                            {item.episodios_vistos > 0 && (
                                <p className="text-xs text-slate-400">
                                    Episodios vistos: {item.episodios_vistos}
                                </p>
                            )}
                        </div>

                        {/* IMAGE */}
                        <img
                            src={item.imatge}
                            className="w-14 h-20 rounded-md object-cover"
                        />
                    </div>
                ))}

            </div>
        </div>
    );
}