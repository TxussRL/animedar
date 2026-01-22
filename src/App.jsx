import { useState } from "react";
import Navbar from "./components/NavBar";
import Main from "./components/Main";

function App() {
  const [vista, setVista] = useState("main"); // main | login | register

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar ponerVista={setVista} />

      <main className="flex justify-center items-center mt-20">
        {vista === "main" && (
          <Main />
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
