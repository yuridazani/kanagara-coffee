// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ===== Impor Komponen Landing Page =====
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import BestSellerSection from './components/BestSellerSection';
import BookingSection from './components/BookingSection';
import BookingModal from './components/BookingModal';
import FeedbackSection from './components/FeedbackSection';
import Footer from './components/Footer';

import Ornament from './components/Ornament';

// ===== Impor Halaman =====
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import KelolaMenuPage from './pages/KelolaMenuPage';
import KelolaReservasiPage from './pages/KelolaReservasiPage';
import KelolaFeedbackPage from './pages/KelolaFeedbackPage';
import SettingsPage from './pages/SettingsPage'; // <-- Impor baru

// ===== Impor Layout Dashboard =====
import DashboardLayout from './DashboardLayout';

// ===== Impor Context =====
import { MenuProvider } from './context/MenuContext';

// Komponen HomePage (Landing Page)
const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <Header />
            <main>
                <HeroSection />
                
                {/* About Section dengan warna baru */}
                <div className="relative bg-wood-dark text-cream-bg">
                    <Ornament />
                    <AboutSection />
                </div>

                <BestSellerSection />
                <BookingSection />

                {/* Feedback Section dengan warna baru */}
                <div className="relative bg-wood-dark text-cream-bg">
                    <Ornament />
                    <FeedbackSection />
                </div>

            </main>
            <Footer />
        </div>
    );
};

function App() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true, offset: 50 });
    }, []);

    return (
        <MenuProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rute untuk Pengunjung */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/menu" element={<MenuPage />} />

                    {/* Rute untuk Login */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Rute untuk Dashboard */}
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/dashboard/menu" element={<KelolaMenuPage />} />
                        <Route path="/dashboard/reservasi" element={<KelolaReservasiPage />} />
                        <Route path="/dashboard/feedback" element={<KelolaFeedbackPage />} />
                        <Route path="/dashboard/settings" element={<SettingsPage />} /> {/* <-- Rute baru */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </MenuProvider>
    );
}

export default App;