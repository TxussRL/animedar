import { useState } from "react";

export default function UserSettings({ user, UpdateUser, mostrarAlerta }) {
    const [name, setName] = useState(user?.nom_usuari || "");
    const [isPrivate, setIsPrivate] = useState(Boolean(user?.privado));
    const [avatarFile, setAvatarFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const token = localStorage.getItem("token");

    // Nombre + Privacidad
    const saveProfile = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, isPrivate }),
            });

            if (!res.ok) throw new Error("Error guardando perfil");
            mostrarAlerta("Perfil actualizado ");

            const data = await res.json();
            const updatedUser = { ...user, nom_usuari: data.user.nom_usuari, privado: data.user.privado };
            UpdateUser(updatedUser);
        } catch (err) {
            mostrarAlerta(err.message);
        } finally {
            setLoadingProfile(false);
        }
    };

    // Avatar solo
    const saveAvatar = async (e) => {
        e.preventDefault();
        if (!avatarFile) return mostrarAlerta("Selecciona un avatar");

        setLoadingAvatar(true);

        try {
            const formData = new FormData();
            formData.append("avatar", avatarFile);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me/avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Error subiendo avatar");
            mostrarAlerta("Avatar actualizado ");
            const data = await res.json();
            const updatedUser = { ...user, avatar: data.avatar };
            UpdateUser(updatedUser);
        } catch (err) {
            mostrarAlerta(err.message);
        } finally {
            setLoadingAvatar(false);
        }
    };

    // Contraseña
    const changePassword = async (e) => {
        e.preventDefault();
        setLoadingPassword(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me/password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!res.ok) throw new Error("Error cambiando contraseña");
            mostrarAlerta("Contraseña actualizada ");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            mostrarAlerta(err.message);
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#0f1923] px-4 pt-28 pb-16 text-white">
            <div className="mx-auto max-w-2xl space-y-8">
                <h1 className="text-3xl font-bold">Settings</h1>

                {/* PERFIL */}
                <form onSubmit={saveProfile} className="space-y-4 rounded-xl border border-slate-700/60 bg-[#152332] p-6">
                    <h2 className="text-lg font-semibold">Perfil</h2>

                    <div>
                        <label className="text-sm text-slate-300">Nombre</label>
                        <input
                            className="mt-1 w-full rounded-lg border border-slate-700 bg-transparent p-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-300">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        Perfil privado
                    </label>

                    <button
                        type="submit"
                        disabled={loadingProfile}
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-black hover:bg-cyan-400 disabled:opacity-50"
                    >
                        Guardar perfil
                    </button>
                </form>

                {/* AVATAR */}
                <form onSubmit={saveAvatar} className="space-y-4 rounded-xl border border-slate-700/60 bg-[#152332] p-6">
                    <h2 className="text-lg font-semibold">Avatar</h2>

                    <input
                        type="file"
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-transparent p-2"
                        onChange={(e) => setAvatarFile(e.target.files[0])}
                    />

                    <button
                        type="submit"
                        disabled={loadingAvatar}
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-black hover:bg-cyan-400 disabled:opacity-50"
                    >
                        Subir avatar
                    </button>
                </form>

                {/* PASSWORD */}
                <form onSubmit={changePassword} className="space-y-4 rounded-xl border border-slate-700/60 bg-[#152332] p-6">
                    <h2 className="text-lg font-semibold">Contraseña</h2>

                    <input
                        type="password"
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-transparent p-2"
                        placeholder="Contraseña actual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-transparent p-2"
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loadingPassword}
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-black hover:bg-cyan-400 disabled:opacity-50"
                    >
                        Cambiar contraseña
                    </button>
                </form>
            </div>
        </section>
    );
}