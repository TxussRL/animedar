

export default function App() {

  return (
    <>
      <nav className="w-full bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="text-xl font-bold text-white">
            AniMedar
          </div>

          <div className="flex gap-4">
            <button className="text-slate-300 hover:text-white transition">
              Iniciar sesión
            </button>

            <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Registrarse
            </button>
          </div>

        </div>
      </nav>



    </>
  )
}


