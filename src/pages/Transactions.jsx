import { useState, useMemo } from 'react'
import { Plus, MagnifyingGlass, Funnel, ArrowUpRight, ArrowDownLeft, CircleNotch, Receipt, X, CalendarBlank, CaretDown } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parse } from 'date-fns'
import { id } from 'date-fns/locale'
import { clsx } from 'clsx'
import { useTransactions } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'

const TransactionCard = ({ transaction }) => (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-primary-100/30 flex items-center justify-between active:scale-[0.98] transition-all">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={clsx(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                transaction.type === 'income' ? "bg-primary-50 text-primary" : "bg-red-50 text-red-500"
            )}>
                {transaction.type === 'income' ? <ArrowUpRight size={18} weight="duotone" /> : <ArrowDownLeft size={18} weight="duotone" />}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 line-clamp-1 tracking-tight text-[13px]">{transaction.description}</p>
                <div className="flex items-center text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">
                    <span>{format(new Date(transaction.date), 'dd MMM yyyy', { locale: id })}</span>
                    <span className="mx-1.5">•</span>
                    <span className="text-primary-600/60">{transaction.commodity || transaction.category}</span>
                </div>
            </div>
        </div>
        <div className="text-right">
            <p className={clsx(
                "font-semibold text-[14px] tracking-tight",
                transaction.type === 'income' ? "text-primary" : "text-red-500"
            )}>
                {transaction.type === 'income' ? "+" : "-"} Rp {transaction.total_amount.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-gray-400 font-medium uppercase">{transaction.quantity} {transaction.unit}</p>
        </div>
    </div>
)

