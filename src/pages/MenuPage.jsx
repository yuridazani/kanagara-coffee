// src/pages/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MenuPage = () => {
    const { menuItems } = useMenu(); 
    const [activeCategory, setActiveCategory] = useState("All");

    // Kategori didapatkan secara dinamis
    const menuCategories = ["All", ...new Set(menuItems.map(item => item.category))];

    const filteredMenu = activeCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <Header />
            <main className="pt-24">
                <section id="menu" className="py-20 px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-12" data-aos="fade-up">
                            <h1 className="font-serif font-black text-4xl md:text-6xl text-wood-brown">
                                Our Full Menu
                            </h1>
                            <p className="mt-4 text-charcoal/80 max-w-lg mx-auto">
                                Jelajahi semua pilihan kopi, hidangan, dan camilan terbaik yang kami siapkan.
                            </p>
                        </div>

                        {/* Filter kategori */}
                        <div
                            className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            {menuCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 text-sm md:text-base font-bold rounded-full transition-colors duration-300 ${
                                        activeCategory === category
                                            ? 'bg-wood-brown text-soft-white'
                                            : 'bg-cream text-wood-brown hover:bg-light-brown/50 border border-wood-brown/30'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Daftar menu */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredMenu.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="bg-soft-white rounded-lg shadow-lg border border-wood-brown/10 flex flex-col"
                                    data-aos="fade-up"
                                    data-aos-delay={50 * (index % 9)}
                                >
                                    <img
                                        src={
                                            item.imageUrl ||
                                            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop'
                                        }
                                        alt={item.name}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-serif font-bold text-2xl text-charcoal">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-charcoal/60 mt-1">
                                            {item.category}
                                        </p>
                                        {item.description && (
                                            <p className="text-sm text-charcoal/80 mt-4 flex-grow">
                                                {item.description}
                                            </p>
                                        )}
                                        <div className="mt-4 pt-4 border-t border-wood-brown/10">
                                            <p className="font-bold text-lg text-wood-brown text-right">
                                                {item.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default MenuPage;
