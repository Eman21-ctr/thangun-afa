import { TrendUp, TrendDown, Wallet, Plus, Minus, Receipt, ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDashboardStats } from '../hooks/useTransactions'

const StatCard = ({ title, value, icon: Icon, loading }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-primary-100/50 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-primary-50 rounded-xl text-primary">
                <Icon size={22} weight="duotone" />
            </div>
        </div>
        <div>
            <p className="text-xs text-gray-400 font-bold mb-1">{title}</p>
            {loading ? (
                <div className="h-7 w-28 bg-gray-50 animate-pulse rounded-lg"></div>
            ) : (
                <p className="text-xl font-extrabold text-gray-800 tracking-tight">{value}</p>
            )}
        </div>
    </div>
)

const Dashboard = () => {
    const { profile } = useAuth()
    const { data: stats, isLoading } = useDashboardStats(
        profile?.role === 'member' ? profile.id : null
    )

    const formatCurrency = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

    return (
        <div className="p-5 space-y-8 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Halo, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
                    <p className="text-sm text-gray-400 font-medium">
                        {profile?.role === 'member' ? 'Berikut rangkuman keuangan Anda.' : 'Berikut rangkuman keuangan grup.'}
                    </p>
                </div>
            </div>

            {/* Main Balance Card */}
            <div className="relative overflow-hidden bg-primary p-6 rounded-[2rem] shadow-xl shadow-primary/20 text-white">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                            <Wallet size={20} weight="duotone" />
                        </div>
                        <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                            Saldo bersih
                        </span>
                    </div>
                    {isLoading ? (
                        <div className="h-10 w-48 bg-white/10 animate-pulse rounded-xl"></div>
                    ) : (
                        <h2 className="text-4xl font-extrabold tracking-tighter">
                            {formatCurrency(stats?.balance)}
                        </h2>
                    )}
                    <div className="mt-6 flex items-center text-accent text-xs font-bold bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                        Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary-600/30 rounded-full blur-3xl"></div>
            </div>

            {/* Secondary KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard
                    title="Pemasukan"
                    value={formatCurrency(stats?.income)}
                    icon={TrendUp}
                    loading={isLoading}
                />
                <StatCard
                    title="Pengeluaran"
                    value={formatCurrency(stats?.expense)}
                    icon={TrendDown}
                    loading={isLoading}
                />
            </div>

            {/* Quick Actions - Unified Light Green Style */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 px-1">Aksi cepat</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/transactions/add?type=income"
                        className="group flex items-center justify-between p-4 bg-accent-50 border border-accent-100 rounded-2xl transition-all active:scale-95"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-accent text-primary rounded-xl shadow-lg shadow-accent/20">
                                <Plus size={18} weight="bold" />
                            </div>
                            <span className="text-sm font-bold text-primary">Pemasukan</span>
                        </div>
                        <ArrowRight size={16} weight="bold" className="text-primary/40 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/transactions/add?type=expense"
                        className="group flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl transition-all active:scale-95"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20">
                                <Minus size={18} weight="bold" />
                            </div>
                            <span className="text-sm font-bold text-red-600">Pengeluaran</span>
                        </div>
                        <ArrowRight size={16} weight="bold" className="text-red-600/40 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Activity Summary */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-gray-400">Aktivitas terakhir</h3>
                    <Link to="/transactions" className="text-primary text-[11px] font-bold">Lihat semua</Link>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-primary-100/50 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-200">
                        <Receipt size={40} weight="duotone" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-gray-800">Belum ada transaksi</h3>
                        <p className="text-xs text-gray-400 font-medium px-4 mt-1 leading-relaxed">
                            Mulai catat pemasukan atau pengeluaran pertama Anda untuk melihat perkembangan di sini.
                        </p>
                    </div>
                    <Link
                        to="/transactions/add"
                        className="px-8 py-3 bg-accent text-primary text-xs font-bold rounded-xl shadow-lg shadow-accent/30 active:scale-95 transition-all"
                    >
                        Catat sekarang
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
