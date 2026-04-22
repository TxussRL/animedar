import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        {
            to: "/",
            label: "Inicio",
            activePatterns: ["/"],
            icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                </svg>
            ),
        },
        {
            to: "/anime/buscar",
            label: "Buscar",
            activePatterns: ["/anime/buscar"],
            icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
        },
        {
            to: "/anime/top-100",
            label: "Top 100",
            activePatterns: ["/anime/top-100", "/anime/tendencias", "/anime/trending"],
            icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
        {
            to: "/anime/social",
            label: "Social",
            activePatterns: ["/anime/social"],
            icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V9H2v11h5m10 0v-5a3 3 0 00-6 0v5m6 0H9" />
                </svg>
            ),
        },
        {
            to: "/anime/forum",
            label: "Forum",
            activePatterns: ["/anime/forum"],
            icon: (
                <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path id="primary" d="M18.81,16.23,20,21l-4.95-2.48A9.84,9.84,0,0,1,12,19c-5,0-9-3.58-9-8s4-8,9-8,9,3.58,9,8A7.49,7.49,0,0,1,18.81,16.23Z"></path>
                </svg>
            ),
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        onLogout();
        navigate("/");
    };

    const isActive = (patterns = []) => {
        return patterns.some((path) => {
            if (path === "/") return location.pathname === "/";
            return location.pathname === path || location.pathname.startsWith(`${path}/`);
        });
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-[#0f1923]/95 backdrop-blur-xl shadow-lg shadow-black/20"
                : "bg-linear-to-b from-[#0f1923]/90 to-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="relative">
                        <img
                            src="/logo.svg"
                            alt="AniMedar"
                            className="h-9 w-9 transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight transition-transform duration-300 group-hover:scale-110">
                        Ani<span className="text-cyan-400">Medar</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-1 ml-8 justify-center">
                    {navLinks.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.activePatterns)
                                ? "text-cyan-400"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                            {isActive(item.activePatterns) && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-cyan-400 rounded-full"></span>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Auth Controls */}
                <div className="ml-auto flex gap-3 items-center">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/20">
                                    {user.nom_usuari?.charAt(0)?.toUpperCase()}
                                </div>
                                <span className="hidden sm:block text-sm text-slate-300">
                                    {user.nom_usuari}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="hidden md:inline-flex px-4 py-2 text-sm text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex gap-3 items-center">
                            <Link to="/auth/login">
                                <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer">
                                    Iniciar sesión
                                </button>
                            </Link>
                            <Link to="/auth/register">
                                <button className="px-5 py-2 text-sm font-medium bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 cursor-pointer">
                                    Registrarse
                                </button>
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
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
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
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.activePatterns)
                                    ? "text-cyan-400 bg-cyan-500/10"
                                    : "text-slate-300 hover:text-white hover:bg-white/5"
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}

                        <div className="h-px bg-slate-700/70 my-1"></div>

                        {user ? (
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full px-3 py-2.5 text-left rounded-lg text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200"
                            >
                                Salir
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/auth/login"
                                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className="px-3 py-2.5 rounded-lg text-sm font-medium bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;