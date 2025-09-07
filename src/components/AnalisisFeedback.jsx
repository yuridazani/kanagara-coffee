// src/components/AnalisisFeedback.jsx
import React, { useMemo } from 'react';
import { Star, MessageSquare, ThumbsUp, Coffee } from 'lucide-react';

const AnalisisFeedback = ({ feedbackList }) => {
    const stats = useMemo(() => {
        if (feedbackList.length === 0) return { total: 0, avgRating: 0, bestMenu: 'N/A', topRatedMenu: 'N/A' };

        const total = feedbackList.length;
        const avgRating = (feedbackList.reduce((acc, fb) => acc + fb.cafeRating, 0) / total).toFixed(1);

        const menuRatings = new Map();
        const menuCounts = new Map();

        feedbackList.forEach(fb => {
            fb.menuRatings?.forEach(mr => {
                menuCounts.set(mr.menuName, (menuCounts.get(mr.menuName) || 0) + 1);
                menuRatings.set(mr.menuName, (menuRatings.get(mr.menuName) || 0) + mr.rating);
            });
        });
        
        let bestMenu = 'N/A';
        if (menuCounts.size > 0) {
            bestMenu = [...menuCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
        }

        let topRatedMenu = 'N/A';
        if (menuRatings.size > 0) {
            const avgMenuRatings = [...menuRatings.keys()].map(name => ({
                name,
                avg: menuRatings.get(name) / menuCounts.get(name)
            }));
            topRatedMenu = avgMenuRatings.sort((a, b) => b.avg - a.avg)[0].name;
        }

        return { total, avgRating, bestMenu, topRatedMenu };
    }, [feedbackList]);

    return (
        <div className="mb-8 p-4 border rounded-lg bg-cream">
            <h3 className="font-serif font-bold text-xl text-wood-brown mb-4">Analisis Feedback</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-soft-white p-4 rounded-lg text-center">
                    <MessageSquare className="mx-auto text-blue-500"/>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-charcoal/70">Total Ulasan</p>
                </div>
                <div className="bg-soft-white p-4 rounded-lg text-center">
                    <Star className="mx-auto text-yellow-500"/>
                    <p className="text-2xl font-bold">{stats.avgRating}</p>
                    <p className="text-xs text-charcoal/70">Rata-rata Rating Kafe</p>
                </div>
                <div className="bg-soft-white p-4 rounded-lg text-center">
                    <ThumbsUp className="mx-auto text-green-500"/>
                    <p className="text-lg font-bold truncate">{stats.bestMenu}</p>
                    <p className="text-xs text-charcoal/70">Paling Sering Dinilai</p>
                </div>
                 <div className="bg-soft-white p-4 rounded-lg text-center">
                    <Coffee className="mx-auto text-purple-500"/>
                    <p className="text-lg font-bold truncate">{stats.topRatedMenu}</p>
                    <p className="text-xs text-charcoal/70">Rating Menu Tertinggi</p>
                </div>
            </div>
        </div>
    );
};

export default AnalisisFeedback;