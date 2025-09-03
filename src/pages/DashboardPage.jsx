// src/pages/DashboardPage.jsx

import React from 'react';
import { BarChart, TrendingUp, Star } from 'lucide-react';

// Komponen Kalender Widget Sederhana
const CalendarWidget = () => {
    // Logika sederhana untuk menampilkan kalender (bisa dikembangkan lebih lanjut)
    const today = new Date();
    const month = today.toLocaleString('id-ID', { month: 'long' });
    const year = today.getFullYear();
    // Simulasi tanggal dengan reservasi
    const reservationDates = [5, 12, 25]; 

    return (
        <div className="bg-cream p-6 rounded-lg border border-wood-brown/20">
            <h3 className="font-bold text-charcoal text-center mb-4">{month} {year}</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map(day => <div key={day} className="font-bold">{day}</div>)}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                    <div key={date} className="relative p-1">
                        {date}
                        {reservationDates.includes(date) && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>}
                    </div>
                ))}
            </div>
        </div>
    )
}

const DashboardPage = () => {
    // Data simulasi
    const reservationsToday = 5;
    const bestSellerMenu = "Brulee Caramel Latte";
    const averageRating = 4.8;

    return (
        // PERBAIKAN: Semua konten, termasuk judul, ada di dalam satu card besar
        <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-12">
            <div>
                <h1 className="font-serif font-black text-3xl text-wood-brown mb-2">Dashboard Ringkasan</h1>
                <p className="text-charcoal/70">Selamat datang kembali, Owner! Berikut adalah ringkasan aktivitas hari ini.</p>
            </div>
            
            {/* Kartu Statistik */}
            <section>
                <h2 className="font-bold text-xl text-charcoal mb-4">Statistik Kunci</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-cream p-6 rounded-lg border border-wood-brown/20">
                        <h3 className="font-bold text-charcoal">Reservasi Hari Ini</h3>
                        <p className="font-serif font-black text-4xl text-wood-brown mt-2">{reservationsToday}</p>
                    </div>
                    <div className="bg-cream p-6 rounded-lg border border-wood-brown/20">
                        <h3 className="font-bold text-charcoal">Menu Terlaris</h3>
                        <p className="font-serif font-black text-2xl text-wood-brown mt-2">{bestSellerMenu}</p>
                    </div>
                    <div className="bg-cream p-6 rounded-lg border border-wood-brown/20">
                        <h3 className="font-bold text-charcoal">Rating Rata-Rata</h3>
                        <p className="font-serif font-black text-4xl text-wood-brown mt-2">{averageRating} <span className="text-2xl text-yellow-500">★</span></p>
                    </div>
                </div>
            </section>
            
            {/* Bagian Baru: Kalender & Grafik */}
            <section className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="font-bold text-xl text-charcoal mb-4">Kalender Reservasi</h2>
                    <CalendarWidget />
                </div>
                <div>
                    <h2 className="font-bold text-xl text-charcoal mb-4">Grafik Reservasi (Mingguan)</h2>
                    <div className="bg-cream p-6 rounded-lg border border-wood-brown/20 h-full flex items-center justify-center">
                        <BarChart size={100} className="mx-auto text-charcoal/20"/>
                        <p className="text-center text-charcoal/60 italic ml-4">
                            (Visualisasi grafik akan ditampilkan di sini)
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;