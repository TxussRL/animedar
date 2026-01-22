function Navbar({ ponerVista }) {
    return (
        <nav class="w-full bg-slate-900 shadow-md animate-fade-in">
            <div class="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">

                <div className="text-xl font-bold text-white cursor-pointer"
                    onClick={() => ponerVista("main")}>
                    <img src="/src/img/logo.png" alt="Logo" className="h-auto w-28"></img>
                </div>

                <div class="flex gap-4">
                    <button class="text-slate-300 hover:text-white transition cursor-pointer"
                        onClick={() => ponerVista("login")}>
                        Iniciar sesión
                    </button>

                    <button class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                        onClick={() => ponerVista("register")}>
                        Registrarse
                    </button>
                </div>

            </div>
        </nav>

    );
}

export default Navbar;
