// src/components/AboutSection.jsx
import React, { useState, useEffect } from 'react';

const AboutSection = () => {
    const [aboutText, setAboutText] = useState("Berdiri sejak 2023, Kanagara Coffee & Space adalah perpaduan unik antara tradisi Joglo yang hangat dan desain modern yang minimalis. Kami percaya setiap cangkir kopi memiliki cerita, dan kami menyediakan ruang yang sempurna bagi Anda untuk menciptakan cerita Anda sendiri.");
    const [gmapsUrl, setGmapsUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.6670468910127!2d112.70371219999999!3d-7.441767399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e17aa2075e03%3A0x48ae47a3d117463!2sKanagara%20Coffee!5e0!3m2!1sen!2sid!4v1693648574973!5m2!1sen!2sid");

    useEffect(() => {
        // Ambil data dari localStorage, jika tidak ada, gunakan default
        const savedData = JSON.parse(localStorage.getItem('siteData')) || {};
        setAboutText(savedData.aboutText || "Berdiri sejak 2023, Kanagara Coffee & Space adalah perpaduan unik antara tradisi Joglo yang hangat dan desain modern yang minimalis. Kami percaya setiap cangkir kopi memiliki cerita, dan kami menyediakan ruang yang sempurna bagi Anda untuk menciptakan cerita Anda sendiri.");
        setGmapsUrl(savedData.gmapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.6670468910127!2d112.70371219999999!3d-7.441767399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e17aa2075e03%3A0x48ae47a3d117463!2sKanagara%20Coffee!5e0!3m2!1sen!2sid!4v1693648574973!5m2!1sen!2sid");
    }, []);

    return (
        <section id="about" className="py-16 px-4 bg-soft-white">
            <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div data-aos="fade-right">
                    <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2537&auto=format&fit=crop" alt="Kanagara Coffee Interior" className="rounded-lg shadow-2xl" />
                </div>
                <div data-aos="fade-left">
                    <h2 className="font-serif font-black text-4xl text-wood-brown">Tentang Kanagara</h2>
                    <p className="mt-4 text-charcoal/80 leading-relaxed">
                        {aboutText} {/* <-- Gunakan data dinamis */}
                    </p>

                    {/* === BLOK JAM OPERASIONAL BARU === */}
                    <div className="mt-8 text-center bg-cream p-6 rounded-lg border border-wood-brown/20">
                        <h3 className="font-bold text-charcoal mb-2">Jam Operasional</h3>
                        <p className="font-serif font-bold text-xl text-wood-brown">
                            Senin - Minggu
                        </p>
                        <p className="font-bold text-lg text-charcoal/80">
                            08.00 - 22.00 WIB
                        </p>
                    </div>
                    {/* === AKHIR BLOK BARU === */}

                    <div className="mt-8">
                        <iframe
                            src={gmapsUrl} 
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
};

export default AboutSection;