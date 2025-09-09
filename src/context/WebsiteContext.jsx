import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';

const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
    const [content, setContent] = useState({
        settings: {},
        gallery: [],
        facilities: [],
        hero_images: [],
    });
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            setLoading(true);
            // Tambahkan timestamp untuk menghindari cache
            const timestamp = new Date().getTime();
            const response = await axiosClient.get(`/content/all?_=${timestamp}`);
            console.log('Website content loaded:', response.data);
            setContent(response.data);
        } catch (error) {
            console.error("Gagal memuat konten website:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto refresh setiap 30 detik untuk perubahan real-time
    useEffect(() => {
        fetchContent();
        
        const interval = setInterval(() => {
            fetchContent();
        }, 30000); // Refresh setiap 30 detik

        return () => clearInterval(interval);
    }, []);

    // Force refresh dengan loading state
    const forceRefresh = async () => {
        console.log('Force refreshing content...');
        await fetchContent();
    };

    return (
        <WebsiteContext.Provider value={{ 
            ...content, 
            loading, 
            refreshContent: fetchContent,
            forceRefresh 
        }}>
            {children}
        </WebsiteContext.Provider>
    );
};

export const useWebsiteContent = () => useContext(WebsiteContext);