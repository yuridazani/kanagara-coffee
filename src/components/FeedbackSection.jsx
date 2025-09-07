// src/components/FeedbackSection.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Impor Link
import { useMenu } from '../context/MenuContext';
import { Star, Send, CheckCircle, Camera, Calendar, Clock, PlusCircle, XCircle, UserCircle, MessageSquare, Coffee, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

// ===============================================
// ## KOMPONEN HELPER & TAMPILAN
// ===============================================

// Helper untuk format waktu relatif (cth: "2 hari yang lalu")
const timeAgo = (timestamp) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(timestamp)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun yang lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan yang lalu";
    interval = seconds / 604800;
    if (interval > 1) return Math.floor(interval) + " minggu yang lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari yang lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam yang lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit yang lalu";
    return "Baru saja";
};

// Komponen untuk menampilkan bintang (read-only)
const StarRatingDisplay = ({ rating, size = 16 }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <Star key={i} size={size} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} fill={i < rating ? 'currentColor' : 'none'} />
        ))}
    </div>
);

// Komponen untuk menampilkan satu kartu ulasan
const FeedbackCard = ({ feedback }) => {
    return (
        <div className="bg-cream p-5 rounded-lg border border-wood-brown/10 w-full">
            <div className="flex items-start gap-4">
                <UserCircle size={40} className="text-charcoal/50 flex-shrink-0" />
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-charcoal">{feedback.name}</p>
                        <p className="text-xs text-charcoal/60">{timeAgo(feedback.id)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRatingDisplay rating={feedback.cafeRating} />
                        <span className="text-xs text-charcoal/70">· Kunjungan pada {feedback.visitDate}</span>
                    </div>

                    <p className="italic text-charcoal/90 mt-3">"{feedback.cafeComment}"</p>
                    
                    {feedback.photoUrl && (
                        <img src={feedback.photoUrl} alt="Feedback" className="mt-3 rounded-lg max-h-60 w-auto border shadow-sm" />
                    )}

                    {feedback.menuRatings && feedback.menuRatings.length > 0 && (
                        <div className="mt-4 border-t border-wood-brown/10 pt-3">
                            <h4 className="font-semibold text-sm text-charcoal flex items-center gap-2"><Coffee size={16}/> Menu yang dinilai:</h4>
                            <div className="mt-2 space-y-1">
                                {feedback.menuRatings.map((mr, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-charcoal/80">{mr.menuName}</span>
                                        <StarRatingDisplay rating={mr.rating} size={14} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Komponen StarRating untuk digunakan kembali (form input)
const StarRatingInput = ({ rating, setRating, hoverRating, setHoverRating, size = 36 }) => (
    <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map(star => (
            <Star
                key={star}
                size={size}
                className={`cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
            />
        ))}
    </div>
);

// ===============================================
// ## KOMPONEN UTAMA
// ===============================================
const FeedbackSection = () => {
    const { menuItems } = useMenu();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [allFeedback, setAllFeedback] = useState([]);
    
    // State untuk data form umum
    const [formData, setFormData] = useState({ name: '', visitDate: '', visitTime: '' });
    const [photo, setPhoto] = useState(null);

    // State terpisah untuk rating
    const [cafeRating, setCafeRating] = useState(0);
    const [hoverCafeRating, setHoverCafeRating] = useState(0);
    const [cafeComment, setCafeComment] = useState('');
    
    // State untuk rating menu (array of objects)
    const [menuRatings, setMenuRatings] = useState([]);

    useEffect(() => {
        const existingFeedback = JSON.parse(localStorage.getItem('feedback')) || [];
        setAllFeedback(existingFeedback);
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleAddMenuRating = () => {
        setMenuRatings([...menuRatings, { menuName: '', rating: 0, hover: 0 }]);
    };

    const handleRemoveMenuRating = (index) => {
        const newRatings = menuRatings.filter((_, i) => i !== index);
        setMenuRatings(newRatings);
    };

    const handleMenuRatingChange = (index, field, value) => {
        const newRatings = [...menuRatings];
        newRatings[index][field] = value;
        setMenuRatings(newRatings);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cafeRating === 0) {
            toast.error("Mohon berikan rating untuk kafe terlebih dahulu.");
            return;
        }

        const newFeedback = {
            id: Date.now(),
            name: formData.name || 'Anonim',
            visitDate: formData.visitDate,
            visitTime: formData.visitTime,
            photoUrl: photo ? URL.createObjectURL(photo) : null,
            date: new Date().toLocaleDateString('id-ID'),
            cafeRating: cafeRating,
            cafeComment: cafeComment,
            menuRatings: menuRatings.filter(r => r.menuName && r.rating > 0),
        };

        const updatedFeedback = [newFeedback, ...allFeedback];
        localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
        setAllFeedback(updatedFeedback);
        setIsSubmitted(true);
        toast.success("Ulasan Anda berhasil dikirim, terima kasih!");
    };

    const averageRating = useMemo(() => {
        if (allFeedback.length === 0) return 0;
        const validFeedbacks = allFeedback.filter(f => f.cafeRating > 0);
        if(validFeedbacks.length === 0) return 0;
        const totalRating = validFeedbacks.reduce((acc, curr) => acc + curr.cafeRating, 0);
        return (totalRating / validFeedbacks.length).toFixed(1);
    }, [allFeedback]);

    // Hanya ambil 3 ulasan terbaru untuk ditampilkan di homepage
    const recentFeedback = useMemo(() => 
        [...allFeedback].sort((a, b) => b.id - a.id).slice(0, 3), 
    [allFeedback]);

    return (
        <section id="feedback" className="py-16 px-4 bg-soft-white">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-10" data-aos="fade-up">
                    <h2 className="font-serif font-black text-4xl text-wood-brown">Apa Kata Mereka</h2>
                    <p className="mt-4 text-charcoal/80">Kami bangga bisa memberikan pengalaman terbaik untuk setiap pengunjung.</p>
                    {averageRating > 0 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                             <Star size={28} className="text-yellow-500" fill="currentColor" />
                             <span className="text-3xl font-bold text-wood-brown">{averageRating}</span>
                             <span className="text-charcoal/70">/ 5.0 dari {allFeedback.filter(f => f.cafeRating).length} ulasan</span>
                        </div>
                    )}
                </div>

                {/* MENAMPILKAN 3 ULASAN TERBARU */}
                <div className="space-y-6" data-aos="fade-up">
                    {recentFeedback.length > 0 ? (
                        recentFeedback.map(fb => <FeedbackCard key={fb.id} feedback={fb} />)
                    ) : (
                        <p className="text-center text-charcoal/60 bg-cream p-8 rounded-lg">Jadilah yang pertama memberikan ulasan!</p>
                    )}
                </div>
                
                {/* TOMBOL KE HALAMAN ULASAN */}
                {allFeedback.length > 3 && (
                    <div className="text-center mt-10" data-aos="fade-up">
                        <Link to="/ulasan" className="bg-wood-brown text-white font-bold py-3 px-8 rounded-full hover:bg-light-brown transition-colors">
                            Lihat Semua Ulasan
                        </Link>
                    </div>
                )}

                {/* BAGIAN FORMULIR ULASAN */}
                <div className="text-center mt-12 pt-12 border-t border-wood-brown/20" data-aos="fade-up">
                    <h3 className="font-serif font-black text-3xl text-wood-brown">Bagikan Pengalaman Anda</h3>
                    <p className="mt-2 text-charcoal/80">Satu ulasan dari Anda sangat berarti bagi kami.</p>
                    {isSubmitted ? (
                        <div className="text-center py-10 mt-8 bg-cream rounded-lg shadow-lg">
                            <CheckCircle size={50} className="text-leaf-green mx-auto mb-4" />
                            <h3 className="font-serif font-bold text-2xl text-wood-brown">Ulasan Terkirim!</h3>
                            <p className="mt-2 text-charcoal/80">Terima kasih telah meluangkan waktu untuk memberikan ulasan!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto bg-cream p-8 rounded-lg shadow-lg text-left space-y-8">
                            {/* BAGIAN DATA PENGUNJUNG */}
                            <fieldset className="space-y-4">
                               <div className="grid md:grid-cols-2 gap-4">
                                     <div>
                                        <label htmlFor="name" className="font-bold">Nama <span className="text-sm font-normal text-charcoal/60">(Opsional)</span></label>
                                        <input type="text" id="name" value={formData.name} onChange={handleInputChange} placeholder="Nama Anda..." className="mt-2 w-full p-3 border border-wood-brown/20 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="photo" className="font-bold flex items-center gap-2">Upload Foto <span className="text-sm font-normal text-charcoal/60">(Opsional)</span></label>
                                        <input type="file" id="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="mt-2 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-leaf-green/10 file:text-leaf-green hover:file:bg-leaf-green/20"/>
                                        {photo && <p className="text-xs mt-1 text-charcoal/70">File dipilih: {photo.name}</p>}
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="visitDate" className="font-bold flex items-center gap-2"><Calendar size={16}/> Tanggal Kunjungan</label>
                                        <input type="date" id="visitDate" value={formData.visitDate} onChange={handleInputChange} required className="mt-2 w-full p-3 border border-wood-brown/20 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="visitTime" className="font-bold flex items-center gap-2"><Clock size={16}/> Waktu Kunjungan</label>
                                        <input type="time" id="visitTime" value={formData.visitTime} onChange={handleInputChange} required className="mt-2 w-full p-3 border border-wood-brown/20 rounded-md" />
                                    </div>
                                </div>
                            </fieldset>

                            {/* BAGIAN RATING CAFE */}
                            <fieldset className="border-t pt-6 space-y-4">
                                 <legend className="font-serif font-bold text-xl text-wood-brown">1. Rating Kafe Secara Keseluruhan</legend>
                                 <div>
                                    <label className="font-bold">Rating Anda untuk Kafe</label>
                                    <div className="mt-2">
                                        <StarRatingInput rating={cafeRating} setRating={setCafeRating} hoverRating={hoverCafeRating} setHoverRating={setHoverCafeRating} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="cafeComment" className="font-bold">Komentar tentang Kafe</label>
                                    <textarea id="cafeComment" rows="4" value={cafeComment} onChange={(e) => setCafeComment(e.target.value)} required placeholder="Bagaimana suasana, pelayanan, dan kebersihan kafe?" className="mt-2 w-full p-3 border border-wood-brown/20 rounded-md"></textarea>
                                </div>
                            </fieldset>

                            {/* BAGIAN RATING MENU */}
                            <fieldset className="border-t pt-6 space-y-4">
                                <legend className="font-serif font-bold text-xl text-wood-brown">2. Rating Menu (Opsional)</legend>
                                <div className="space-y-6">
                                    {menuRatings.map((item, index) => (
                                        <div key={index} className="bg-soft-white p-4 rounded-lg border border-wood-brown/10 flex flex-col md:flex-row gap-4 items-center">
                                            <select 
                                                value={item.menuName} 
                                                onChange={(e) => handleMenuRatingChange(index, 'menuName', e.target.value)}
                                                className="w-full md:w-1/2 p-2 border border-wood-brown/20 rounded-md bg-white"
                                            >
                                                <option value="">-- Pilih Menu --</option>
                                                {menuItems.map(menu => <option key={menu.id} value={menu.name}>{menu.name}</option>)}
                                            </select>
                                            <StarRatingInput 
                                                rating={item.rating} 
                                                setRating={(val) => handleMenuRatingChange(index, 'rating', val)} 
                                                hoverRating={item.hover}
                                                setHoverRating={(val) => handleMenuRatingChange(index, 'hover', val)}
                                                size={24}
                                            />
                                            <button type="button" onClick={() => handleRemoveMenuRating(index)} className="text-red-500 hover:text-red-700 ml-auto">
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={handleAddMenuRating} className="mt-4 flex items-center gap-2 text-leaf-green font-bold text-sm">
                                    <PlusCircle size={18} /> Tambah Menu untuk Dinilai
                                </button>
                            </fieldset>
                            
                            <button type="submit" className="w-full bg-wood-brown hover:bg-light-brown text-white font-bold py-3 rounded-full flex items-center justify-center space-x-2 transition-colors">
                                <Send size={20} /><span>Kirim Ulasan</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeedbackSection;