// src/components/BookingSection.jsx

import React from 'react';
import { Calendar } from 'lucide-react';

// Terima 'onOpenModal' sebagai prop untuk memicu modal dari App.jsx
const BookingSection = ({ onOpenModal }) => {
    return (
        <section id="booking" className="py-20 px-4 bg-cream text-center">
            <div className="container mx-auto max-w-3xl" data-aos="fade-up">
                <h2 className="font-serif font-black text-4xl md:text-6xl text-wood-brown">
                    Ciptakan Momen Spesial Anda
                </h2>
                <p className="mt-6 text-charcoal/80 leading-relaxed max-w-2xl mx-auto">
                    Baik untuk pertemuan santai, rapat kerja, atau perayaan khusus, Kanagara menyediakan ruang yang sempurna untuk setiap kesempatan. Dengan pilihan area Indoor, Outdoor, hingga VIP Room yang eksklusif, kami siap membantu Anda menciptakan momen yang tak terlupakan.
                </p>
                <button
                    onClick={onOpenModal}
                    className="mt-8 bg-wood-brown text-soft-white font-bold py-4 px-10 rounded-full hover:bg-light-brown transition-colors inline-flex items-center space-x-2"
                >
                    <Calendar size={20} />
                    <span>Buat Reservasi Sekarang</span>
                </button>
            </div>
        </section>
    );
};

export default BookingSection;