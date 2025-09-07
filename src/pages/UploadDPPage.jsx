// src/pages/UploadDPPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Upload, CheckCircle } from 'lucide-react';

const UploadDPPage = () => {
    const { reservationNumber } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const found = allReservations.find(res => res.reservationNumber === reservationNumber);
        if (found) {
            setReservation(found);
        }
    }, [reservationNumber]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulasi: Ubah status di localStorage
        const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const updatedReservations = allReservations.map(res => 
            res.reservationNumber === reservationNumber ? { ...res, status: 'DP Dibayar' } : res
        );
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        setIsSubmitted(true);
    };

    if (!reservation) {
        return <div>Memuat data reservasi...</div>;
    }
    
    return (
        <div>
            <Header />
            <main className="pt-24 min-h-screen">
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-2xl text-center">
                        <h1 className="font-serif font-black text-4xl md:text-6xl text-wood-brown">Upload Bukti DP</h1>
                        <p className="mt-4 text-charcoal/80">Untuk Reservasi: <span className="font-mono font-bold">{reservation.reservationNumber}</span></p>

                        {isSubmitted ? (
                            <div className="mt-8 bg-soft-white p-8 rounded-lg shadow-lg">
                                <CheckCircle size={60} className="text-leaf-green mx-auto mb-4" />
                                <h2 className="font-serif font-bold text-2xl text-wood-brown">Bukti Terkirim!</h2>
                                <p className="mt-2 text-charcoal/80">Terima kasih. Tim kami akan segera memverifikasi bukti pembayaran Anda.</p>
                                <Link to="/tracking" className="mt-6 inline-block bg-wood-brown text-white font-bold py-3 px-6 rounded-full">Kembali ke Halaman Lacak</Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-8 bg-soft-white p-8 rounded-lg shadow-lg space-y-6">
                                <div className="text-left">
                                    <p>Silakan lakukan transfer DP sebesar <span className="font-bold">Rp 100.000</span> ke rekening berikut:</p>
                                    <p className="mt-2 font-bold">BCA: 123456789 a/n Kanagara Coffee</p>
                                </div>
                                <div>
                                    <label htmlFor="proof" className="font-bold text-charcoal">Upload Bukti Transfer</label>
                                    <input type="file" id="proof" required className="mt-2 w-full text-sm p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cream file:text-wood-brown hover:file:bg-wood-brown/20"/>
                                </div>
                                <button type="submit" className="w-full bg-wood-brown hover:bg-light-brown text-white font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-2">
                                    <Upload size={20} />
                                    <span>Kirim Bukti Pembayaran</span>
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default UploadDPPage;