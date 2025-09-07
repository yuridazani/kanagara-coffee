// src/pages/UlasanPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FeedbackCard } from '../components/FeedbackCard'; // Impor komponen kartu
import { Star } from 'lucide-react';

const UlasanPage = () => {
    const [allFeedback, setAllFeedback] = useState([]);
    const [sortOption, setSortOption] = useState('newest');
    const [filterRating, setFilterRating] = useState(0); // 0 untuk semua
    const [filterMenu, setFilterMenu] = useState('all');

    useEffect(() => {
        window.scrollTo(0, 0);
        const savedFeedback = JSON.parse(localStorage.getItem('feedback')) || [];
        setAllFeedback(savedFeedback);
    }, []);

    // Membuat daftar menu unik dari semua ulasan untuk dropdown filter
    const uniqueMenus = useMemo(() => {
        const menuSet = new Set();
        allFeedback.forEach(fb => {
            fb.menuRatings?.forEach(mr => menuSet.add(mr.menuName));
        });
        return Array.from(menuSet).sort();
    }, [allFeedback]);

    // Logika untuk filter dan sortir ulasan
    const filteredAndSortedReviews = useMemo(() => {
        let reviews = [...allFeedback];

        // Filter berdasarkan rating bintang
        if (filterRating > 0) {
            reviews = reviews.filter(fb => fb.cafeRating === filterRating);
        }

        // Filter berdasarkan menu yang dinilai
        if (filterMenu !== 'all') {
            reviews = reviews.filter(fb => 
                fb.menuRatings?.some(mr => mr.menuName === filterMenu)
            );
        }

        // Sortir hasil
        switch (sortOption) {
            case 'highest':
                reviews.sort((a, b) => b.cafeRating - a.cafeRating);
                break;
            case 'lowest':
                reviews.sort((a, b) => a.cafeRating - b.cafeRating);
                break;
            case 'newest':
            default:
                reviews.sort((a, b) => b.id - a.id);
                break;
        }
        return reviews;
    }, [allFeedback, sortOption, filterRating, filterMenu]);
    
    const averageRating = useMemo(() => {
        if (allFeedback.length === 0) return 0;
        const validFeedbacks = allFeedback.filter(f => f.cafeRating > 0);
        if(validFeedbacks.length === 0) return 0;
        const totalRating = validFeedbacks.reduce((acc, curr) => acc + curr.cafeRating, 0);
        return (totalRating / validFeedbacks.length).toFixed(1);
    }, [allFeedback]);

    return (
        <div className="bg-soft-white min-h-screen">
            <Header />
            <main className="pt-24">
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <div className="text-center mb-12" data-aos="fade-up">
                            <h1 className="font-serif font-black text-4xl md:text-5xl text-wood-brown">Ulasan Pengunjung</h1>
                             {averageRating > 0 && (
                                <div className="mt-6 flex items-center justify-center gap-2">
                                    <Star size={28} className="text-yellow-500" fill="currentColor" />
                                    <span className="text-3xl font-bold text-wood-brown">{averageRating}</span>
                                    <span className="text-charcoal/70">/ 5.0 dari {allFeedback.filter(f => f.cafeRating).length} ulasan</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Panel Filter */}
                        <div className="bg-cream p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center sticky top-24 z-40" data-aos="fade-up">
                            <div className="w-full">
                                <label htmlFor="sort" className="text-xs font-bold">URUTKAN</label>
                                <select id="sort" value={sortOption} onChange={e => setSortOption(e.target.value)} className="w-full p-2 mt-1 border rounded-md bg-white">
                                    <option value="newest">Terbaru</option>
                                    <option value="highest">Rating Tertinggi</option>
                                    <option value="lowest">Rating Terendah</option>
                                </select>
                            </div>
                             <div className="w-full">
                                <label htmlFor="filterRating" className="text-xs font-bold">FILTER RATING KAFE</label>
                                <select id="filterRating" value={filterRating} onChange={e => setFilterRating(Number(e.target.value))} className="w-full p-2 mt-1 border rounded-md bg-white">
                                    <option value={0}>Semua Rating</option>
                                    <option value={5}>★★★★★</option>
                                    <option value={4}>★★★★☆</option>
                                    <option value={3}>★★★☆☆</option>
                                    <option value={2}>★★☆☆☆</option>
                                    <option value={1}>★☆☆☆☆</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <label htmlFor="filterMenu" className="text-xs font-bold">FILTER MENU</label>
                                <select id="filterMenu" value={filterMenu} onChange={e => setFilterMenu(e.target.value)} className="w-full p-2 mt-1 border rounded-md bg-white">
                                    <option value="all">Semua Menu</option>
                                    {uniqueMenus.map(menu => <option key={menu} value={menu}>{menu}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Daftar Ulasan */}
                        <div className="space-y-6">
                            {filteredAndSortedReviews.length > 0 ? (
                                filteredAndSortedReviews.map(fb => <FeedbackCard key={fb.id} feedback={fb} />)
                            ) : (
                                <p className="text-center text-charcoal/60 bg-cream p-8 rounded-lg">Tidak ada ulasan yang cocok dengan filter Anda.</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default UlasanPage;