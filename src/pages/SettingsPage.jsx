// src/pages/SettingsPage.jsx
import React from 'react';

const SettingsPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Pengaturan berhasil disimpan (simulasi).");
    };

    return (
        <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-8">
            <div>
                <h1 className="font-serif font-black text-3xl text-wood-brown">Pengaturan Akun</h1>
                <p className="text-charcoal/70 mt-1">Ubah detail profil dan keamanan akun Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t">
                {/* Ganti Foto Profil */}
                <div className="flex items-center space-x-6">
                    <img src="https://i.pravatar.cc/150" alt="Owner" className="w-24 h-24 rounded-full" />
                    <div>
                        <label htmlFor="photo" className="font-bold">Ganti Foto Profil</label>
                        <input type="file" id="photo" className="mt-2 block text-sm" />
                    </div>
                </div>

                {/* Ganti Password */}
                <div>
                    <label htmlFor="current-password" cla ssName="font-bold">Password Saat Ini</label>
                    <input type="password" id="current-password" required className="mt-2 w-full max-w-sm p-2 border rounded-md" />
                </div>
                <div>
                    <label htmlFor="new-password" cla ssName="font-bold">Password Baru</label>
                    <input type="password" id="new-password" required className="mt-2 w-full max-w-sm p-2 border rounded-md" />
                </div>
                
                <button type="submit" className="bg-wood-brown hover:bg-light-brown text-white font-bold py-3 px-6 rounded-full">
                    Simpan Perubahan
                </button>
            </form>
        </div>
    );
};

export default SettingsPage;