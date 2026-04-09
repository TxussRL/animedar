import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Inici from "./components/Inici";
import Login from "./components/FormIniciarSessio";
import Register from "./components/FormRegister";
import VerifyEmail from "./components/verifyEmail";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token guardado al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-100"></div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex justify-center items-center mt-20">
        <Routes>
          <Route path="/" element={<Inici user={user} />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} user={user} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;