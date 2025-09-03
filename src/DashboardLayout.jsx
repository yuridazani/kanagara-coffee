// src/DashboardLayout.jsx

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Coffee, Calendar, MessageSquare, LogOut, ChevronLeft, Bell, Search, UserCircle, Settings } from 'lucide-react';

// ==================== TopBar (dengan Search, Notifikasi, Profil) ====================
const TopBar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
    };

    return (
        <header className="bg-soft-white p-4 flex justify-between items-center flex-shrink-0 border-b shadow-md">
            {/* Search Bar (Simulasi) */}
            <div className="relative hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                    type="text"
                    placeholder="Cari reservasi atau menu..."
                    className="pl-10 p-2 rounded-lg border bg-cream focus:outline-none focus:ring-2 focus:ring-wood-brown"
                />
            </div>

            <div className="flex-grow"></div> {/* Spacer */}

            {/* Ikon Notifikasi & Profil */}
            <div className="flex items-center space-x-4">
                <button className="relative p-2 rounded-full hover:bg-cream">
                    <Bell size={20} className="text-charcoal/70" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* PERBAIKAN: Profil sekarang adalah Link */}
                <Link to="/dashboard/settings" className="flex items-center space-x-2 p-2 rounded-full hover:bg-cream">
                    <UserCircle size={28} className="text-charcoal/70"/>
                    <span className="hidden md:inline font-bold">Owner</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center text-sm text-charcoal/70 hover:text-red-500"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

// ==================== Sidebar ====================
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    return (
        <aside
            className={`bg-charcoal text-cream flex-shrink-0 flex flex-col p-4 transition-all duration-300 ease-in-out relative ${
                isCollapsed ? 'w-20 items-center' : 'w-64'
            }`}
        >
            {/* Tombol Collapse */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-8 bg-wood-brown text-white p-1.5 rounded-full border-2 border-charcoal"
            >
                <ChevronLeft
                    size={16}
                    className={`transition-transform duration-300 ${
                        isCollapsed ? 'rotate-180' : ''
                    }`}
                />
            </button>

            <h2
                className={`font-serif font-bold text-center mb-10 text-soft-white transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-0 h-0 invisible' : 'opacity-100 text-2xl'
                }`}
            >
                Kanagara
            </h2>

            <nav className="flex flex-col space-y-2">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-colors ${
                            isActive
                                ? 'bg-wood-brown text-white'
                                : 'hover:bg-wood-brown/50'
                        } ${isCollapsed ? 'justify-center' : ''}`
                    }
                >
                    <LayoutDashboard className="flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">Dashboard</span>}
                </NavLink>

                <NavLink
                    to="/dashboard/menu"
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-colors ${
                            isActive
                                ? 'bg-wood-brown text-white'
                                : 'hover:bg-wood-brown/50'
                        } ${isCollapsed ? 'justify-center' : ''}`
                    }
                >
                    <Coffee className="flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">Kelola Menu</span>}
                </NavLink>

                <NavLink
                    to="/dashboard/reservasi"
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-colors ${
                            isActive
                                ? 'bg-wood-brown text-white'
                                : 'hover:bg-wood-brown/50'
                        } ${isCollapsed ? 'justify-center' : ''}`
                    }
                >
                    <Calendar className="flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">Reservasi</span>}
                </NavLink>

                <NavLink
                    to="/dashboard/feedback"
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-colors ${
                            isActive
                                ? 'bg-wood-brown text-white'
                                : 'hover:bg-wood-brown/50'
                        } ${isCollapsed ? 'justify-center' : ''}`
                    }
                >
                    <MessageSquare className="flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">Feedback</span>}
                </NavLink>

                {/* Opsi Settings di Sidebar (opsional) */}
                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-colors ${
                            isActive
                                ? 'bg-wood-brown text-white'
                                : 'hover:bg-wood-brown/50'
                        } ${isCollapsed ? 'justify-center' : ''}`
                    }
                >
                    <Settings className="flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">Pengaturan</span>}
                </NavLink>
            </nav>
        </aside>
    );
};

// ==================== PrivateRoute ====================
const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? children : null;
};

// ==================== DashboardLayout ====================
const DashboardLayout = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

    return (
        <PrivateRoute>
            <div className="flex h-screen bg-cream">
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <TopBar />
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <Outlet />
                    </main>
                    <footer className="text-center p-4 text-xs text-charcoal/50">
                        © {new Date().getFullYear()} Kanagara Coffee Dashboard.
                    </footer>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default DashboardLayout;