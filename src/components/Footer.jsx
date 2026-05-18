export default function Footer() {
    return (
        <footer className="bg-[#0f1923] border-t border-slate-800/60">
            <div className="mx-auto max-w-[1400px] px-6 py-12 grid gap-10 md:grid-cols-4 text-sm text-slate-400">

                {/* Logo */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
                        <span className="text-white font-bold text-lg tracking-tight">AniMedar</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                        Descubre, guarda y comparte tus animes favoritos con filtros avanzados y recomendaciones.
                    </p>
                </div>

                {/* Navegación */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Navegación</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:text-cyan-300">Inicio</a></li>
                        <li><a href="/anime/buscar" className="hover:text-cyan-300">Buscar</a></li>
                        <li><a href="/anime/top-100" className="hover:text-cyan-300">Top 100</a></li>
                        <li><a href="/anime/social" className="hover:text-cyan-300">Comunidad</a></li>
                    </ul>
                </div>

                {/* Cuenta */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Cuenta</h3>
                    <ul className="space-y-2">
                        <li><a href="/auth/login" className="hover:text-cyan-300">Iniciar sesión</a></li>
                        <li><a href="/auth/register" className="hover:text-cyan-300">Registrarse</a></li>
                        <li><a href="/settings" className="hover:text-cyan-300">Configuración</a></li>
                    </ul>
                </div>

                {/* Extras */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Recursos</h3>
                    <ul className="space-y-2">
                        <li><a href="/anime/top-100" className="hover:text-cyan-300">Los Mejores Animes</a></li>
                        <li><a href="/anime/forum" className="hover:text-cyan-300">Foro</a></li>
                        <li><a href="https://docs.anilist.co/" target="_blank" rel="noreferrer" className="hover:text-cyan-300">AniList API GraphQL</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} Jesús Aldoman Ortiz · Hecho con AniList GraphQL
            </div>
        </footer>
    );
}