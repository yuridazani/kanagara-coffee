// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    // Fungsi untuk scroll ke section (tidak berubah)
    const scrollToSection = (sectionId) => {
        if (window.location.pathname === '/') {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.location.href = `/#${sectionId}`;
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="font-serif font-black text-2xl text-wood-brown">
                    Kanagara Coffee
                </Link>
                
                {/* === NAVIGASI DIPERBARUI === */}
                <nav className="hidden md:flex items-center space-x-6 text-charcoal font-bold text-sm">
                    {/* Menggunakan button untuk scroll di halaman yang sama */}
                    <button onClick={() => scrollToSection('home')} className="hover:text-wood-brown transition-colors">Home</button>
                    <button onClick={() => scrollToSection('about')} className="hover:text-wood-brown transition-colors">Tentang</button>
                    <button onClick={() => scrollToSection('fasilitas')} className="hover:text-wood-brown transition-colors">Fasilitas</button>
                    <button onClick={() => scrollToSection('galeri')} className="hover:text-wood-brown transition-colors">Galeri</button>
                    
                    {/* Menggunakan Link untuk pindah halaman */}
                    <Link to="/menu" className="hover:text-wood-brown transition-colors">Menu</Link>
                    <Link to="/ulasan" className="hover:text-wood-brown transition-colors">Ulasan</Link>

                    {/* Grup Reservasi & Lacak */}
                    <div className="flex items-center space-x-6 pl-4 border-l border-charcoal/20">
                        <Link to="/tracking" className="hover:text-wood-brown transition-colors">Lacak</Link>
                        <button 
                            onClick={() => scrollToSection('booking')} 
                            className="bg-wood-brown text-soft-white font-bold py-2 px-5 rounded-full hover:bg-light-brown transition-colors"
                        >
                            Reservasi
                        </button>
                    </div>
                </nav>
                
                {/* Tombol Reservasi mobile (jika ada, bisa ditambahkan di sini) */}
                <div className="md:hidden">
                     <button 
                        onClick={() => scrollToSection('booking')} 
                        className="bg-wood-brown text-soft-white font-bold py-2 px-4 rounded-full text-sm"
                    >
                        Reservasi
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;