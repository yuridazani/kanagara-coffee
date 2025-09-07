// src/components/BestSellerSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';

const BestSellerSection = () => {
    const { menuItems } = useMenu();

    // Logika diubah: Filter menu yang memiliki tag "Best Seller"
    const bestSellers = menuItems.filter(item => item.tag === "Best Seller");

    return (
        <section id="best-sellers" className="py-16 px-4 bg-soft-white">
            <div className="container mx-auto">
                <div className="text-center mb-10" data-aos="fade-up">
                    <h2 className="font-serif font-black text-4xl md:text-5xl text-wood-brown">
                        Our Best Sellers
                    </h2>
                    <p className="mt-4 text-charcoal/80 max-w-lg mx-auto">
                        Cicipi menu favorit yang paling sering dipesan oleh para pengunjung setia kami.
                    </p>
                </div>

                {bestSellers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bestSellers.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-cream rounded-lg shadow-lg border border-wood-brown/10 transform hover:-translate-y-2 transition-transform duration-300"
                                data-aos="fade-up"
                                data-aos-delay={100 * index}
                            >
                                <img
                                    src={item.imageUrl || 'https://via.placeholder.com/400x300.png?text=Kanagara'}
                                    alt={item.name}
                                    className="w-full h-56 object-cover rounded-t-lg"
                                />
                                <div className="p-6">
                                    <h3 className="font-serif font-bold text-2xl text-charcoal">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-charcoal/60 mt-1">
                                        {item.category}
                                    </p>
                                    <p className="font-bold text-lg text-wood-brown text-right mt-4">
                                        {item.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg" data-aos="fade-up">
                        <p className="text-charcoal/70">Menu best seller belum diatur. Atur label "Best Seller" di halaman Kelola Menu.</p>
                    </div>
                )}


                <div className="text-center mt-16" data-aos="fade-up">
                    <Link
                        to="/menu"
                        className="bg-wood-brown text-soft-white font-bold py-3 px-8 rounded-full hover:bg-light-brown transition-colors"
                    >
                        Lihat Menu Lengkap
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestSellerSection;