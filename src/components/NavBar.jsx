function Navbar({ setVista }) {
    return (
        <nav class="w-full bg-slate-900">
            <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <div className="text-xl font-bold text-white cursor-pointer"
                    onClick={() => setVista("main")}>
                    AniMedar
                </div>

                <div class="flex gap-4">
                    <button class="text-slate-300 hover:text-white transition cursor-pointer"
                        onClick={() => setVista("login")}>
                        Iniciar sesión
                    </button>

                    <button class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                        onClick={() => setVista("register")}>
                        Registrarse
                    </button>
                </div>

            </div>
        </nav>

    );
}

export default Navbar;
