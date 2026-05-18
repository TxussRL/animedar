import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Inici from "./components/Inici";
import AuthRoutes from "./routes/AuthRoutes";
import AnimeRoutes from "./routes/AnimeRoutes";
import Footer from "./components/Footer";
import UserSettings from "./components/Settings";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Verificar si hay un token guardado al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
        setToken(token);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const [alerta, setAlerta] = useState("");

  const mostrarAlerta = (missatge) => {
    setAlerta(missatge);
    setTimeout(() => setAlerta(""), 3000);
  };

  function handleUpdateUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  function RequireAuth({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/auth/login" replace />;
  }

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
      {
        alerta && (
          <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-cyan-500 px-4 py-2 text-sm text-black shadow-lg">
            {alerta}
          </div>
        )
      }

      <main>
        <Routes>
          <Route path="/" element={<Inici user={user} />} />
          <Route path="/auth/*" element={<AuthRoutes onLogin={handleLogin} user={user} />} />
          <Route path="/anime/*" element={<AnimeRoutes user={user} />} />

          <Route path="/settings" element={<RequireAuth><UserSettings user={user} UpdateUser={handleUpdateUser} mostrarAlerta={mostrarAlerta} /></RequireAuth>} />

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

      <Footer />
    </div>
  );
}

export default App;