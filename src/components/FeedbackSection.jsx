// src/components/FeedbackSection.jsx

import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';

// Data testimoni sampel
const testimonials = [
    { name: 'Patricia S.', quote: 'Tempatnya super cozy dengan sentuhan Joglo yang hangat. Brulee Caramel Latte-nya juara! Pasti balik lagi.' },
    { name: 'Rizky A.', quote: 'Sangat betah kerja di sini. Suasananya tenang, kopinya enak, dan pelayanannya ramah. Recommended!' },
];

const FeedbackSection = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', comment: '' });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newFeedback = {
            id: Date.now(),
            name: formData.name,
            comment: formData.comment,
            rating,
            date: new Date().toLocaleDateString('id-ID'),
        };

        const existingFeedback = JSON.parse(localStorage.getItem('feedback')) || [];
        localStorage.setItem('feedback', JSON.stringify([newFeedback, ...existingFeedback]));

        setIsSubmitted(true);
    };

    return (
        <section id="feedback" className="py-20 px-4 bg-soft-white">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="font-serif font-black text-4xl text-wood-brown">Apa Kata Mereka</h2>
                    <p className="mt-4 text-charcoal/80">Kami bangga bisa memberikan pengalaman terbaik untuk setiap pengunjung.</p>
                </div>

                {/* Tampilan Testimoni */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {testimonials.map((t, index) => (
                        <div key={index} className="bg-cream p-6 rounded-lg shadow-md border border-wood-brown/10" data-aos="fade-up" data-aos-delay={index * 100}>
                            <p className="italic text-charcoal/90">"{t.quote}"</p>
                            <p className="font-bold text-wood-brown mt-4">- {t.name}</p>
                        </div>
                    ))}
                </div>

                {/* Form Feedback */}
                <div className="text-center mt-16 pt-12 border-t border-wood-brown/20" data-aos="fade-up">
                    <h3 className="font-serif font-black text-3xl text-wood-brown">Bagikan Pengalaman Anda</h3>
                    <p className="mt-2 text-charcoal/80">Satu ulasan dari Anda sangat berarti bagi kami.</p>
                    
                    {/* PERBAIKAN: Gunakan style notifikasi yang sama dengan booking */}
                    {isSubmitted ? (
                        <div className="text-center py-10 mt-8">
                            <CheckCircle size={50} className="text-leaf-green mx-auto mb-4" />
                            <h3 className="font-serif font-bold text-2xl text-wood-brown">Ulasan Terkirim!</h3>
                            <p className="mt-2 text-charcoal/80">Terima kasih atas ulasan Anda!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 max-w-xl mx-auto bg-cream p-8 rounded-lg shadow-lg text-left space-y-6">
                            <div>
                                <label className="font-bold">Rating Anda</label>
                                <div className="flex space-x-2 mt-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            size={32}
                                            className={`cursor-pointer transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="name" className="font-bold">Nama</label>
                                <input type="text" id="name" value={formData.name} onChange={handleInputChange} required className="mt-2 w-full p-3 border border-wood-brown/20 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="comment" className="font-bold">Komentar</label>
                                <textarea id="comment" rows="4" value={formData.comment} onChange={handleInputChange} required className="mt-2 w-full p-3 border border-wood-brown/20 rounded-md"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-wood-brown hover:bg-light-brown text-white font-bold py-3 rounded-full flex items-center justify-center space-x-2">
                                <Send size={20} />
                                <span>Kirim Ulasan</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeedbackSection;