import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Inici from "./components/Inici";
import AuthRoutes from "./routes/AuthRoutes";
import AnimeRoutes from "./routes/AnimeRoutes";

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
    return <div className="min-h-screen bg-[#0f1923]"></div>;
  }

  return (
    <div className="min-h-screen bg-[#0f1923]">
      <Navbar user={user} onLogout={handleLogout} />

      <main>
        <Routes>
          <Route path="/" element={<Inici user={user} />} />
          <Route path="/auth/*" element={<AuthRoutes onLogin={handleLogin} user={user} />} />
          <Route path="/anime/*" element={<AnimeRoutes user={user} />} />

          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          <Route path="/verify-email" element={<Navigate to="/auth/verify-email" replace />} />
          <Route path="/buscar" element={<Navigate to="/anime/buscar" replace />} />
          <Route path="/tendencias" element={<Navigate to="/anime/top-100" replace />} />
          <Route path="/trending" element={<Navigate to="/anime/top-100" replace />} />
          <Route path="/social" element={<Navigate to="/anime/social" replace />} />
          <Route path="/forum" element={<Navigate to="/anime/forum" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;