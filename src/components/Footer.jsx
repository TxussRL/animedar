export default function Footer() {
    return (
        <footer className="bg-[#0f1923] border-t border-slate-800/60">
            <div className="mx-auto max-w-[1400px] px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
                    <span className="text-white font-bold text-lg tracking-tight">AniMedar</span>
                </div>

                <p className="text-sm text-slate-400 text-center md:text-right">
                    Hecho por Jesús Aldoman Ortiz · Usa la API de AniList (GraphQL)
                </p>
            </div>

            <div className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} Jesús Aldoman Ortiz. Todos los derechos reservados.
            </div>
        </footer>
    );
}