// src/pages/KelolaFeedbackPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Star, Trash2 } from 'lucide-react';

const KelolaFeedbackPage = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [filterRating, setFilterRating] = useState(0); // 0 untuk "Semua Rating"

    useEffect(() => {
        const savedFeedback = JSON.parse(localStorage.getItem('feedback')) || [];
        setFeedbackList(savedFeedback);
    }, []);

    const deleteFeedback = (id) => {
        const updatedFeedback = feedbackList.filter(fb => fb.id !== id);
        setFeedbackList(updatedFeedback);
        localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    };

    const filteredFeedback = useMemo(() => {
        if (filterRating === 0) {
            return feedbackList;
        }
        return feedbackList.filter(fb => fb.rating === filterRating);
    }, [feedbackList, filterRating]);

    // Komponen untuk menampilkan bintang
    const StarRating = ({ rating }) => (
        <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={16} className={rating >= star ? 'text-yellow-500' : 'text-gray-300'} fill="currentColor" />
            ))}
        </div>
    );

    return (
        // PERBAIKAN: Bungkus semua konten dengan div ini
        <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-6">
            <div>
                <h2 className="font-serif font-black text-2xl text-wood-brown">Ulasan & Feedback</h2>
                <p className="text-charcoal/70 mt-1">Lihat apa kata pengunjung tentang Kanagara Coffee.</p>
            </div>

            <div className="pt-4 border-t">
                <div className="mb-4">
                    <label className="mr-4 font-bold">Filter berdasarkan Rating:</label>
                    <select onChange={(e) => setFilterRating(Number(e.target.value))} className="p-2 border rounded-lg bg-white">
                        <option value={0}>Semua Rating</option>
                        <option value={5}>★★★★★ (5)</option>
                        <option value={4}>★★★★☆ (4)</option>
                        <option value={3}>★★★☆☆ (3)</option>
                        <option value={2}>★★☆☆☆ (2)</option>
                        <option value={1}>★☆☆☆☆ (1)</option>
                    </select>
                </div>

                <div className="space-y-6">
                    {filteredFeedback.length > 0 ? (
                        filteredFeedback.map(fb => (
                            <div key={fb.id} className="border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg text-charcoal">{fb.name}</p>
                                        <p className="text-xs text-charcoal/60">{fb.date}</p>
                                        <StarRating rating={fb.rating} />
                                    </div>
                                    <button onClick={() => deleteFeedback(fb.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                                <p className="mt-3 text-charcoal/90 italic">"{fb.comment}"</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center p-8 text-charcoal/60">Belum ada feedback yang masuk.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KelolaFeedbackPage;