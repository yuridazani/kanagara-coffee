// src/pages/KelolaReservasiPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Phone, Check, X, Eye } from 'lucide-react';

// ===============================================
// ## KOMPONEN MODAL UNTUK DETAIL RESERVASI
// ===============================================
const DetailModal = ({ reservation, onClose }) => {
    if (!reservation) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-soft-white rounded-lg shadow-2xl w-full max-w-lg relative" 
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal"><X /></button>
                <div className="p-8">
                    <h2 className="font-serif font-black text-3xl text-wood-brown mb-6">Detail Reservasi</h2>
                    <div className="space-y-3 text-charcoal">
                        <p><strong>ID:</strong> {reservation.id}</p>
                        <p><strong>Nama:</strong> {reservation.name}</p>
                        <p><strong>WhatsApp:</strong> {reservation.whatsapp}</p>
                        <p><strong>Tanggal:</strong> {reservation.date} @ {reservation.time}</p>
                        <p><strong>Jumlah Orang:</strong> {reservation.people}</p>
                        <p><strong>Tipe:</strong> <span className="capitalize font-semibold">{reservation.type}</span></p>
                        {reservation.type === 'meja' && <p><strong>Area:</strong> <span className="capitalize font-semibold">{reservation.area}</span></p>}
                        
                        {reservation.type === 'event' && reservation.eventDetails && (
                            <div className="pt-3 mt-3 border-t">
                                <p className="font-bold">Detail Acara:</p>
                                <p className="italic bg-cream p-3 rounded-md mt-1">{reservation.eventDetails}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===============================================
// ## KOMPONEN UTAMA KELOLA RESERVASI
// ===============================================
const KelolaReservasiPage = () => {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        const savedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        setReservations(savedReservations);
    }, []);

    const updateStatus = (id, newStatus) => {
        const updatedReservations = reservations.map(res => 
            res.id === id ? { ...res, status: newStatus } : res
        );
        setReservations(updatedReservations);
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    };

    const filteredReservations = useMemo(() => {
        return reservations.filter(res => {
            const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' ? true : res.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [reservations, searchTerm, filterStatus]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Completed': return 'bg-blue-100 text-blue-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800'; // Pending
        }
    };

    return (
        <>
            <DetailModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />
            
            {/* PERBAIKAN: Bungkus semua konten dengan div ini */}
            <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-6">
                <div>
                    <h2 className="font-serif font-black text-2xl text-wood-brown">Daftar Reservasi</h2>
                    <p className="text-charcoal/70 mt-1">Lihat dan kelola semua permintaan reservasi yang masuk.</p>
                </div>

                <div className="pt-4 border-t">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <input 
                            type="text"
                            placeholder="Cari berdasarkan nama..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:max-w-sm p-2 border rounded-lg"
                        />
                        <select onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:max-w-xs p-2 border rounded-lg bg-white">
                            <option value="All">Semua Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4">Nama</th>
                                    <th className="p-4">Detail</th>
                                    <th className="p-4">Tipe</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservations.length > 0 ? (
                                    filteredReservations.map(res => (
                                        <tr key={res.id} className="border-b hover:bg-cream">
                                            <td className="p-4 font-bold">{res.name}</td>
                                            <td className="p-4 text-sm">{res.date} @ {res.time}<br/>{res.people} orang</td>
                                            <td className="p-4 capitalize">{res.type} ({res.area})</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(res.status)}`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="p-4 flex space-x-2">
                                                <button onClick={() => setSelectedReservation(res)} className="text-gray-500" title="Lihat Detail"><Eye size={18}/></button>
                                                <button onClick={() => updateStatus(res.id, 'Confirmed')} className="text-green-600" title="Konfirmasi"><Check size={18}/></button>
                                                <button onClick={() => updateStatus(res.id, 'Cancelled')} className="text-red-600" title="Batalkan"><X size={18}/></button>
                                                <a href={`https://wa.me/${res.whatsapp.replace(/\D/g, '')}`} target="_blank" className="text-blue-600" title="Hubungi"><Phone size={18}/></a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-charcoal/60">Tidak ada reservasi yang cocok.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KelolaReservasiPage;