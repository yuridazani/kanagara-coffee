// src/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const images = [
    'https://images.unsplash.com/photo-1559305417-7d08c547c4c3?q=80&w=2574&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2537&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2670&auto=format&fit=crop',
];

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tagline, setTagline] = useState("Temukan kenyamanan dan secangkir kopi sempurna di Kanagara.");

    useEffect(() => {
        // Ambil data dari localStorage, jika tidak ada, gunakan default
        const savedData = JSON.parse(localStorage.getItem('siteData')) || {};
        setTagline(savedData.heroTagline || "Temukan kenyamanan dan secangkir kopi sempurna di Kanagara.");
        
        AOS.init({ duration: 1000, once: true });
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 5000); // Ganti gambar setiap 5 detik
        
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="home" className="relative h-screen flex items-center justify-center text-center text-soft-white">
            {/* Image Slider Background */}
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${image})` }}
                />
            ))}
            
            <div className="absolute inset-0 bg-black/60"></div>
            
            <div className="relative z-10 p-4" data-aos="fade-up">
                <h2 className="font-serif font-black text-5xl md:text-7xl">Enjoy Your Coffee Moments</h2>
                <p className="mt-4 text-lg">{tagline}</p> {/* <-- Gunakan data dinamis */}
                <div className="mt-8 space-x-4">
                    <a href="#menu-preview" className="bg-soft-white text-charcoal font-bold py-3 px-8 rounded-full">Lihat Menu</a>
                    <a href="#booking" className="border-2 border-soft-white text-soft-white font-bold py-3 px-8 rounded-full">Reservasi Meja</a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;