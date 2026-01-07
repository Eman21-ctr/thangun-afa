import { Wallet, Plus, Minus } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { useDashboardStats } from '../hooks/useTransactions'

const Dashboard = () => {
    const { profile } = useAuth()
    const { data: stats, isLoading } = useDashboardStats(
        profile?.role === 'member' ? profile.id : null
    )

    const formatCurrency = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

    return (
        <div className="font-sans">
            {/* Hero Section - 1/3 dari atas dengan gambar hortikultura */}
            <div
                className="relative h-48 bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80')`
                }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>

                {/* Greeting text on hero */}
                <div className="relative z-10 h-full flex flex-col justify-end p-5 pb-8 pt-20">
                    <h1 className="text-2xl font-semibold text-white tracking-tight">
                        Halo, {profile?.full_name?.split(' ')[0] || 'User'}!
                    </h1>
                    <p className="text-sm text-white/80 font-normal mt-1">
                        {profile?.role === 'member' ? 'Rangkuman keuangan Anda' : 'Rangkuman keuangan kelompok'}
                    </p>
                </div>
            </div>

            {/* Main Content Area - White background */}
            <div className="bg-white rounded-t-[2rem] -mt-6 relative z-10 p-6 space-y-6 min-h-[60vh]">

                {/* Balance Card - Angka Besar Saldo */}
                <div className="text-center py-6">
                    <div className="flex items-center justify-center mb-2">
                        <Wallet size={20} weight="bold" className="text-primary mr-2" />
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                            Saldo Bersih
                        </span>
                    </div>
                    {isLoading ? (
                        <div className="h-12 w-48 mx-auto bg-gray-100 animate-pulse rounded-xl"></div>
                    ) : (
                        <h2 className="text-4xl font-semibold text-gray-800 tracking-tight">
                            {formatCurrency(stats?.balance)}
                        </h2>
                    )}
                    <p className="text-xs text-gray-400 mt-2 font-normal">
                        Sejak awal pencatatan
                    </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* Income & Expense Summary - Angka Kecil dengan Ikon + dan - */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Pemasukan */}
                    <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100/30">
                        <div className="flex items-center space-x-1 mb-1">
                            <Plus size={12} weight="bold" className="text-green-600" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Pemasukan</p>
                        </div>
                        {isLoading ? (
                            <div className="h-5 w-20 bg-gray-100 animate-pulse rounded"></div>
                        ) : (
                            <p className="text-[15px] font-semibold text-gray-800 tracking-tight truncate">
                                {formatCurrency(stats?.income)}
                            </p>
                        )}
                    </div>

                    {/* Pengeluaran */}
                    <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100/30">
                        <div className="flex items-center space-x-1 mb-1">
                            <Minus size={12} weight="bold" className="text-red-500" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Pengeluaran</p>
                        </div>
                        {isLoading ? (
                            <div className="h-5 w-20 bg-gray-100 animate-pulse rounded"></div>
                        ) : (
                            <p className="text-[15px] font-semibold text-gray-800 tracking-tight truncate">
                                {formatCurrency(stats?.expense)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Info Note */}
                <div className="bg-primary-50/50 p-4 rounded-2xl border border-dashed border-primary-200/50 text-center">
                    <p className="text-xs text-primary-900/60 font-medium italic leading-relaxed">
                        "Pencatatan yang jujur dan teliti adalah fondasi utama menuju kemandirian serta transparansi dalam bertani."
                    </p>
                </div>

                {/* Footer spacing */}
                <div className="h-8"></div>
            </div>
        </div>
    )
}

export default Dashboard
