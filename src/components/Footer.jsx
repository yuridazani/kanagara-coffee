// src/components/Footer.jsx
import React from 'react';
import { Instagram } from 'lucide-react';

const Footer = () => (
    <footer className="py-12 bg-charcoal text-cream/70">
        <div className="container mx-auto text-center">
            <h3 className="font-serif font-bold text-2xl text-soft-white">Kanagara Coffee & Space</h3>
            <p className="mt-4">Jl. Raya Pd. Jati No.1, Pagerwojo, Buduran, Sidoarjo</p>
            <div className="flex justify-center space-x-6 mt-6">
                <a href="https://www.instagram.com/kanagara.coffee/" className="hover:text-white"><Instagram /></a>
            </div>
            <p className="mt-8 text-sm">&copy; {new Date().getFullYear()} Kanagara Coffee. All Rights Reserved.</p>
        </div>
    </footer>
);

export default Footer;