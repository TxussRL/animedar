import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const verify = async () => {
            const token = searchParams.get("token");
            if (!token) {
                setStatus("error");
                setMessage("Token no proporcionat");
                return;
            }

            try {
                const res = await fetch(`http://localhost:3000/api/auth/verify-email?token=${token}`);
                const data = await res.json();
                setStatus(res.ok ? "success" : "error");
                setMessage(data.message);
            } catch (error) {
                console.log(error);
                setStatus("error");
                setMessage("Error de connexió");
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            {status === "loading" && (
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 font-medium">Verificant el compte...</p>
                </div>
            )}
            {status === "success" && (
                <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Correu verificat!</h2>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <Link to="/auth/login" className="inline-block w-full px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
                        Iniciar sessió
                    </Link>
                </div>
            )}
            {status === "error" && (
                <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de verificació</h2>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <Link to="/auth/register" className="inline-block w-full px-6 py-3 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-medium transition-colors">
                        Tornar al registre
                    </Link>
                </div>
            )}
        </div>
    );
}