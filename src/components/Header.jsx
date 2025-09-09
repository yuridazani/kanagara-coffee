// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close mobile menu when clicking outside or on overlay
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-button')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on component unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Fungsi untuk scroll ke section
    const scrollToSection = (sectionId) => {
        // Close mobile menu first
        setIsMenuOpen(false);
        
        if (window.location.pathname === '/') {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.location.href = `/#${sectionId}`;
        }
    };

    // Handle link clicks for mobile menu
    const handleMobileMenuClick = (callback) => {
        setIsMenuOpen(false);
        if (callback) callback();
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md shadow-md">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    
                    {/* Logo */}
                    <Link 
                        to="/" 
                        onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo(0, 0);
                        }} 
                        className="font-serif font-black text-xl sm:text-2xl text-wood-brown z-50 relative"
                    >
                        Kanagara Coffee
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6 text-charcoal font-bold text-sm">
                        <button onClick={() => scrollToSection('home')} className="hover:text-wood-brown transition-colors">
                            Home
                        </button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-wood-brown transition-colors">
                            Tentang
                        </button>
                        <button onClick={() => scrollToSection('fasilitas')} className="hover:text-wood-brown transition-colors">
                            Fasilitas
                        </button>
                        <button onClick={() => scrollToSection('galeri')} className="hover:text-wood-brown transition-colors">
                            Galeri
                        </button>
                        
                        <Link to="/menu" className="hover:text-wood-brown transition-colors">
                            Menu
                        </Link>
                        <Link to="/ulasan" className="hover:text-wood-brown transition-colors">
                            Ulasan
                        </Link>

                        <div className="flex items-center space-x-6 pl-4 border-l border-charcoal/20">
                            <Link to="/tracking" className="hover:text-wood-brown transition-colors">
                                Lacak
                            </Link>
                            <button 
                                onClick={() => scrollToSection('booking')} 
                                className="bg-wood-brown text-soft-white font-bold py-2 px-5 rounded-full hover:bg-light-brown transition-colors"
                            >
                                Reservasi
                            </button>
                        </div>
                    </nav>
                    
                    {/* Mobile Menu Button & Reservation */}
                    <div className="lg:hidden flex items-center space-x-3">
                        {/* Mobile Reservation Button */}
                        <button 
                            onClick={() => scrollToSection('booking')} 
                            className="bg-wood-brown text-soft-white font-bold py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm hover:bg-light-brown transition-colors"
                        >
                            Reservasi
                        </button>
                        
                        {/* Hamburger Menu Button */}
                        <button
                            className="hamburger-button p-2 text-wood-brown hover:text-light-brown transition-colors z-50 relative"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />
            )}

            {/* Mobile Navigation Menu */}
            <nav className={`mobile-menu fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-cream shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Header space to account for fixed header */}
                    <div className="h-20 flex items-center justify-end pr-4">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 text-wood-brown hover:text-light-brown transition-colors"
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 px-6 py-4 space-y-1">
                        <h3 className="font-serif font-bold text-lg text-wood-brown mb-6 pb-3 border-b border-wood-brown/20">
                            Menu Navigasi
                        </h3>

                        {/* Main Navigation */}
                        <div className="space-y-4">
                            <button 
                                onClick={() => handleMobileMenuClick(() => scrollToSection('home'))}
                                className="block w-full text-left py-3 px-4 text-charcoal font-semibold hover:bg-wood-brown/10 hover:text-wood-brown rounded-lg transition-colors"
                            >
                                Home
                            </button>
                            
                            <button 
                                onClick={() => handleMobileMenuClick(() => scrollToSection('about'))}
                                className="block w-full text-left py-3 px-4 text-charcoal font-semibold hover:bg-wood-brown/10 hover:text-wood-brown rounded-lg transition-colors"
                            >
                                Tentang Kami
                            </button>
                            
                            <button 
                                onClick={() => handleMobileMenuClick(() => scrollToSection('fasilitas'))}
                                className="block w-full text-left py-3 px-4 text-charcoal font-semibold hover:bg-wood-brown/10 hover:text-wood-brown rounded-lg transition-colors"
                            >
                                Fasilitas
                            </button>
                            
                            <button 
                                onClick={() => handleMobileMenuClick(() => scrollToSection('galeri'))}
                                className="block w-full text-left py-3 px-4 text-charcoal font-semibold hover:bg-wood-brown/10 hover:text-wood-brown rounded-lg transition-colors"
                            >
                                Galeri
                            </button>
                            
                            <Link 
                                to="/menu" 
                                onClick={() => handleMobileMenuClick()}
                                className="block w-full text-left py-3 px-4 text-charcoal font-semibold hover:bg-wood-brown/10 hover:text-wood-brown rounded-lg transition-colors"
                            >
                                Menu Lengkap
                            </Link>
                            
                            <Link 
                                to="/ulasan" 
                                onClick={() => handleMobileMenuClick()}
                                className="block w-full text-left py-3 px-4 text-charcoal font-semibold hover:bg-wood-brown/10 hover:text-wood-brown rounded-lg transition-colors"
                            >
                                Ulasan Pengunjung
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-wood-brown/20 my-6"></div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link 
                                to="/tracking" 
                                onClick={() => handleMobileMenuClick()}
                                className="block w-full text-center py-3 px-4 text-wood-brown font-bold border-2 border-wood-brown rounded-full hover:bg-wood-brown hover:text-cream transition-colors"
                            >
                                Lacak Reservasi
                            </Link>
                            
                            <button 
                                onClick={() => handleMobileMenuClick(() => scrollToSection('booking'))}
                                className="block w-full text-center py-3 px-4 bg-wood-brown text-cream font-bold rounded-full hover:bg-light-brown transition-colors"
                            >
                                Buat Reservasi
                            </button>
                        </div>
                    </div>

                    {/* Footer info */}
                    <div className="px-6 py-4 bg-wood-brown/5 text-center">
                        <p className="text-xs text-charcoal/70">
                            Kanagara Coffee & Space
                        </p>
                        <p className="text-xs text-charcoal/60 mt-1">
                            Senin - Minggu | 08.00 - 22.00 WIB
                        </p>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;