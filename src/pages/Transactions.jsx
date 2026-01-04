import { useState } from 'react'
import { Plus, MagnifyingGlass, Funnel, ArrowUpRight, ArrowDownLeft, CircleNotch, Receipt } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { clsx } from 'clsx'
import { useTransactions } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'

const TransactionCard = ({ transaction }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary-100/30 flex items-center justify-between active:scale-[0.98] transition-all">
        <div className="flex items-center space-x-4">
            <div className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                transaction.type === 'income' ? "bg-primary-50 text-primary" : "bg-red-50 text-red-500"
            )}>
                {transaction.type === 'income' ? <ArrowUpRight size={22} weight="bold" /> : <ArrowDownLeft size={22} weight="bold" />}
            </div>
            <div>
                <p className="font-extrabold text-gray-800 line-clamp-1 tracking-tight">{transaction.description}</p>
                <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    <span>{format(new Date(transaction.date), 'dd MMM yyyy', { locale: id })}</span>
                    <span className="mx-1.5">•</span>
                    <span className="text-primary-600/60">{transaction.commodity || transaction.category}</span>
                </div>
            </div>
        </div>
        <div className="text-right">
            <p className={clsx(
                "font-black text-base tracking-tighter",
                transaction.type === 'income' ? "text-primary" : "text-red-500"
            )}>
                {transaction.type === 'income' ? "+" : "-"} Rp {transaction.total_amount.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">{transaction.quantity} {transaction.unit}</p>
        </div>
    </div>
)

const Transactions = () => {
    const { profile } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')

    const { data: transactions, isLoading } = useTransactions({
        type: filterType,
        userId: profile?.role === 'member' ? profile.id : null
    })

    const filteredTransactions = transactions?.filter(tx =>
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.commodity || tx.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-5 space-y-6 font-sans">
            <div className="flex items-center justify-between px-1">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Riwayat Transaksi</h1>
                <div className="p-2 bg-primary-50 rounded-xl text-primary">
                    <Receipt size={20} weight="duotone" />
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex space-x-3">
                <div className="relative flex-1 group">
                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} weight="bold" />
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-primary-100/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm font-medium transition-all"
                    />
                </div>
                <button className="p-3 bg-white border border-primary-100/50 rounded-2xl text-gray-400 hover:text-primary active:bg-primary-50 transition-all">
                    <Funnel size={20} weight="bold" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.25rem] border border-primary-100/30">
                {[
                    { id: 'all', label: 'Semua' },
                    { id: 'income', label: 'Masuk' },
                    { id: 'expense', label: 'Keluar' }
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setFilterType(type.id)}
                        className={clsx(
                            "flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-[1rem] transition-all",
                            filterType === type.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-primary-200">
                        <CircleNotch className="animate-spin mb-4" size={40} weight="bold" />
                        <p className="text-xs font-black uppercase tracking-widest">Memproses Data...</p>
                    </div>
                ) : filteredTransactions && filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => <TransactionCard key={tx.id} transaction={tx} />)
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Receipt size={40} weight="duotone" />
                        </div>
                        <div>
                            <p className="font-extrabold text-gray-800">Tidak ada data</p>
                            <p className="text-xs text-gray-400 font-medium px-8 mt-1">
                                {searchTerm ? 'Pencarian Anda tidak membuahkan hasil.' : 'Belum ada catatan transaksi di periode ini.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* FAB */}
            <Link
                to="/transactions/add"
                className="fixed bottom-28 right-6 w-16 h-16 bg-primary text-white rounded-2xl shadow-[0_12px_24px_-8px_rgba(45,80,22,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30"
            >
                <Plus size={32} weight="bold" />
            </Link>
        </div>
    )
}

export default Transactions
