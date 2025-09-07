// src/components/GaleriSection.jsx

import React from 'react';
import { Instagram } from 'lucide-react';

// Daftar gambar untuk galeri.
const galleryImages = [
    {
        src: 'https://images.unsplash.com/photo-1511920183353-3c7c95a57424?q=80&w=1287&auto=format&fit=crop',
        alt: 'Barista profesional sedang menyiapkan kopi spesial.',
    },
    {
        src: 'https://images.unsplash.com/photo-1559925233-8d6342e8d354?q=80&w=1262&auto=format&fit=crop',
        alt: 'Area duduk outdoor yang asri dan nyaman.',
    },
    {
        src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1287&auto=format&fit=crop',
        alt: 'Menikmati secangkir kopi hangat di pagi hari.',
    },
    {
        src: 'https://images.unsplash.com/photo-1528699633785-6741409a6c76?q=80&w=1287&auto=format&fit=crop',
        alt: 'Interior kafe dengan desain Joglo modern yang hangat.',
    },
    {
        src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop',
        alt: 'Suasana ramai saat acara komunitas di Kanagara.',
    },
    {
        src: 'https://images.unsplash.com/photo-1572498288022-203494aed9a5?q=80&w=1287&auto=format&fit=crop',
        alt: 'Detail latte art yang dibuat dengan presisi tinggi.',
    },
    { // Tambahan gambar agar galeri lebih penuh
        src: 'https://images.unsplash.com/photo-1534723447957-c3ac2c04f981?q=80&w=1287&auto=format&fit=crop',
        alt: 'Pengunjung menikmati waktu di area lounge kafe.',
    },
    {
        src: 'https://images.unsplash.com/photo-1543307771-55dc033878b2?q=80&w=1287&auto=format&fit=crop',
        alt: 'Pilihan kue dan pastry segar yang lezat.',
    },
];

const GaleriSection = () => {
    return (
        <section id="galeri" className="py-16 px-4 bg-cream">
            <div className="container mx-auto">
                <div className="text-center mb-10" data-aos="fade-up">
                    <h2 className="font-serif font-black text-4xl text-wood-brown">
                        Galeri Kanagara
                    </h2>
                    <p className="mt-4 text-charcoal/80 max-w-2xl mx-auto">
                        Lihat lebih dekat suasana hangat dan setiap sudut nyaman yang kami tawarkan.
                    </p>
                </div>

                {/* Grid Galeri Foto yang Diperkecil */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" data-aos="fade-up" data-aos-delay="200">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer">
                            <img 
                                src={image.src} 
                                alt={image.alt} 
                                // === PERUBAHAN UTAMA DI SINI ===
                                className="w-full h-56 md:h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                // 'h-56' berarti tinggi tetap 14rem (sekitar 224px) di semua ukuran layar
                                // 'md:h-64' membuat tingginya sedikit lebih besar di layar menengah ke atas (16rem atau 256px)
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-center text-xs md:text-sm">{image.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tombol Aksi (tidak berubah) */}
                <div className="text-center mt-12" data-aos="fade-up">
                    <a 
                        href="https://www.instagram.com/kanagara.coffee/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-wood-brown text-white font-bold py-3 px-8 rounded-full hover:bg-light-brown transition-colors inline-flex items-center gap-2"
                    >
                        <Instagram size={20} /> Lihat Lebih Banyak di Instagram
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GaleriSection;