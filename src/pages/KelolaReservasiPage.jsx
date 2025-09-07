// src/pages/KelolaReservasiPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Phone, Check, X, Eye, Calendar, CheckCircle, Clipboard, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import toast from 'react-hot-toast';

// ===============================================
// ## MODAL RESCHEDULE
// ===============================================
const RescheduleModal = ({ reservation, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        date: reservation?.date || '',
        time: reservation?.time || '',
        people: reservation?.people || 1
    });
    const [reason, setReason] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = () => {
        onSave(reservation.id, formData, reason);
        onClose();
    };

    if (!reservation) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-soft-white rounded-lg shadow-2xl w-full max-w-md relative" 
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal">
                    <X />
                </button>
                <div className="p-6">
                    <h2 className="font-serif font-black text-2xl text-wood-brown mb-4">Reschedule Reservasi</h2>
                    <div className="mb-4">
                        <p className="text-sm text-charcoal/70 mb-2">Pelanggan: <strong>{reservation.name}</strong></p>
                        <p className="text-sm text-charcoal/70 mb-4">No. Reservasi: <strong>{reservation.reservationNumber}</strong></p>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="date" className="font-bold text-sm">Tanggal Baru</label>
                            <input 
                                type="date" 
                                id="date" 
                                value={formData.date}
                                onChange={handleInputChange}
                                className="mt-1 w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="font-bold text-sm">Jam Baru</label>
                            <input 
                                type="time" 
                                id="time" 
                                value={formData.time}
                                onChange={handleInputChange}
                                className="mt-1 w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="people" className="font-bold text-sm">Jumlah Orang</label>
                            <input 
                                type="number" 
                                id="people" 
                                min="1"
                                value={formData.people}
                                onChange={handleInputChange}
                                className="mt-1 w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="reason" className="font-bold text-sm">Alasan Reschedule (Opsional)</label>
                            <textarea 
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows="3"
                                placeholder="Contoh: Tidak tersedia di tanggal tersebut, permintaan customer, dll."
                                className="mt-1 w-full p-2 border rounded-lg text-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-wood-brown text-white rounded-lg hover:bg-light-brown flex items-center justify-center gap-2"
                        >
                            <Calendar size={16} />
                            Simpan
                        </button>
                    </div>
                    
                    <p className="text-xs text-charcoal/60 mt-4 text-center">
                        *Customer akan mendapat notifikasi perubahan jadwal otomatis di halaman tracking
                    </p>
                </div>
            </div>
        </div>
    );
};

