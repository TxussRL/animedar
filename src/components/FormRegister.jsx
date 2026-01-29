import { useState } from "react";

export default function Register() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirm) {
            alert("Las contrasenyas no coinciden");
            return;
        }

        const usuario = {
            email,
            password
        };

        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        const data = await res.json();
        alert(data.message);
    };


    return (
        <div className="flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-80"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Registro
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
};
