// src/components/FasilitasSection.jsx

import React from 'react';
import { Wifi, PlugZap, Wind, ParkingCircle, Users, Church } from 'lucide-react';

const facilities = [
    {
        icon: <Wifi size={40} className="mx-auto text-wood-brown" />,
        name: 'Wi-Fi Cepat',
        description: 'Tetap terhubung dengan koneksi internet berkecepatan tinggi, gratis untuk semua pengunjung.'
    },
    {
        icon: <PlugZap size={40} className="mx-auto text-wood-brown" />,
        name: 'Stopkontak',
        description: 'Tersedia banyak stopkontak di berbagai sudut, cocok untuk bekerja atau belajar.'
    },
    {
        icon: <Wind size={40} className="mx-auto text-wood-brown" />,
        name: 'Area Merokok',
        description: 'Area outdoor yang nyaman kami sediakan khusus untuk Anda yang ingin merokok.'
    },
    {
        icon: <ParkingCircle size={40} className="mx-auto text-wood-brown" />,
        name: 'Parkir Luas',
        description: 'Tidak perlu khawatir, tersedia area parkir yang luas dan aman untuk mobil dan motor.'
    },
    {
        icon: <Users size={40} className="mx-auto text-wood-brown" />,
        name: 'Ruang Privat',
        description: 'Butuh tempat untuk rapat atau acara kecil? Kami menyediakan ruang privat yang bisa Anda pesan.'
    },
    {
        icon: <Church size={40} className="mx-auto text-wood-brown" />,
        name: 'Mushola',
        description: 'Kami menyediakan mushola yang bersih dan nyaman untuk Anda beribadah.'
    }
];

const FasilitasSection = () => {
    return (
        <section id="fasilitas" className="py-16 px-4 bg-soft-white">
            <div className="container mx-auto">
                <div className="text-center mb-10" data-aos="fade-up">
                    <h2 className="font-serif font-black text-4xl text-wood-brown">
                        Fasilitas Kami
                    </h2>
                    <p className="mt-4 text-charcoal/80 max-w-2xl mx-auto">
                        Kami menyediakan berbagai fasilitas untuk memastikan kenyamanan Anda selama berada di Kanagara.
                    </p>
                </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {facilities.map((facility, index) => (
                        <div 
                            key={index}
                            className="bg-cream p-8 rounded-lg shadow-md border border-wood-brown/10 text-center transform hover:-translate-y-2 transition-transform duration-300"
                            data-aos="fade-up"
                            data-aos-delay={100 * index}
                        >
                            {facility.icon}
                            <h3 className="font-serif font-bold text-xl text-charcoal mt-4">{facility.name}</h3>
                            <p className="text-sm text-charcoal/70 mt-2">{facility.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FasilitasSection;