// src/pages/KelolaFeedbackPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Star, Trash2, Coffee, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AnalisisFeedback from '../components/AnalisisFeedback';

const KelolaFeedbackPage = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [filterRating, setFilterRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const savedFeedback = JSON.parse(localStorage.getItem('feedback')) || [];
        setFeedbackList(savedFeedback);
    }, []);

    const deleteFeedback = (id) => {
        toast((t) => (
            <div>
                <p className="font-bold mb-2">Yakin ingin menghapus feedback ini?</p>
                <div className="flex gap-2">
                    <button
                        className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md"
                        onClick={() => {
                            const updatedFeedback = feedbackList.filter(fb => fb.id !== id);
                            setFeedbackList(updatedFeedback);
                            localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
                            toast.dismiss(t.id);
                            toast.success("Feedback dihapus.");
                        }}
                    >
                        Hapus
                    </button>
                    <button
                        className="w-full bg-gray-200 hover:bg-gray-300 text-sm py-1 px-3 rounded-md"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Batal
                    </button>
                </div>
            </div>
        ));
    };

    const filteredFeedback = useMemo(() => {
        if (filterRating === 0) return feedbackList;
        return feedbackList.filter(fb => fb.cafeRating === filterRating);
    }, [feedbackList, filterRating]);

    // Pagination
    const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
    const paginatedFeedback = filteredFeedback.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const StarRating = ({ rating, size = 16 }) => (
        <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={size}
                    className={rating >= star ? 'text-yellow-500' : 'text-gray-300'}
                    fill="currentColor"
                />
            ))}
        </div>
    );

    return (
        <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-6">
            <div>
                <h2 className="font-serif font-black text-2xl text-wood-brown">Ulasan & Feedback Pengunjung</h2>
                <p className="text-charcoal/70 mt-1">Lihat, analisis, dan kelola ulasan yang masuk dari pengunjung.</p>
            </div>

            <div className="pt-4 border-t">
                {/* Komponen Analisis */}
                <AnalisisFeedback feedbackList={feedbackList} />

                {/* Filter */}
                <div className="mb-4">
                    <label className="mr-4 font-bold">Filter Rating Kafe:</label>
                    <select
                        onChange={(e) => {
                            setFilterRating(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="p-2 border rounded-lg bg-white"
                    >
                        <option value={0}>Semua Rating</option>
                        <option value={5}>★★★★★ (5)</option>
                        <option value={4}>★★★★☆ (4)</option>
                        <option value={3}>★★★☆☆ (3)</option>
                        <option value={2}>★★☆☆☆ (2)</option>
                        <option value={1}>★☆☆☆☆ (1)</option>
                    </select>
                </div>

                {/* Daftar Feedback */}
                <div className="space-y-6">
                    {paginatedFeedback.length > 0 ? (
                        paginatedFeedback.map(fb => (
                            <div key={fb.id} className="bg-cream border p-5 rounded-lg">
                                <div className="flex justify-between items-start border-b pb-3 mb-3">
                                    <div>
                                        <p className="font-bold text-lg text-charcoal">{fb.name}</p>
                                        <p className="text-xs text-charcoal/60">
                                            Kunjungan: {fb.visitDate} @ {fb.visitTime}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deleteFeedback(fb.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Ulasan Kafe */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-3">
                                        <MessageCircle size={20} className="text-wood-brown" />
                                        <h4 className="font-bold text-md text-wood-brown">Ulasan Kafe</h4>
                                    </div>
                                    <div className="pl-8 mt-2">
                                        <StarRating rating={fb.cafeRating} />
                                        <p className="mt-2 text-charcoal/90 italic">"{fb.cafeComment}"</p>
                                    </div>
                                </div>

                                {/* Ulasan Menu */}
                                {fb.menuRatings && fb.menuRatings.length > 0 && (
                                    <div className="border-t pt-4">
                                        <div className="flex items-center gap-3">
                                            <Coffee size={20} className="text-leaf-green" />
                                            <h4 className="font-bold text-md text-leaf-green">Ulasan Menu</h4>
                                        </div>
                                        <div className="pl-8 mt-2 space-y-2">
                                            {fb.menuRatings.map((mr, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between text-sm"
                                                >
                                                    <span className="text-charcoal">{mr.menuName}</span>
                                                    <StarRating rating={mr.rating} size={14} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center p-8 text-charcoal/60 bg-cream rounded-lg">
                            Belum ada feedback yang sesuai dengan filter.
                        </p>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="font-bold">Halaman {currentPage} dari {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KelolaFeedbackPage;
