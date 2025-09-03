// src/pages/KelolaMenuPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { Edit, Trash2, PlusCircle, X } from 'lucide-react';

// ===============================================
// ## KOMPONEN MODAL UNTUK FORM TAMBAH/EDIT MENU
// ===============================================
const MenuFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    const { categories } = useMenu();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Set form data saat initialData berubah (saat klik edit)
        setFormData(initialData || { name: '', category: categories[0] || '', price: '', description: '', imageUrl: '' });
    }, [initialData, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-soft-white rounded-lg shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal"><X /></button>
                <div className="p-8">
                    <h2 className="font-serif font-black text-3xl text-wood-brown text-center mb-6">
                        {initialData ? 'Edit Item Menu' : 'Tambah Item Menu Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="font-bold">Nama Menu</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="category" className="font-bold">Kategori</label>
                            <select name="category" value={formData.category} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md bg-white">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="price" className="font-bold">Harga (contoh: 25k)</label>
                            <input type="text" name="price" value={formData.price} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="description" className="font-bold">Deskripsi (Opsional)</label>
                            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"></textarea>
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="font-bold">URL Gambar (Opsional)</label>
                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <button type="submit" className="w-full bg-wood-brown hover:bg-light-brown text-white font-bold py-3 px-6 rounded-full">
                            Simpan Perubahan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


// ===============================================
// ## KOMPONEN UTAMA KELOLA MENU
// ===============================================
const KelolaMenuPage = () => {
    const { menuItems, categories, addMenuItem, editMenuItem, deleteMenuItem } = useMenu();
    
    // State untuk kontrol UI
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState('All');
    
    // State untuk Modal Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const itemsPerPage = 10;

    // Logika untuk Search, Filter, Sort, dan Pagination
    const filteredAndSortedItems = useMemo(() => {
        let items = [...menuItems];

        // Filter berdasarkan kategori
        if (filterCategory !== 'All') {
            items = items.filter(item => item.category === filterCategory);
        }

        // Filter berdasarkan pencarian
        if (searchTerm) {
            items = items.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sorting
        items.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        
        return items;
    }, [menuItems, filterCategory, searchTerm, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const paginatedItems = filteredAndSortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
    
    // Handler untuk membuka modal
    const handleOpenModal = (item = null) => {
        setEditingItem(item); // Jika 'item' ada, kita sedang mengedit. Jika null, kita menambah.
        setIsModalOpen(true);
    };

    // Handler untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    // Handler untuk submit form
    const handleFormSubmit = (formData) => {
        if (editingItem) {
            editMenuItem({ ...formData, id: editingItem.id });
        } else {
            addMenuItem(formData);
        }
        handleCloseModal();
    };


    return (
        <>
            <MenuFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingItem}
                onSubmit={handleFormSubmit}
            />

            {/* PERBAIKAN: Bungkus semua konten dengan div ini */}
            <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-serif font-black text-2xl text-wood-brown">Daftar Menu</h2>
                        <p className="text-charcoal/70 mt-1">Tambah, edit, atau hapus item menu di sini.</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="bg-leaf-green text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusCircle size={20} className="mr-2"/> Tambah Menu
                    </button>
                </div>

                <div className="pt-4 border-t">
                    {/* Area Kontrol: Search & Filter Kategori */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <input 
                            type="text" 
                            placeholder="Cari menu..." 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:max-w-sm p-2 border rounded-lg"
                        />
                        <select
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full md:max-w-xs p-2 border rounded-lg bg-white"
                        >
                            <option value="All">Semua Kategori</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Tabel Menu dibungkus dalam card */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 cursor-pointer" onClick={() => requestSort('name')}>Nama Menu</th>
                                    <th className="p-4 cursor-pointer" onClick={() => requestSort('category')}>Kategori</th>
                                    <th className="p-4 cursor-pointer" onClick={() => requestSort('price')}>Harga</th>
                                    <th className="p-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.map(item => (
                                    <tr key={item.id} className="border-b hover:bg-cream">
                                        <td className="p-4 font-bold">{item.name}</td>
                                        <td className="p-4">{item.category}</td>
                                        <td className="p-4">{item.price}</td>
                                        <td className="p-4 flex space-x-2">
                                            <button onClick={() => handleOpenModal(item)} className="text-blue-600"><Edit size={18}/></button>
                                            <button onClick={() => deleteMenuItem(item.id)} className="text-red-600"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <span className="text-sm text-charcoal/70">Halaman {currentPage} dari {totalPages}</span>
                        <div className="flex space-x-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-lg bg-soft-white disabled:opacity-50">Prev</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-lg bg-soft-white disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KelolaMenuPage;