// src/pages/HomePage.jsx

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import BestSellerSection from '../components/BestSellerSection'; // <-- Gunakan BestSellerSection
import BookingSection from '../components/BookingSection';
import FeedbackSection from '../components/FeedbackSection';
import Footer from '../components/Footer';

const HomePage = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true, offset: 50 });
    }, []);

    return(
        <div>
            <Header />
            <main>
                <HeroSection />
                <AboutSection />
                <BestSellerSection /> {/* <-- Ganti MenuSection dengan ini */}
                <BookingSection />
                <FeedbackSection />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;