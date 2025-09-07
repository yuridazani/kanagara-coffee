// src/pages/KelolaWebsitePage.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, PlusCircle } from 'lucide-react';

// Data fasilitas default untuk checkbox
const allFacilities = [
    'Wi-Fi Cepat', 'Stopkontak', 'Area Merokok', 'Parkir Luas', 'Ruang Privat', 'Mushola'
];

const KelolaWebsitePage = () => {
    const [siteData, setSiteData] = useState({
        // Teks
        heroTagline: "Temukan kenyamanan dan secangkir kopi sempurna di Kanagara.",
        aboutText: "Berdiri sejak 2023, Kanagara Coffee & Space adalah...",
        gmapsUrl: "https://www.google.com/maps/embed?...",
        // Jam Operasional
        jamBuka: "08:00",
        jamTutup: "22:00",
        // Gambar Hero
        heroImages: [],
        // Fasilitas (menyimpan array nama fasilitas yang aktif)
        activeFacilities: [...allFacilities],
        // Galeri
        galleryImages: [],
    });
    
    // State sementara untuk input gambar
    const [newHeroImage, setNewHeroImage] = useState('');
    const [newGalleryImage, setNewGalleryImage] = useState('');

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('siteData'));
        if (savedData) {
            setSiteData(prev => ({ ...prev, ...savedData }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSiteData(prev => ({...prev, [id]: value}));
    };
    
    const handleFacilityChange = (facilityName) => {
        setSiteData(prev => {
            const activeFacilities = prev.activeFacilities.includes(facilityName)
                ? prev.activeFacilities.filter(f => f !== facilityName)
                : [...prev.activeFacilities, facilityName];
            return { ...prev, activeFacilities };
        });
    };
    
    // Fungsi untuk menambah/menghapus gambar (Hero & Galeri)
    const addImage = (type) => {
        const url = type === 'hero' ? newHeroImage : newGalleryImage;
        const key = type === 'hero' ? 'heroImages' : 'galleryImages';
        
        if (url.trim()) {
            setSiteData(prev => ({ ...prev, [key]: [...prev[key], url] }));
            if (type === 'hero') setNewHeroImage('');
            else setNewGalleryImage('');
            toast.success("Gambar berhasil ditambahkan!");
        } else {
            toast.error("URL gambar tidak boleh kosong.");
        }
    };

    const removeImage = (type, index) => {
        const key = type === 'hero' ? 'heroImages' : 'galleryImages';
        setSiteData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
        toast.success("Gambar berhasil dihapus.");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('siteData', JSON.stringify(siteData));
        toast.success("Perubahan berhasil disimpan! Refresh halaman utama untuk melihatnya.");
    };

    return (
        <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-8">
            <div>
                <h1 className="font-serif font-black text-3xl text-wood-brown">Pengaturan Website</h1>
                <p className="text-charcoal/70 mt-1">Kelola semua konten dinamis yang tampil di halaman utama pengunjung.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pt-6 border-t">
                {/* === Pengaturan Teks & Lokasi === */}
                <fieldset className="border p-4 rounded-lg space-y-4">
                    <legend className="font-bold text-lg px-2">Konten Teks & Peta</legend>
                    <div>
                        <label htmlFor="heroTagline" className="font-semibold">Tagline Hero Section</label>
                        <textarea 
                            id="heroTagline" 
                            value={siteData.heroTagline} 
                            onChange={handleInputChange}
                            rows="2" 
                            className="mt-2 w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="aboutText" className="font-semibold">Teks Tentang Kafe (About Section)</label>
                        <textarea 
                            id="aboutText" 
                            value={siteData.aboutText} 
                            onChange={handleInputChange}
                            rows="5" 
                            className="mt-2 w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="gmapsUrl" className="font-semibold">URL Google Maps</label>
                        <input 
                            type="url" 
                            id="gmapsUrl" 
                            value={siteData.gmapsUrl} 
                            onChange={handleInputChange}
                            className="mt-2 w-full p-2 border rounded-md"
                        />
                    </div>
                </fieldset>

                {/* === Pengaturan Jam Operasional === */}
                <fieldset className="border p-4 rounded-lg space-y-4">
                    <legend className="font-bold text-lg px-2">Jam Operasional</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="jamBuka" className="font-semibold">Jam Buka</label>
                            <input type="time" id="jamBuka" value={siteData.jamBuka} onChange={handleInputChange} className="mt-2 w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="jamTutup" className="font-semibold">Jam Tutup</label>
                            <input type="time" id="jamTutup" value={siteData.jamTutup} onChange={handleInputChange} className="mt-2 w-full p-2 border rounded-md" />
                        </div>
                    </div>
                </fieldset>

                {/* === Pengaturan Gambar Hero Section === */}
                <fieldset className="border p-4 rounded-lg space-y-4">
                    <legend className="font-bold text-lg px-2">Gambar Hero Section</legend>
                    <div className="flex gap-2">
                        <input type="url" value={newHeroImage} onChange={(e) => setNewHeroImage(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded-md"/>
                        <button type="button" onClick={() => addImage('hero')} className="bg-blue-500 text-white p-2 rounded-md"><PlusCircle/></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {siteData.heroImages.map((img, i) => (
                            <div key={i} className="relative group">
                                <img src={img} className="w-full h-24 object-cover rounded-md"/>
                                <button type="button" onClick={() => removeImage('hero', i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><X size={12}/></button>
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* === Pengaturan Fasilitas === */}
                <fieldset className="border p-4 rounded-lg">
                    <legend className="font-bold text-lg px-2">Fasilitas</legend>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allFacilities.map(facility => (
                            <label key={facility} className="flex items-center space-x-2">
                                <input type="checkbox" checked={siteData.activeFacilities.includes(facility)} onChange={() => handleFacilityChange(facility)} />
                                <span>{facility}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* === Pengaturan Galeri === */}
                <fieldset className="border p-4 rounded-lg space-y-4">
                    <legend className="font-bold text-lg px-2">Galeri Foto</legend>
                    <div className="flex gap-2">
                        <input type="url" value={newGalleryImage} onChange={(e) => setNewGalleryImage(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded-md"/>
                        <button type="button" onClick={() => addImage('gallery')} className="bg-blue-500 text-white p-2 rounded-md"><PlusCircle/></button>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {siteData.galleryImages.map((img, i) => (
                            <div key={i} className="relative group">
                                <img src={img} className="w-full h-24 object-cover rounded-md"/>
                                <button type="button" onClick={() => removeImage('gallery', i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><X size={12}/></button>
                            </div>
                        ))}
                    </div>
                </fieldset>

                <button type="submit" className="w-full bg-leaf-green text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-green-700 transition-colors">
                    Simpan Semua Perubahan
                </button>
            </form>
        </div>
    );
};

export default KelolaWebsitePage;