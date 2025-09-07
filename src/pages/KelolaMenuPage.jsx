// src/pages/KelolaMenuPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { Edit, Trash2, PlusCircle, X, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

// ===============================================
// ## KOMPONEN MODAL UNTUK FORM TAMBAH/EDIT MENU
// ===============================================
const MenuFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    const { categories } = useMenu();
    const [formData, setFormData] = useState({ name: '', category: '', price: '', description: '', imageUrl: '', tag: 'None' });

    // Daftar tag yang bisa dipilih
    const availableTags = ['None', 'Best Seller', 'Popular', 'Recommended', 'Must Try'];

    useEffect(() => {
        setFormData(initialData || { name: '', category: categories[0] || '', price: '', description: '', imageUrl: '', tag: 'None' });
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
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="font-bold">Kategori</label>
                                <select name="category" value={formData.category || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md bg-white">
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="price" className="font-bold">Harga (cth: 25k)</label>
                                <input type="text" name="price" value={formData.price || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
                            </div>
                        </div>
                        <div>
                             <label htmlFor="tag" className="font-bold flex items-center gap-2">Label Khusus <Tag size={16}/></label>
                            <select name="tag" value={formData.tag || 'None'} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md bg-white">
                                {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="font-bold">Deskripsi (Opsional)</label>
                            <textarea name="description" rows="3" value={formData.description || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"></textarea>
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="font-bold">URL Gambar (Opsional)</label>
                            <input type="text" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
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
// ## KOMPONEN UTAMA KELOLA MENU (YANG DIPERBARUI)
// ===============================================
const KelolaMenuPage = () => {
    // Asumsi useMenu sekarang juga menyediakan addCategory dan deleteCategory
    const { menuItems, categories, addMenuItem, editMenuItem, deleteMenuItem, addCategory, deleteCategory } = useMenu();
    
    // State untuk form kategori baru
    const [newCategoryName, setNewCategoryName] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState('All');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const itemsPerPage = 10;

    const filteredAndSortedItems = useMemo(() => {
        let items = [...menuItems];

        if (filterCategory !== 'All') {
            items = items.filter(item => item.category === filterCategory);
        }

        if (searchTerm) {
            items = items.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

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
    
    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleFormSubmit = (formData) => {
        if (editingItem) {
            editMenuItem({ ...formData, id: editingItem.id });
            toast.success("Menu berhasil diperbarui!");
        } else {
            addMenuItem(formData);
            toast.success("Menu baru berhasil ditambahkan!");
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div>
                <p className="font-bold mb-2">Yakin ingin menghapus menu ini?</p>
                <div className="flex gap-2">
                    <button
                        className="w-full bg-red-600 text-white text-sm py-1 px-3 rounded"
                        onClick={() => {
                            deleteMenuItem(id);
                            toast.dismiss(t.id);
                            toast.success("Menu berhasil dihapus.");
                        }}
                    >
                        Hapus
                    </button>
                    <button
                        className="w-full bg-gray-200 text-sm py-1 px-3 rounded"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Batal
                    </button>
                </div>
            </div>
        ));
    };
    
    // [BARU] Handler untuk menambah kategori
    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            toast.error("Nama kategori tidak boleh kosong.");
            return;
        }
        if (categories.some(cat => cat.toLowerCase() === newCategoryName.trim().toLowerCase())) {
            toast.error("Kategori dengan nama tersebut sudah ada.");
            return;
        }
        addCategory(newCategoryName.trim());
        toast.success(`Kategori "${newCategoryName.trim()}" berhasil ditambahkan.`);
        setNewCategoryName('');
    };

    // [BARU] Handler untuk menghapus kategori
    const handleDeleteCategory = (categoryName) => {
        // Cek apakah kategori masih digunakan oleh item menu
        const isCategoryInUse = menuItems.some(item => item.category === categoryName);
        if (isCategoryInUse) {
            toast.error(`Kategori "${categoryName}" tidak bisa dihapus karena masih digunakan.`, { duration: 4000 });
            return;
        }

        toast((t) => (
            <div>
                <p className="font-bold mb-2">Hapus kategori "{categoryName}"?</p>
                <div className="flex gap-2">
                    <button
                        className="w-full bg-red-600 text-white text-sm py-1 px-3 rounded"
                        onClick={() => {
                            deleteCategory(categoryName);
                            toast.dismiss(t.id);
                            toast.success(`Kategori "${categoryName}" berhasil dihapus.`);
                        }}
                    >
                        Ya, Hapus
                    </button>
                    <button
                        className="w-full bg-gray-200 text-sm py-1 px-3 rounded"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Batal
                    </button>
                </div>
            </div>
        ));
    };

    const getTagClass = (tag) => {
        switch (tag) {
            case 'Best Seller': return 'bg-yellow-100 text-yellow-800';
            case 'Popular': return 'bg-blue-100 text-blue-800';
            case 'Recommended': return 'bg-green-100 text-green-800';
            case 'Must Try': return 'bg-purple-100 text-purple-800';
            default: return 'hidden';
        }
    };

    return (
        <>
            <MenuFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingItem}
                onSubmit={handleFormSubmit}
            />

            <div className="bg-soft-white p-8 rounded-xl shadow-lg space-y-8">
                {/* [BARU] Bagian Kelola Kategori */}
                <fieldset className="border p-4 rounded-lg">
                    <legend className="font-serif font-bold text-xl px-2 text-wood-brown">Kelola Kategori</legend>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Daftar Kategori */}
                        <div className="flex-grow">
                            <h3 className="font-semibold mb-2">Daftar Kategori Saat Ini:</h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.length > 0 ? categories.map(cat => (
                                    <div key={cat} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
                                        <span>{cat}</span>
                                        <button 
                                            onClick={() => handleDeleteCategory(cat)} 
                                            className="ml-2 text-gray-500 hover:text-red-600"
                                            title={`Hapus kategori ${cat}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )) : <p className="text-sm text-gray-500 italic">Belum ada kategori.</p>}
                            </div>
                        </div>
                        {/* Form Tambah Kategori */}
                        <div className="flex-shrink-0 md:w-1/3">
                             <form onSubmit={handleAddCategory} className="flex gap-2 items-center">
                                <input 
                                    type="text" 
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nama kategori baru..." 
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                                <button type="submit" className="bg-leaf-green hover:bg-green-700 text-white font-bold p-2 rounded-lg">
                                    <PlusCircle size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </fieldset>

                {/* Bagian Daftar Menu */}
                <div>
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-serif font-black text-2xl text-wood-brown">Daftar Menu</h2>
                            <p className="text-charcoal/70 mt-1">Tambah, edit, atau hapus item menu di sini.</p>
                        </div>
                        <button onClick={() => handleOpenModal()} className="bg-leaf-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                            <PlusCircle size={20} className="mr-2"/> Tambah Menu
                        </button>
                    </div>

                    <div className="pt-4 mt-4 border-t">
                         {/* Filter dan Search Bar */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <input 
                                type="text" 
                                placeholder="Cari menu..." 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:max-w-sm p-2 border rounded-lg"
                            />
                            <select
                                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                                className="w-full md:max-w-xs p-2 border rounded-lg bg-white"
                            >
                                <option value="All">Semua Kategori</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        
                        {/* Tabel Menu */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
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
                                            <td className="p-4">
                                                <p className="font-bold">{item.name}</p>
                                                {item.tag && item.tag !== 'None' && (
                                                    <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getTagClass(item.tag)}`}>
                                                        {item.tag}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">{item.category}</td>
                                            <td className="p-4">{item.price}</td>
                                            <td className="p-4 flex space-x-2">
                                                <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
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
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg bg-soft-white disabled:opacity-50">Prev</button>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg bg-soft-white disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KelolaMenuPage;