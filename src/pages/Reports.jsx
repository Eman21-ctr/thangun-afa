import { useState, useMemo } from 'react'
import { ChartBar, DownloadSimple, ArrowUpRight, ArrowDownLeft, CalendarBlank, CaretDown, X } from '@phosphor-icons/react'
import { useTransactions } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns'
import { id } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import * as XLSX from 'xlsx'
import { clsx } from 'clsx'

const Reports = () => {
    const { profile } = useAuth()
    const [dateFilterMode, setDateFilterMode] = useState('month') // 'month', 'filterMonth', 'filterYear', 'custom'
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
    const [selectedYear, setSelectedYear] = useState(format(new Date(), 'yyyy'))
    const [customStartDate, setCustomStartDate] = useState('')
    const [customEndDate, setCustomEndDate] = useState('')
    const [showFilterPanel, setShowFilterPanel] = useState(false)

    const { data: transactions, isLoading } = useTransactions({
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

    const filteredData = useMemo(() => {
        if (!transactions) return []
        const now = new Date()

        if (dateFilterMode === 'month') {
            // Bulan ini (default)
            const start = startOfMonth(now)
            const end = endOfMonth(now)
            return transactions.filter(t => {
                const date = new Date(t.date)
                return isWithinInterval(date, { start, end })
            })
        }

        if (dateFilterMode === 'filterMonth') {
            const [year, month] = selectedMonth.split('-').map(Number)
            const start = startOfMonth(new Date(year, month - 1))
            const end = endOfMonth(new Date(year, month - 1))
            return transactions.filter(t => {
                const date = new Date(t.date)
                return isWithinInterval(date, { start, end })
            })
        }

        if (dateFilterMode === 'filterYear') {
            const year = Number(selectedYear)
            const start = startOfYear(new Date(year, 0))
            const end = endOfYear(new Date(year, 0))
            return transactions.filter(t => {
                const date = new Date(t.date)
                return isWithinInterval(date, { start, end })
            })
        }

        if (dateFilterMode === 'custom' && customStartDate && customEndDate) {
            const start = new Date(customStartDate)
            const end = new Date(customEndDate)
            return transactions.filter(t => {
                const date = new Date(t.date)
                return isWithinInterval(date, { start, end })
            })
        }

        return transactions
    }, [transactions, dateFilterMode, selectedMonth, selectedYear, customStartDate, customEndDate])

    const stats = useMemo(() => {
        const income = filteredData.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.total_amount), 0)
        const expense = filteredData.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.total_amount), 0)
        return { income, expense, balance: income - expense }
    }, [filteredData])

    const chartData = useMemo(() => {
        return [
            { name: 'Pemasukan', value: stats.income, color: '#2D5016' },
            { name: 'Pengeluaran', value: stats.expense, color: '#EF4444' }
        ]
    }, [stats])

    const exportToExcel = () => {
        const dataToExport = filteredData.map(t => ({
            Tanggal: format(new Date(t.date), 'dd/MM/yyyy'),
            Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
            Kategori: t.commodity || t.category,
            Deskripsi: t.description,
            Jumlah: t.quantity,
            Satuan: t.unit,
            'Harga Satuan': t.unit_price,
            Total: t.total_amount,
            Catatan: t.notes || ''
        }))

        const ws = XLSX.utils.json_to_sheet(dataToExport)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Laporan Transaksi")
        XLSX.writeFile(wb, `Laporan_ThangunAfa_${format(new Date(), 'yyyyMMdd')}.xlsx`)
    }

    const getFilterLabel = () => {
        if (dateFilterMode === 'month') return 'Bulan Ini'
        if (dateFilterMode === 'filterMonth') {
            const opt = monthOptions.find(m => m.value === selectedMonth)
            return opt?.label || 'Pilih Bulan'
        }
        if (dateFilterMode === 'filterYear') return `Tahun ${selectedYear}`
        if (dateFilterMode === 'custom' && customStartDate && customEndDate) {
            return `${format(new Date(customStartDate), 'dd/MM/yy')} - ${format(new Date(customEndDate), 'dd/MM/yy')}`
        }
        return 'Pilih Periode'
    }

    return (
        <div className="p-5 space-y-6 font-sans pb-28">
            <div className="flex items-center justify-between px-1">
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Laporan Keuangan</h1>
                <button
                    onClick={exportToExcel}
                    disabled={filteredData.length === 0}
                    className="p-2 text-primary hover:text-primary-600 transition-all active:scale-90 disabled:opacity-30 flex items-center justify-center rounded-xl hover:bg-primary-50"
                >
                    <DownloadSimple size={24} weight="duotone" />
                </button>
            </div>

            {/* Date Filter Tabs */}
            <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.25rem] border border-primary-100/30">
                {[
                    { id: 'month', label: 'Bulan Ini' },
                    { id: 'filterMonth', label: 'Bulan' },
                    { id: 'filterYear', label: 'Tahun' },
                    { id: 'custom', label: 'Custom' }
                ].map((range) => (
                    <button
                        key={range.id}
                        onClick={() => {
                            setDateFilterMode(range.id)
                            if (range.id !== 'month') setShowFilterPanel(true)
                        }}
                        className={clsx(
                            "flex-1 py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] rounded-[1rem] transition-all",
                            dateFilterMode === range.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            {/* Filter Options Panel */}
            {showFilterPanel && dateFilterMode !== 'month' && (
                <div className="bg-white p-4 rounded-2xl border border-primary-100/50 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                            {dateFilterMode === 'filterMonth' && 'Pilih Bulan'}
                            {dateFilterMode === 'filterYear' && 'Pilih Tahun'}
                            {dateFilterMode === 'custom' && 'Rentang Custom'}
                        </span>
                        <button onClick={() => setShowFilterPanel(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={18} weight="duotone" />
                        </button>
                    </div>

                    {dateFilterMode === 'filterMonth' && (
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

                    {dateFilterMode === 'filterYear' && (
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

            {/* Active Filter Info */}
            <div className="text-center">
                <span className="text-xs text-gray-400 font-normal">
                    Menampilkan data: <span className="text-primary font-medium">{getFilterLabel()}</span>
                </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-primary-100/40">
                    <div className="flex items-center text-primary mb-2">
                        <ArrowUpRight size={18} weight="bold" className="mr-1.5" />
                        <span className="text-[10px] font-medium uppercase tracking-widest">Pemasukan</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 tracking-tight">Rp {stats.income.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-primary-100/40">
                    <div className="flex items-center text-red-500 mb-2">
                        <ArrowDownLeft size={18} weight="bold" className="mr-1.5" />
                        <span className="text-[10px] font-medium uppercase tracking-widest">Pengeluaran</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 tracking-tight">Rp {stats.expense.toLocaleString('id-ID')}</p>
                </div>
                <div className="col-span-2 relative overflow-hidden p-6 rounded-[2rem] text-white shadow-xl shadow-[#cbae11]/20" style={{ backgroundColor: '#cbae11' }}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 mb-1">Saldo Bersih</p>
                    <p className="text-3xl font-semibold tracking-tight">Rp {stats.balance.toLocaleString('id-ID')}</p>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                </div>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="bg-white p-6 rounded-[2rem] border border-primary-100/40 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest">Perbandingan Arus Kas</h3>
                    <div className="flex items-center space-x-3 text-[10px] font-medium">
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary mr-1.5"></span>Masuk</div>
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-400 mr-1.5"></span>Keluar</div>
                    </div>
                </div>
                <div className="h-32 w-full">
                    {isLoading ? (
                        <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-2xl animate-pulse">
                            <p className="text-[10px] font-medium text-primary/30 uppercase tracking-widest">Memproses Grafik...</p>
                        </div>
                    ) : filteredData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 500, fill: '#94A3B8' }}
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 500, fill: '#94A3B8' }}
                                    width={80}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F8FAFC', radius: 8 }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                                    formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']}
                                />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center space-y-3 text-gray-300">
                            <ChartBar size={48} weight="duotone" />
                            <p className="text-[10px] font-medium uppercase tracking-widest">Data Tidak Ditemukan</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-primary-50/50 p-5 rounded-2xl border border-dashed border-primary-200/50 text-center">
                <p className="text-[10px] text-primary-900/40 italic font-normal leading-relaxed">
                    Data laporan akurat sesuai dengan pencatatan harian anggota dan pengurus Thangun Afa.
                </p>
            </div>
        </div>
    )
}

export default Reports
