import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

    const navLinks = [
        {
            to: "/", label: "Inicio", activePatterns: ["/"], icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                </svg>
            )
        },
        {
            to: "/anime/buscar", label: "Buscar", activePatterns: ["/anime/buscar"], icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            to: "/anime/top-100", label: "Top 100", activePatterns: ["/anime/top-100", "/anime/tendencias", "/anime/trending"], icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        {
            to: "/anime/forum", label: "Forum", activePatterns: ["/anime/forum"], icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M18.81,16.23,20,21l-4.95-2.48A9.84,9.84,0,0,1,12,19c-5,0-9-3.58-9-8s4-8,9-8,9,3.58,9,8A7.49,7.49,0,0,1,18.81,16.23Z" />
                </svg>
            )
        },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileProfileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        onLogout();
        navigate("/");
    };

    const isActive = (patterns = []) =>
        patterns.some((path) =>
            path === "/" ? location.pathname === "/" : location.pathname === path || location.pathname.startsWith(`${path}/`)
        );
    const avatarUrl = user?.avatar ? `http://localhost:3000${user.avatar}` : null;

    const avatar = avatarUrl ? (
        <img
            src={avatarUrl}
            alt={user.nom_usuari}
            className="w-8 h-8 rounded-full object-cover border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
        />
    ) : (
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/20">
            {user?.nom_usuari?.charAt(0)?.toUpperCase()}
        </div>
    );

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#0f1923]/95 backdrop-blur-xl shadow-lg shadow-black/20" : "bg-linear-to-b from-[#0f1923]/90 to-transparent"}`}>
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <img src="/logo.svg" alt="AniMedar" className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-xl font-bold text-white tracking-tight transition-transform duration-300 group-hover:scale-110">
                        Ani<span className="text-cyan-400">Medar</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1 ml-8 justify-center">
                    {navLinks.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.activePatterns) ? "text-cyan-400" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                        >
                            {item.icon}
                            {item.label}
                            {isActive(item.activePatterns) && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-cyan-400 rounded-full"></span>}
                        </Link>
                    ))}
                </div>

                <div className="ml-auto flex gap-3 items-center">
                    {user ? (
                        <div className="hidden md:flex items-center gap-2.5">
                            <div className="relative group">
                                <div className="flex items-center gap-2 cursor-pointer">
                                    {avatar}
                                    <span className="text-sm text-slate-300">{user.nom_usuari}</span>
                                </div>

                                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-700/60 bg-[#111f2c]/95 backdrop-blur-xl shadow-xl shadow-black/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <Link to={`/user/${user.nom_usuari}`} className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-tl-xl rounded-tr-xl">Mi perfil</Link>
                                    <Link to="/settings" className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/5">Settings</Link>
                                    <div className="h-px bg-slate-700/70 my-1"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 rounded-bl-xl rounded-br-xl">Salir</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex gap-3 items-center">
                            <Link to="/auth/login">
                                <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer">Iniciar sesión</button>
                            </Link>
                            <Link to="/auth/register">
                                <button className="px-5 py-2 text-sm font-medium bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 cursor-pointer">Registrarse</button>
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 text-slate-200 hover:text-white hover:border-cyan-500/60 hover:bg-white/5 transition-all duration-200"
                        aria-label="Abrir menú"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden px-6 pb-4">
                    <div className="rounded-2xl border border-slate-700/60 bg-[#111f2c]/95 backdrop-blur-xl p-3 flex flex-col gap-2 shadow-xl shadow-black/30">
                        {navLinks.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.activePatterns) ? "text-cyan-400 bg-cyan-500/10" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}

                        <div className="h-px bg-slate-700/70 my-1"></div>

                        {user ? (
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMobileProfileOpen((prev) => !prev)}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5"
                                >
                                    {avatar}
                                    {user.nom_usuari}
                                </button>

                                {mobileProfileOpen && (
                                    <div className="pl-3 flex flex-col gap-1">
                                        <Link to={`/user/${user.nom_usuari}`} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5">Mi perfil</Link>
                                        <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5">Settings</Link>
                                        <div className="h-px bg-slate-700/70 my-1"></div>
                                        <button
                                            onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10"
                                        >
                                            Salir
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/auth/login" className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>Iniciar sesión</Link>
                                <Link to="/auth/register" className="px-3 py-2.5 rounded-lg text-sm font-medium bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500" onClick={() => setMobileMenuOpen(false)}>Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;