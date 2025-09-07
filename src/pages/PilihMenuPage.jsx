import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { Plus, Minus, CheckCircle, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PilihMenuPage = () => {
    const { reservationNumber } = useParams();
    const { menuItems } = useMenu();
    
    const [selectedMenus, setSelectedMenus] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");

    // Kategori menu dinamis
    const menuCategories = ["All", ...new Set(menuItems.map(item => item.category))];
    const filteredMenu = activeCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    // =======================================================
    // ## PERBAIKAN UTAMA: LOGIKA HANDLE KUANTITAS ##
    // =======================================================
    const handleQuantityChange = (item, amount) => {
        // Ambil kuantitas saat ini dari state, atau 0 jika belum ada
        const currentQuantity = selectedMenus[item.id]?.quantity || 0;
        const newQuantity = Math.max(0, currentQuantity + amount);

        // Buat salinan dari state yang ada
        const newSelection = { ...selectedMenus };

        if (newQuantity === 0) {
            // Jika kuantitas menjadi 0, hapus item dari seleksi
            delete newSelection[item.id];
        } else {
            // Jika tidak, perbarui atau tambahkan item dengan kuantitas baru
            newSelection[item.id] = { ...item, quantity: newQuantity };
        }
        // Set state baru
        setSelectedMenus(newSelection);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const updatedReservations = allReservations.map(res => 
            res.reservationNumber === reservationNumber 
            ? { ...res, status: 'Menu Dipilih', selectedMenus: Object.values(selectedMenus) } 
            : res
        );
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div>
                <Header />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="text-center bg-soft-white p-10 rounded-lg shadow-lg">
                        <CheckCircle size={60} className="text-leaf-green mx-auto mb-4" />
                        <h1 className="font-serif font-bold text-3xl text-wood-brown">Pilihan Menu Terkirim!</h1>
                        <p className="mt-2 text-charcoal/80">Terima kasih, pilihan menu Anda telah kami catat.</p>
                        <Link to="/tracking" className="mt-6 inline-block bg-wood-brown text-white font-bold py-3 px-6 rounded-full">Kembali ke Halaman Lacak</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="pt-24 min-h-screen">
                <section className="py-20 px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="font-serif font-black text-4xl md:text-6xl text-wood-brown">Pilih Menu Anda</h1>
                            <p className="mt-4 text-charcoal/80">Untuk Reservasi No: <span className="font-mono font-bold">{reservationNumber}</span></p>
                        </div>

                        {/* Filter Kategori */}
                        <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                            {menuCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${activeCategory === category ? 'bg-wood-brown text-soft-white' : 'bg-cream text-wood-brown border'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredMenu.map(item => (
                                    <div key={item.id} className="bg-soft-white rounded-lg shadow-lg p-4 flex flex-col">
                                        <h3 className="font-serif font-bold text-xl text-charcoal">{item.name}</h3>
                                        <p className="text-sm text-charcoal/60">{item.price}</p>
                                        <div className="mt-auto pt-4 flex items-center justify-end">
                                            <button type="button" onClick={() => handleQuantityChange(item, -1)} className="p-2 border rounded-full hover:bg-cream"><Minus size={16} /></button>
                                            <span className="px-4 font-bold text-lg w-12 text-center">{selectedMenus[item.id]?.quantity || 0}</span>
                                            <button type="button" onClick={() => handleQuantityChange(item, 1)} className="p-2 border rounded-full hover:bg-cream"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-16">
                                <button type="submit" className="bg-leaf-green text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-opacity-90 transition-colors">
                                    Kirim Pilihan Menu
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default PilihMenuPage;