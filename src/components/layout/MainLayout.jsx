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
            <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-lg border-b border-primary-100/50">
                <div className="flex items-center space-x-3">
                    <img src="/images/logo-color.png" alt="Thangun Afa" className="h-10 w-auto" />
                </div>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-3 text-gray-400 hover:text-primary bg-gray-50 rounded-2xl transition-all active:scale-90"
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
                        "fixed inset-y-0 right-0 z-[60] w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-out p-8 flex flex-col rounded-l-[3rem]",
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Drawer Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div className="p-2.5 bg-primary-50 text-primary rounded-xl">
                            <Sparkle size={20} weight="fill" />
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-600">
                            <X size={20} weight="bold" />
                        </button>
                    </div>

                    {/* Drawer Profile */}
                    <div className="flex flex-col items-center text-center mb-10 pb-10 border-b border-gray-50">
                        <div className="w-20 h-20 bg-primary-50 rounded-[2rem] flex items-center justify-center text-primary text-2xl font-black border-4 border-white shadow-xl mb-4">
                            {profile?.full_name?.charAt(0) || 'U'}
                        </div>
                        <h3 className="font-black text-gray-800 tracking-tight text-lg">{profile?.full_name}</h3>
                        <p className="text-[10px] font-black px-3 py-1 bg-primary text-white rounded-full uppercase tracking-widest mt-2">
                            {profile?.role?.replace('_', ' ')}
                        </p>
                    </div>

                    {/* Drawer Content */}
                    <div className="flex-1 space-y-10 overflow-y-auto">
                        {profile?.role === 'super_admin' && (
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4 ml-1">Administrasi</p>
                                <nav className="space-y-2">
                                    <Link
                                        to="/members"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center space-x-4 p-4 rounded-2xl transition-all group",
                                            location.pathname === '/members' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-gray-600 hover:bg-primary-50"
                                        )}
                                    >
                                        <Users size={20} weight={location.pathname === '/members' ? "fill" : "regular"} />
                                        <span className="text-sm font-black tracking-tight">Manajemen Anggota</span>
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center space-x-4 p-4 rounded-2xl transition-all group",
                                            location.pathname === '/settings' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-gray-600 hover:bg-primary-50"
                                        )}
                                    >
                                        <Gear size={20} weight={location.pathname === '/settings' ? "fill" : "regular"} />
                                        <span className="text-sm font-black tracking-tight">Pengaturan Grup</span>
                                    </Link>
                                    <Link
                                        to="/content-management"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center space-x-4 p-4 rounded-2xl transition-all group",
                                            location.pathname === '/content-management' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-gray-600 hover:bg-primary-50"
                                        )}
                                    >
                                        <Desktop size={20} weight={location.pathname === '/content-management' ? "fill" : "regular"} />
                                        <span className="text-sm font-black tracking-tight">Kelola Konten</span>
                                    </Link>
                                </nav>
                            </div>
                        )}

                        <div>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4 ml-1">Aksi Lain</p>
                            <nav className="space-y-2">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center space-x-4 p-4 text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
                                >
                                    <div className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 group-hover:scale-110">
                                        <SignOut size={16} weight="bold" />
                                    </div>
                                    <span className="text-sm font-black tracking-tight">Keluar Akun</span>
                                </button>
                            </nav>
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
                                        size={24}
                                        weight={isActive ? "fill" : "regular"}
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
