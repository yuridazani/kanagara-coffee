// src/components/AboutSection.jsx
import React from 'react';

const AboutSection = () => (
    <section id="about" className="py-20 px-4 bg-soft-white">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
                <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2537&auto=format&fit=crop" alt="Kanagara Coffee Interior" className="rounded-lg shadow-2xl" />
            </div>
            <div data-aos="fade-left">
                <h2 className="font-serif font-black text-4xl text-wood-brown">Tentang Kanagara</h2>
                <p className="mt-4 text-charcoal/80 leading-relaxed">
                    Berdiri sejak 2023, Kanagara Coffee & Space adalah perpaduan unik antara tradisi Joglo yang hangat dan desain modern yang minimalis. Kami percaya setiap cangkir kopi memiliki cerita, dan kami menyediakan ruang yang sempurna bagi Anda untuk menciptakan cerita Anda sendiri.
                </p>
                <div className="mt-6">
                <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.6670468910127!2d112.70371219999999!3d-7.441767399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e17aa2075e03%3A0x48ae47a3d117463!2sKanagara%20Coffee!5e0!3m2!1sen!2sid!4v1693648574973!5m2!1sen!2sid"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
                ></iframe>
                </div>
            </div>
        </div>
    </section>
);
export default AboutSection;