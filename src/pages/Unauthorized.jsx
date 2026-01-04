import { Link } from 'react-router-dom'
import { ShieldWarning, ArrowLeft, SignOut } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'

const Unauthorized = () => {
    const { profile, logout } = useAuth()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream text-center font-sans">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
                <ShieldWarning size={48} weight="duotone" />
            </div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Akses Ditolak</h1>
            <p className="text-gray-400 font-medium mb-6 max-w-xs">
                Maaf, akun Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>

            {/* Debug Info Overlay */}
            <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-left w-full max-w-xs mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Informasi Debug</p>
                <div className="space-y-1">
                    <p className="text-xs text-gray-700 font-medium"><strong>Email:</strong> {profile?.email || 'Tidak terbaca'}</p>
                    <p className="text-xs text-gray-700 font-medium"><strong>Role Sekarang:</strong> <span className="text-red-600 font-bold capitalize">{profile?.role || 'null'}</span></p>
                </div>
            </div>

            <div className="flex flex-col w-full max-w-xs space-y-3">
                <Link
                    to="/dashboard"
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <ArrowLeft size={20} weight="bold" />
                    <span>Kembali ke Beranda</span>
                </Link>
                <button
                    onClick={() => logout()}
                    className="flex items-center justify-center space-x-2 px-6 py-4 border-2 border-red-100 text-red-600 font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 transition-all active:scale-95"
                >
                    <SignOut size={20} weight="bold" />
                    <span>Keluar & Coba Lagi</span>
                </button>
            </div>
        </div>
    )
}

export default Unauthorized
