// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Simulasi Login Sederhana
        // Di aplikasi nyata, ini akan memanggil API ke backend
        if (email === 'admin@kanagara.com' && password === 'password123') {
            // Jika berhasil, simpan status login di localStorage
            localStorage.setItem('isLoggedIn', 'true');
            // Arahkan ke dashboard
            navigate('/dashboard');
        } else {
            setError('Email atau password salah.');
        }
    };

    return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-cream rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="font-serif font-black text-3xl text-wood-brown">Kanagara Dashboard</h1>
                    <p className="text-charcoal/70">Silakan masuk untuk melanjutkan</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="font-bold text-charcoal">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            defaultValue="admin@kanagara.com"
                            className="mt-2 w-full p-3 border border-wood-brown/20 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="font-bold text-charcoal">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            defaultValue="password123"
                            className="mt-2 w-full p-3 border border-wood-brown/20 rounded-md"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-wood-brown hover:bg-light-brown text-white font-bold py-3 rounded-full">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;