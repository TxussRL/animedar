import { useState } from "react";
import Navbar from "./components/NavBar";

function App() {
  const [vista, setVista] = useState("main"); // main | login | register

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar setVista={setVista} />

      <main className="flex justify-center items-center mt-20">
        {vista === "main" && (
          <h1 className="text-2xl font-bold text-black">
            Estás en el MAIN
          </h1>
        )}

        {vista === "login" && (
          <h1 className="text-2xl font-bold text-black">
            Formulario de Login
          </h1>
        )}

        {vista === "register" && (
          <h1 className="text-2xl font-bold text-black">
            Formulario de Registro
          </h1>
        )}
      </main>
    </div>
  );
}

export default App;
