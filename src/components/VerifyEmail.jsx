import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function verifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            const token = searchParams.get("token");
            if (!token) {
                setStatus("error");
                setMessage("Token no proporcionat");
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost:3000/api/auth/verify-email?token=${token}`
                );
                const data = await res.json();
                setStatus(res.ok ? "success" : "error");
                setMessage(data.message);
            } catch {
                setStatus("error");
                setMessage("Error de connexió");
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div>
            {status === "loading" && <p>⏳ Verificant...</p>}
            {status === "success" && (
                <div>
                    <h2>✅ Correu verificat!</h2>
                    <p>{message}</p>
                    <Link to="/login">Iniciar sessió</Link>
                </div>
            )}
            {status === "error" && (
                <div>
                    <h2>❌ Error</h2>
                    <p>{message}</p>
                    <Link to="/register">Tornar al registre</Link>
                </div>
            )}
        </div>
    );
}