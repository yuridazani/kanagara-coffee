// src/components/AboutSection.jsx
import React from 'react';
import { useWebsiteContent } from '../context/WebsiteContext';

const AboutSection = () => {
    const { settings, loading } = useWebsiteContent();

    console.log('About section settings:', settings); // Debug log

    // Gunakan data dari settings jika tersedia, fallback ke default
    const aboutText = settings?.about_text || 
        "Berdiri sejak 2023, Kanagara Coffee & Space adalah perpaduan unik antara tradisi Joglo yang hangat dan desain modern yang minimalis. Kami percaya setiap cangkir kopi memiliki cerita, dan kami menyediakan ruang yang sempurna bagi Anda untuk menciptakan cerita Anda sendiri.";

    const gmapsUrl = settings?.gmaps_url || 
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.6670468910127!2d112.70371219999999!3d-7.441767399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e17aa2075e03%3A0x48ae47a3d117463!2sKanagara%20Coffee!5e0!3m2!1sen!2sid!4v1693648574973!5m2!1sen!2sid";

    // Gunakan gambar about dari settings jika tersedia
    const aboutImage = settings?.about_image_path
        ? `http://localhost:8000/storage/${settings.about_image_path}?t=${Date.now()}` // Tambah timestamp untuk avoid cache
        : "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2537&auto=format&fit=crop";

    return (
        <section id="about" className="py-16 px-4 bg-soft-white">
            <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div data-aos="fade-right">
                    <img 
                        key={aboutImage} // Force re-render ketika image berubah
                        src={aboutImage}
                        alt="Kanagara Coffee Interior" 
                        className="rounded-lg shadow-2xl w-full h-auto"
                        onLoad={() => console.log('About image loaded:', aboutImage)}
                        onError={(e) => {
                            console.error('About image failed to load:', aboutImage);
                            // Fallback ke default image jika gagal load
                            e.target.src = "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2537&auto=format&fit=crop";
                        }}
                    />
                </div>
                <div data-aos="fade-left">
                    <h2 className="font-serif font-black text-4xl text-wood-brown">Tentang Kanagara</h2>
                    <p key={aboutText} className="mt-4 text-charcoal/80 leading-relaxed">
                        {aboutText}
                    </p>

                    {/* Jam Operasional */}
                    <div className="mt-8 text-center bg-cream p-6 rounded-lg border border-wood-brown/20">
                        <h3 className="font-bold text-charcoal mb-2">Jam Operasional</h3>
                        <p className="font-serif font-bold text-xl text-wood-brown">
                            Senin - Minggu
                        </p>
                        <p className="font-bold text-lg text-charcoal/80">
                            08.00 - 22.00 WIB
                        </p>
                    </div>

                    {/* Google Maps */}
                    <div className="mt-8">
                        {gmapsUrl ? (
                            <iframe
                                key={gmapsUrl} // Force re-render ketika URL berubah
                                src={gmapsUrl} 
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-lg"
                                title="Lokasi Kanagara Coffee"
                                onLoad={() => console.log('Google Maps loaded:', gmapsUrl)}
                                onError={() => console.error('Google Maps failed to load:', gmapsUrl)}
                            />
                        ) : (
                            <div className="w-full h-[250px] bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">Google Maps belum diatur</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;