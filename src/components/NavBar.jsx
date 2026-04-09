import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/");
    };

    return (
        <nav className="w-full bg-slate-900 shadow-md animate-fade-in">
            <div className="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">
                <div className="text-xl font-bold text-white cursor-pointer">
                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="h-auto w-28"></img>
                    </Link>
                </div>

                <div className="flex gap-4 items-center">
                    {user ? (
                        // Usuario logueado
                        <div className="flex gap-4 items-center">
                            <span className="text-slate-300">
                                Bienvenido, <span className="font-semibold text-white">{user.nom_usuari}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        // Usuario no logueado
                        <>
                            <Link to="/login">
                                <button className="text-slate-300 hover:text-white transition cursor-pointer">
                                    Iniciar sesión
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer">
                                    Registrarse
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;