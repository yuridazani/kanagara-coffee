// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {

    // Fungsi untuk scroll ke section setelah kembali ke homepage
    const scrollToSection = (sectionId) => {
        // Cek apakah kita sudah di homepage
        if (window.location.pathname === '/') {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Jika tidak, navigasi ke homepage dengan hash
            window.location.href = `/#${sectionId}`;
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Logo sekarang selalu mengarah ke atas homepage */}
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="font-serif font-black text-2xl text-wood-brown">
                    Kanagara
                </Link>
                
                <nav className="hidden md:flex items-center space-x-8 text-charcoal font-bold">
                    {/* Menggunakan onClick untuk handle scroll */}
                    <button onClick={() => scrollToSection('home')} className="hover:text-wood-brown">Home</button>
                    <button onClick={() => scrollToSection('about')} className="hover:text-wood-brown">About</button>
                    
                    {/* Link ini ke halaman baru, jadi gunakan Link */}
                    <Link to="/menu" className="hover:text-wood-brown">Menu</Link>
                    
                    <button onClick={() => scrollToSection('booking')} className="hover:text-wood-brown">Reservasi</button>
                </nav>
                
                <button 
                    onClick={() => scrollToSection('booking')} 
                    className="hidden md:block bg-wood-brown text-soft-white font-bold py-2 px-6 rounded-full hover:bg-light-brown transition-colors"
                >
                    Reservasi Sekarang
                </button>
            </div>
        </header>
    );
};

export default Header;