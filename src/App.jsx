import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Inici from "./components/Inici";
import Login from "./components/FormIniciarSessio";
import Register from "./components/FormRegister";

function App() {

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="flex justify-center items-center mt-20">
        <Routes>
          <Route path="/" element={<Inici />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