// ===============================================
// ## MODAL DETAIL YANG LEBIH LENGKAP
// ===============================================
const DetailModal = ({ reservation, onClose }) => {
    if (!reservation) return null;

    // Fungsi untuk menyalin detail ke clipboard
    const copyDetailsToClipboard = () => {
        let details = `**Detail Reservasi Kanagara Coffee**\n`;
        details += `No: ${reservation.reservationNumber}\n`;
        details += `Nama: ${reservation.name}\n`;
        details += `WhatsApp: ${reservation.whatsapp}\n`;
        details += `Tanggal: ${reservation.date} @ ${reservation.time}\n`;
        details += `Jumlah: ${reservation.people} orang\n`;
        details += `Status: ${reservation.status}\n`;
        
        if (reservation.rescheduleHistory && reservation.rescheduleHistory.length > 0) {
            details += `\n**Riwayat Reschedule:**\n`;
            reservation.rescheduleHistory.forEach((history, index) => {
                details += `${index + 1}. ${history.oldDate} ${history.oldTime} → ${history.newDate} ${history.newTime}\n`;
                if (history.reason) details += `   Alasan: ${history.reason}\n`;
            });
        }
        
        if (reservation.selectedMenus && reservation.selectedMenus.length > 0) {
            details += `\n**Pesanan Menu:**\n`;
            reservation.selectedMenus.forEach(item => {
                details += `- ${item.quantity}x ${item.name}\n`;
            });
        }
        navigator.clipboard.writeText(details);
        toast.success("Detail reservasi disalin ke clipboard!");
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-soft-white rounded-lg shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal"><X /></button>
                <div className="p-8">
                    <h2 className="font-serif font-black text-3xl text-wood-brown mb-6">Detail Reservasi</h2>
                    <div className="space-y-3 text-charcoal">
                        <p><strong>Nomor Reservasi:</strong> {reservation.reservationNumber}</p>
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

                        {/* Riwayat Reschedule */}
                        {reservation.rescheduleHistory && reservation.rescheduleHistory.length > 0 && (
                            <div className="pt-3 mt-3 border-t">
                                <p className="font-bold">Riwayat Reschedule:</p>
                                <div className="bg-blue-50 p-3 rounded-md mt-2">
                                    {reservation.rescheduleHistory.map((history, index) => (
                                        <div key={index} className="text-sm mb-2 last:mb-0">
                                            <p className="text-blue-800">
                                                <strong>{index + 1}.</strong> {history.oldDate} ${history.oldTime} → ${history.newDate} ${history.newTime}
                                            </p>
                                            {history.reason && (
                                                <p className="text-blue-600 text-xs mt-1">Alasan: ${history.reason}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bukti DP */}
                        <div className="pt-3 mt-3 border-t">
                            <p className="font-bold">Bukti DP:</p>
                            {reservation.dpProofUrl ? (
                                <div className="mt-2">
                                    <img 
                                        src={reservation.dpProofUrl} 
                                        alt="Bukti DP" 
                                        className="rounded-lg max-w-xs border shadow-sm"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="hidden bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                                        <p className="text-sm">Gambar tidak dapat dimuat</p>
                                    </div>
                                </div>
                            ) : reservation.status === 'Bukti DP Diupload' || reservation.status === 'DP Dibayar' ? (
                                <div className="mt-2 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
                                    <div className="text-blue-600 mb-2">📄</div>
                                    <p className="text-sm text-blue-700 font-medium">Bukti DP telah diupload</p>
                                    <p className="text-xs text-blue-600 mt-1">*Akan ditampilkan setelah backend tersedia</p>
                                </div>
                            ) : (
                                <div className="mt-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-gray-400 mb-2">📄</div>
                                    <p className="text-sm text-gray-500">Belum ada bukti DP</p>
                                    <p className="text-xs text-gray-400 mt-1">Pelanggan belum mengupload bukti pembayaran</p>
                                </div>
                            )}
                        </div>

                        {/* Menu yang dipilih */}
                        {reservation.selectedMenus && reservation.selectedMenus.length > 0 ? (
                             <div className="pt-3 mt-3 border-t">
                                <p className="font-bold">Menu yang Dipilih:</p>
                                <ul className="list-disc list-inside bg-green-50 p-3 rounded-md mt-2">
                                    {reservation.selectedMenus.map((item, index) => (
                                        <li key={index} className="text-green-800">{item.quantity}x {item.name}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="pt-3 mt-3 border-t">
                                <p className="font-bold">Menu yang Dipilih:</p>
                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center mt-2">
                                    <div className="text-gray-400 mb-2">🍽</div>
                                    <p className="text-sm text-gray-500">Belum memilih menu</p>
                                    <p className="text-xs text-gray-400 mt-1">Pelanggan akan memilih menu setelah DP dikonfirmasi</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={copyDetailsToClipboard} className="mt-6 bg-gray-200 text-charcoal px-4 py-2 rounded-lg flex items-center text-sm hover:bg-gray-300">
                        <Clipboard size={16} className="mr-2"/> Salin Detail untuk Tim
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===============================================
// ## KOMPONEN UTAMA KELOLA RESERVASI (YANG DIPERBARUI)
// ===============================================
const KelolaReservasiPage = () => {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [rescheduleModal, setRescheduleModal] = useState({ show: false, reservation: null });
    const itemsPerPage = 10;

    useEffect(() => {
        const savedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        setReservations(savedReservations);
    }, []);

    const persistAndUpdate = (updatedReservations) => {
        setReservations(updatedReservations);
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    };
    
    const updateStatus = (id, newStatus) => {
        const updatedReservations = reservations.map(res => 
            res.id === id ? { ...res, status: newStatus } : res
        );
        persistAndUpdate(updatedReservations);
        toast.success(`Status reservasi diubah menjadi "${newStatus}"!`);
    };

    const confirmAndUpdateStatus = (id, newStatus, message) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <p className="font-semibold">{message}</p>
                <div className="flex gap-2">
                    <button 
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm"
                        onClick={() => {
                            updateStatus(id, newStatus);
                            toast.dismiss(t.id);
                        }}
                    >
                        Ya, Lanjutkan
                    </button>
                    <button 
                        className="w-full bg-gray-200 hover:bg-gray-300 text-charcoal py-2 px-4 rounded-md text-sm"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Batal
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    // FUNGSI UNTUK MENGIRIM PESAN WHATSAPP
    const sendWhatsApp = (reservation, message) => {
        const waNumber = reservation.whatsapp.replace(/\D/g, '');
        const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
        window.open(waLink, '_blank');
        toast.success("Membuka WhatsApp untuk mengirim pesan.");
    };

    const sendAvailabilityMessage = (reservation) => {
        const message = `Halo ${reservation.name}, mohon maaf untuk reservasi tanggal ${reservation.date} jam ${reservation.time} tidak tersedia. Apakah Anda bersedia untuk reschedule ke tanggal/jam lain? Silakan hubungi kami kembali. Terima kasih 🙏`;
        sendWhatsApp(reservation, message);
    };

    // [BARU] FUNGSI FOLLOW UP - NOTIFIKASI KONFIRMASI + DP
    const sendConfirmationMessage = (reservation) => {
        const eventOrArea = reservation.type === 'event' 
            ? `Acara: ${reservation.eventDetails}` 
            : `Area: ${reservation.area}`;

        const message = `Halo ${reservation.name} 😊\nReservasi Anda telah dikonfirmasi:\n\n- Tanggal: ${reservation.date}\n- Jam: ${reservation.time}\n- Jumlah orang: ${reservation.people}\n- ${eventOrArea}\n- Nomor Reservasi: ${reservation.reservationNumber}\n\nSilakan lakukan DP sebesar Rp 100.000 ke rekening berikut:\n- BCA: 0183881822 a.n. Angga Januar Dobonsolo\n- Mandiri: 1410018607895 a.n. Angga Januar Dobonsolo\n\nSetelah transfer, mohon **upload bukti DP di website**. Terima kasih!`;
        sendWhatsApp(reservation, message);
    };

    // [BARU] FUNGSI FOLLOW UP - NOTIFIKASI PILIH MENU
    const sendMenuSelectionMessage = (reservation) => {
        // Ganti dengan link website Anda yang sebenarnya
        const websiteLink = window.location.origin + '/tracking'; 
        
        const message = `Halo ${reservation.name} 😊\nTerima kasih telah melakukan DP untuk reservasi Anda (Nomor Reservasi: ${reservation.reservationNumber}).\n\nSekarang Anda dapat **memilih menu** melalui website:\n${websiteLink}\n\nMasukkan nomor reservasi + nama Anda untuk mulai memilih menu. Silakan lakukan maksimal H-1 sebelum acara/reservasi. Terima kasih!`;
        sendWhatsApp(reservation, message);
    };
    
    const handleReschedule = (id, newData, reason) => {
        const updatedReservations = reservations.map(res => {
            if (res.id === id) {
                const rescheduleHistory = res.rescheduleHistory || [];
                const newHistory = {
                    oldDate: res.date,
                    oldTime: res.time,
                    newDate: newData.date,
                    newTime: newData.time,
                    reason: reason || 'Tidak ada alasan khusus',
                    timestamp: new Date().toISOString()
                };
                
                return {
                    ...res,
                    ...newData,
                    rescheduleHistory: [...rescheduleHistory, newHistory]
                };
            }
            return res;
        });
        
        persistAndUpdate(updatedReservations);
    };

    const openRescheduleModal = (reservation) => {
        setRescheduleModal({ show: true, reservation });
    };

    const closeRescheduleModal = () => {
        setRescheduleModal({ show: false, reservation: null });
    };

    // Logika untuk filter, search dan sorting
    const sortedAndFilteredItems = useMemo(() => {
        let items = [...reservations];
        if (filterStatus !== 'All') { 
            items = items.filter(res => res.status === filterStatus); 
        }
        if (searchTerm) { 
            items = items.filter(res => {
                // =================================================================
                // ## PERBAIKAN DI SINI ##
                // Menambahkan pengecekan untuk memastikan 'name' dan 'reservationNumber' ada 
                // sebelum memanggil toLowerCase() untuk mencegah error.
                const nameMatch = res.name && res.name.toLowerCase().includes(searchTerm.toLowerCase());
                const numberMatch = res.reservationNumber && res.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase());
                return nameMatch || numberMatch;
                // =================================================================
            }); 
        }
        
        items.sort((a, b) => {
            if (sortConfig.key === 'id') {
                return sortConfig.direction === 'ascending' ? a.id - b.id : b.id - a.id;
            }
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return items;
    }, [reservations, searchTerm, filterStatus, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const paginatedItems = sortedAndFilteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedAndFilteredItems.length / itemsPerPage);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Dikonfirmasi': return 'bg-green-100 text-green-800';
            case 'DP Dibayar': return 'bg-blue-100 text-blue-800';
            case 'Menu Dipilih': return 'bg-indigo-100 text-indigo-800';
            case 'Ditolak': return 'bg-red-100 text-red-800';
            case 'Selesai': return 'bg-gray-100 text-gray-800';
            case 'Bukti DP Diupload': return 'bg-purple-100 text-purple-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <>
            <DetailModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />
            {rescheduleModal.show && (
                <RescheduleModal 
                    reservation={rescheduleModal.reservation}
                    onClose={closeRescheduleModal}
                    onSave={handleReschedule}
                />
            )}
            
            <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-6">
                <div>
                    <h1 className="font-serif font-black text-3xl text-wood-brown">Kelola Reservasi</h1>
                    <p className="text-charcoal/70 mt-1">Lihat, konfirmasi, reschedule, atau tolak permintaan reservasi yang masuk.</p>
                </div>

                <div className="pt-4 border-t">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input 
                            type="text" placeholder="Cari berdasarkan nama atau nomor reservasi..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:max-w-sm p-2 border rounded-lg"
                        />
                        <select onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:max-w-xs p-2 border rounded-lg bg-white">
                            <option value="All">Semua Status</option>
                            <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                            <option value="Dikonfirmasi">Dikonfirmasi</option>
                            <option value="Bukti DP Diupload">Bukti DP Diupload</option>
                            <option value="DP Dibayar">DP Dibayar</option>
                            <option value="Menu Dipilih">Menu Dipilih</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Ditolak">Ditolak</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => requestSort('reservationNumber')}>No. Reservasi</th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => requestSort('name')}>Nama</th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => requestSort('date')}>Tanggal</th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => requestSort('status')}>Status</th>
                                    <th className="p-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.map(res => (
                                    <tr key={res.id} className="border-b hover:bg-cream">
                                        <td className="p-4 font-mono text-sm">{res.reservationNumber}</td>
                                        <td className="p-4 font-bold">{res.name}</td>
                                        <td className="p-4 text-sm">
                                            {res.date} @ {res.time}
                                            {res.rescheduleHistory && res.rescheduleHistory.length > 0 && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                    Reschedule {res.rescheduleHistory.length}x
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(res.status)}`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center flex-wrap gap-2">
                                                <button onClick={() => setSelectedReservation(res)} className="text-gray-500 hover:text-gray-700" title="Lihat Detail">
                                                    <Eye size={18}/>
                                                </button>
                                                
                                                {/* --- Aksi untuk 'Menunggu Konfirmasi' --- */}
                                                {res.status === 'Menunggu Konfirmasi' && (
                                                    <>
                                                        <button onClick={() => updateStatus(res.id, 'Dikonfirmasi')} className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">Konfirmasi</button>
                                                        <button onClick={() => sendAvailabilityMessage(res)} className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-1"><MessageSquare size={14}/> Kirim Info</button>
                                                    </>
                                                )}
                                                
                                                {/* [BARU] --- Aksi untuk 'Dikonfirmasi' --- */}
                                                {res.status === 'Dikonfirmasi' && (
                                                    <button onClick={() => sendConfirmationMessage(res)} className="px-3 py-1.5 text-sm bg-sky-500 text-white rounded-md hover:bg-sky-600 flex items-center gap-1">
                                                        <Send size={14}/> WA Konfirmasi
                                                    </button>
                                                )}

                                                {/* --- Aksi untuk 'Bukti DP Diupload' --- */}
                                                {res.status === 'Bukti DP Diupload' && (
                                                    <button onClick={() => updateStatus(res.id, 'DP Dibayar')} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Verifikasi DP</button>
                                                )}

                                                {/* [BARU] --- Aksi untuk 'DP Dibayar' --- */}
                                                {res.status === 'DP Dibayar' && (
                                                    <button onClick={() => sendMenuSelectionMessage(res)} className="px-3 py-1.5 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 flex items-center gap-1">
                                                        <Send size={14}/> WA Pilih Menu
                                                    </button>
                                                )}

                                                {/* --- Aksi Umum (Selesai & Tolak) --- */}
                                                {(res.status === 'DP Dibayar' || res.status === 'Menu Dipilih' || res.status === 'Dikonfirmasi') && (
                                                    <button onClick={() => confirmAndUpdateStatus(res.id, 'Selesai', 'Tandai reservasi ini sebagai Selesai?')} className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center gap-1"><ThumbsUp size={14}/> Selesai</button>
                                                )}
                                                {res.status !== 'Ditolak' && res.status !== 'Selesai' && (
                                                    <button onClick={() => confirmAndUpdateStatus(res.id, 'Ditolak', 'Yakin ingin menolak reservasi ini?')} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Tolak</button>
                                                )}

                                                {/* FITUR RESCHEDULE - untuk semua status kecuali 'Ditolak' dan 'Selesai' */}
                                                {res.status !== 'Ditolak' && res.status !== 'Selesai' && (
                                                    <button onClick={() => openRescheduleModal(res)} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1">
                                                        <Calendar size={14}/> Reschedule
                                                    </button>
                                                )}

                                                <a href={`https://wa.me/${res.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1">
                                                    <Phone size={14}/> WhatsApp
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <span className="text-sm text-charcoal/70">
                            Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedAndFilteredItems.length)} dari {sortedAndFilteredItems.length} reservasi
                        </span>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1} 
                                className="px-4 py-2 rounded-lg bg-soft-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                disabled={currentPage === totalPages} 
                                className="px-4 py-2 rounded-lg bg-soft-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KelolaReservasiPage;