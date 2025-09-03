// src/components/BestSellerSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';

const BestSellerSection = () => {
    const { menuItems } = useMenu();

    // Pilih best seller dari menuItems yang tersedia
    const bestSellers = menuItems.filter(item =>
        ["Brulee Caramel Latte", "Spaghetti Aglio Olio", "Beef Gyudon With Bulgogi Mushroom Sauce"].includes(item.name)
    );

    return (
        <section id="best-sellers" className="py-20 px-4 bg-soft-white">
            <div className="container mx-auto">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="font-serif font-black text-4xl md:text-6xl text-wood-brown">
                        Best Sellers
                    </h2>
                    <p className="mt-4 text-charcoal/80 max-w-lg mx-auto">
                        Cicipi menu favorit yang paling sering dipesan oleh para pengunjung setia kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {bestSellers.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="bg-cream rounded-lg shadow-lg border border-wood-brown/10"
                            data-aos="fade-up"
                            data-aos-delay={100 * index}
                        >
                            <img
                                src={
                                    item.imageUrl ||
                                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop'
                                }
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