const Transactions = () => {
    const { profile } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [showDateFilter, setShowDateFilter] = useState(false)
    const [dateFilterMode, setDateFilterMode] = useState('all') // 'all', 'month', 'year', 'custom'
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
    const [selectedYear, setSelectedYear] = useState(format(new Date(), 'yyyy'))
    const [customStartDate, setCustomStartDate] = useState('')
    const [customEndDate, setCustomEndDate] = useState('')

    const { data: transactions, isLoading } = useTransactions({
        type: filterType,
        userId: profile?.role === 'member' ? profile.id : null
    })

    // Generate month options (last 24 months)
    const monthOptions = useMemo(() => {
        const options = []
        const now = new Date()
        for (let i = 0; i < 24; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            options.push({
                value: format(d, 'yyyy-MM'),
                label: format(d, 'MMMM yyyy', { locale: id })
            })
        }
        return options
    }, [])

    // Generate year options (last 5 years)
    const yearOptions = useMemo(() => {
        const options = []
        const currentYear = new Date().getFullYear()
        for (let i = 0; i < 5; i++) {
            const year = currentYear - i
            options.push({ value: String(year), label: String(year) })
        }
        return options
    }, [])

    // Apply date filtering
    const dateFilteredTransactions = useMemo(() => {
        if (!transactions) return []
        if (dateFilterMode === 'all') return transactions

        return transactions.filter(tx => {
            const txDate = new Date(tx.date)

            if (dateFilterMode === 'month') {
                const [year, month] = selectedMonth.split('-').map(Number)
                const start = startOfMonth(new Date(year, month - 1))
                const end = endOfMonth(new Date(year, month - 1))
                return isWithinInterval(txDate, { start, end })
            }

            if (dateFilterMode === 'year') {
                const year = Number(selectedYear)
                const start = startOfYear(new Date(year, 0))
                const end = endOfYear(new Date(year, 0))
                return isWithinInterval(txDate, { start, end })
            }

            if (dateFilterMode === 'custom' && customStartDate && customEndDate) {
                const start = new Date(customStartDate)
                const end = new Date(customEndDate)
                return isWithinInterval(txDate, { start, end })
            }

            return true
        })
    }, [transactions, dateFilterMode, selectedMonth, selectedYear, customStartDate, customEndDate])

    // Apply search filter
    const filteredTransactions = dateFilteredTransactions?.filter(tx =>
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.commodity || tx.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getDateFilterLabel = () => {
        if (dateFilterMode === 'all') return 'Semua Waktu'
        if (dateFilterMode === 'month') {
            const opt = monthOptions.find(m => m.value === selectedMonth)
            return opt?.label || 'Pilih Bulan'
        }
        if (dateFilterMode === 'year') return `Tahun ${selectedYear}`
        if (dateFilterMode === 'custom' && customStartDate && customEndDate) {
            return `${format(new Date(customStartDate), 'dd/MM/yy')} - ${format(new Date(customEndDate), 'dd/MM/yy')}`
        }
        return 'Filter Tanggal'
    }

    return (
        <div className="p-5 space-y-6 font-sans">
            <div className="flex items-center justify-between px-1">
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Riwayat Transaksi</h1>
                <div className="p-2 bg-primary-50 rounded-xl text-primary">
                    <Receipt size={20} weight="duotone" />
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex space-x-3">
                <div className="relative flex-1 group">
                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} weight="duotone" />
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-primary-100/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm font-normal transition-all"
                    />
                </div>
                <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className={clsx(
                        "p-3 bg-white border rounded-2xl transition-all",
                        showDateFilter || dateFilterMode !== 'all'
                            ? "border-primary text-primary bg-primary-50"
                            : "border-primary-100/50 text-gray-400 hover:text-primary"
                    )}
                >
                    <Funnel size={20} weight="duotone" />
                </button>
            </div>

            {/* Date Filter Panel */}
            {showDateFilter && (
                <div className="bg-white p-4 rounded-2xl border border-primary-100/50 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-800">Filter Tanggal</h3>
                        <button onClick={() => setShowDateFilter(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={18} weight="duotone" />
                        </button>
                    </div>

                    {/* Date Filter Mode Tabs */}
                    <div className="flex bg-gray-50 p-1 rounded-xl">
                        {[
                            { id: 'all', label: 'Semua' },
                            { id: 'month', label: 'Bulan' },
                            { id: 'year', label: 'Tahun' },
                            { id: 'custom', label: 'Custom' }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setDateFilterMode(mode.id)}
                                className={clsx(
                                    "flex-1 py-2 text-xs font-medium rounded-lg transition-all",
                                    dateFilterMode === mode.id
                                        ? "bg-primary text-white shadow"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    {/* Month Picker */}
                    {dateFilterMode === 'month' && (
                        <div className="relative">
                            <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border-0 rounded-xl text-sm font-normal appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {monthOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    )}

                    {/* Year Picker */}
                    {dateFilterMode === 'year' && (
                        <div className="relative">
                            <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border-0 rounded-xl text-sm font-normal appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {yearOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    )}

                    {/* Custom Date Range */}
                    {dateFilterMode === 'custom' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 font-medium mb-1 block">Dari</label>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-medium mb-1 block">Sampai</label>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Active Filter Badge */}
            {dateFilterMode !== 'all' && (
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Filter aktif:</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary text-xs font-medium rounded-full flex items-center">
                        <CalendarBlank size={14} className="mr-1" />
                        {getDateFilterLabel()}
                        <button
                            onClick={() => setDateFilterMode('all')}
                            className="ml-2 text-primary/60 hover:text-primary"
                        >
                            <X size={14} weight="bold" />
                        </button>
                    </span>
                </div>
            )}

            {/* Type Tabs */}
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
                            "flex-1 py-2.5 text-xs font-medium uppercase tracking-widest rounded-[1rem] transition-all",
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
                        <p className="text-xs font-medium uppercase tracking-widest">Memproses Data...</p>
                    </div>
                ) : filteredTransactions && filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => <TransactionCard key={tx.id} transaction={tx} />)
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Receipt size={40} weight="duotone" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Tidak ada data</p>
                            <p className="text-xs text-gray-400 font-normal px-8 mt-1">
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
