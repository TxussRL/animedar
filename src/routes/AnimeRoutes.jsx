import { Navigate, Route, Routes } from "react-router-dom";
import Inici from "../components/Inici";
import AnimeBuscar from "../components/AnimeBuscar";
import Top100Anime from "../components/Top100Anime";
import AnimeInformation from "../components/AnimeInformation"

function AnimeRoutes({ user }) {
    return (
        <Routes>
            <Route index element={<Navigate to="buscar" replace />} />
            <Route path="buscar" element={<AnimeBuscar user={user} />} />
            <Route path="top-100" element={<Top100Anime user={user} />} />
            <Route path="tendencias" element={<Navigate to="/anime/top-100" replace />} />
            <Route path="trending" element={<Navigate to="/anime/top-100" replace />} />
            <Route path="social" element={<Inici user={user} />} />
            <Route path="forum" element={<Inici user={user} />} />
            <Route path=":id" element={<AnimeInformation user={user} />} />
            <Route path="*" element={<Navigate to="buscar" replace />} />
        </Routes>
    );
}

export default AnimeRoutes;