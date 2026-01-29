

export default function Inici() {
    return (
        <div className="w-full bg-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Bienvenido a AnimeDar</h1>
                <p className="text-slate-600 mb-6">Explora y comparte tu anime favorito con nuestra comunidad.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">Anime Populares</h2>
                        <p className="text-slate-600">Descubre los animes más populares de la actualidad.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">Novedades</h2>
                        <p className="text-slate-600">Mantente al día con las últimas novedades del mundo anime.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">Comunidad</h2>
                        <p className="text-slate-600">Conecta con otros fans y comparte tus opiniones.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}