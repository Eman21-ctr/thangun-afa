import { Link, useLocation } from 'react-router-dom'
import { House, Receipt, ChartBar, User, List, Users, Gear, SignOut, X, Sparkle, Desktop } from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { clsx } from 'clsx'

const MainLayout = ({ children }) => {
    const { profile, logout } = useAuth()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = [
        { label: 'Beranda', icon: House, path: '/dashboard' },
        { label: 'Transaksi', icon: Receipt, path: '/transactions' },
        { label: 'Laporan', icon: ChartBar, path: '/reports' },
        { label: 'Profil', icon: User, path: '/profile' },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-cream font-sans selection:bg-primary/10">
            {/* Top Bar */}
            <header className={clsx(
                "top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 transition-all duration-300",
                location.pathname === '/dashboard'
                    ? "absolute bg-transparent border-transparent"
                    : "sticky bg-white/80 backdrop-blur-lg border-b border-primary-100/50"
            )}>
                <div className="flex items-center space-x-3">
                    <img
                        src={location.pathname === '/dashboard' ? "/images/logo-white.png" : "/images/logo-color.png"}
                        alt="Thangun Afa"
                        className="h-10 w-auto"
                        onError={(e) => {
                            // Fallback if logo-white doesn't exist
                            if (location.pathname === '/dashboard') {
                                e.target.src = "/images/logo-color.png"
                            }
                        }}
                    />
                </div>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className={clsx(
                        "p-3 rounded-2xl transition-all active:scale-90",
                        location.pathname === '/dashboard'
                            ? "text-white"
                            : "text-gray-400 bg-gray-50 hover:text-primary"
                    )}
                >
                    <List size={22} weight="bold" />
                </button>
            </header>

            {/* Side Drawer */}
            <div
                className={clsx(
                    "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-500",
                    isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick={() => setIsMenuOpen(false)}
            >
                <aside
                    className={clsx(
                        "fixed inset-y-0 right-0 z-[60] w-72 bg-white shadow-2xl transform transition-transform duration-500 ease-out flex flex-col",
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Drawer Header */}
                    <div className="flex justify-between items-center p-5 border-b border-gray-50">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-primary-50 text-primary rounded-lg">
                                <Sparkle size={18} weight="duotone" />
                            </div>
                            <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">Menu Utama</span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg bg-gray-50">
                            <X size={18} weight="bold" />
                        </button>
                    </div>

                    {/* Drawer Profile - Compacter */}
                    <div className="flex items-center space-x-3 p-5 bg-primary-50/30">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary text-lg font-semibold shadow-sm border border-primary-100 flex-shrink-0">
                            {profile?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-800 tracking-tight text-sm truncate">{profile?.full_name}</h3>
                            <span className="text-[9px] font-medium px-2 py-0.5 bg-primary text-white rounded-full uppercase tracking-wider">
                                {profile?.role?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Drawer Content - Compact */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {profile?.role === 'super_admin' && (
                            <div className="p-4 space-y-1">
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3 ml-2">Administrasi</p>
                                <nav className="space-y-1">
                                    <Link
                                        to="/members"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center space-x-3 p-3 rounded-xl transition-all",
                                            location.pathname === '/members' ? "bg-primary text-white shadow-md shadow-primary/10" : "text-gray-600 hover:bg-primary-50"
                                        )}
                                    >
                                        <Users size={18} weight="duotone" />
                                        <span className="text-sm font-medium tracking-tight">Anggota Kelompok</span>
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center space-x-3 p-3 rounded-xl transition-all",
                                            location.pathname === '/settings' ? "bg-primary text-white shadow-md shadow-primary/10" : "text-gray-600 hover:bg-primary-50"
                                        )}
                                    >
                                        <Gear size={18} weight="duotone" />
                                        <span className="text-sm font-medium tracking-tight">Pengaturan Kelompok</span>
                                    </Link>
                                    <Link
                                        to="/content-management"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center space-x-3 p-3 rounded-xl transition-all",
                                            location.pathname === '/content-management' ? "bg-primary text-white shadow-md shadow-primary/10" : "text-gray-600 hover:bg-primary-50"
                                        )}
                                    >
                                        <Desktop size={18} weight="duotone" />
                                        <span className="text-sm font-medium tracking-tight">Kelola Konten</span>
                                    </Link>
                                </nav>
                            </div>
                        )}

                        <div className="p-4">
                            <button
                                onClick={logout}
                                className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <div className="p-1.5 bg-red-500 text-white rounded-lg shadow-sm">
                                    <SignOut size={16} weight="bold" />
                                </div>
                                <span className="text-sm font-medium tracking-tight">Keluar Akun</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-8 text-center">
                        <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.4em]">Thangun Afa • 1.1.0</p>
                    </div>
                </aside>
            </div>

            {/* Main Content */}
            <main className="flex-1 pb-32">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-t border-primary-100/30 px-6 py-4 sm:hidden">
                <ul className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <li key={item.path} className="relative">
                                <Link
                                    to={item.path}
                                    className={clsx(
                                        "flex flex-col items-center transition-all duration-500",
                                        isActive ? "text-primary -translate-y-1" : "text-gray-300"
                                    )}
                                >
                                    <item.icon
                                        size={22}
                                        weight={isActive ? "fill" : "duotone"}
                                        className="mb-1"
                                    />
                                    <span className={clsx(
                                        "text-[9px] font-black uppercase tracking-widest",
                                        isActive ? "opacity-100" : "opacity-0"
                                    )}>
                                        {item.label}
                                    </span>
                                </Link>
                                {isActive && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </div>
    )
}

export default MainLayout
