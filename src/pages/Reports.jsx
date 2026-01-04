import { useState, useMemo } from 'react'
import { ChartBar, DownloadSimple, ArrowUpRight, ArrowDownLeft } from '@phosphor-icons/react'
import { useTransactions } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { id } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import * as XLSX from 'xlsx'
import { clsx } from 'clsx'

const Reports = () => {
    const { profile } = useAuth()
    const [dateRange, setDateRange] = useState('month')

    const { data: transactions, isLoading } = useTransactions({
        userId: profile?.role === 'member' ? profile.id : null
    })

    const filteredData = useMemo(() => {
        if (!transactions) return []
        const now = new Date()
        let start, end

        if (dateRange === 'week') {
            start = subDays(now, 7)
            end = now
        } else if (dateRange === 'month') {
            start = startOfMonth(now)
            end = endOfMonth(now)
        } else {
            return transactions
        }

        return transactions.filter(t => {
            const date = new Date(t.date)
            return isWithinInterval(date, { start, end })
        })
    }, [transactions, dateRange])

    const stats = useMemo(() => {
        const income = filteredData.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.total_amount), 0)
        const expense = filteredData.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.total_amount), 0)
        return { income, expense, balance: income - expense }
    }, [filteredData])

    const chartData = useMemo(() => {
        const data = [
            { name: 'Pemasukan', value: stats.income, color: '#2D5016' },
            { name: 'Pengeluaran', value: stats.expense, color: '#EF4444' }
        ]
        return data
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

    return (
        <div className="p-5 space-y-8 font-sans pb-28">
            <div className="flex items-center justify-between px-1">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Laporan Keuangan</h1>
                <button
                    onClick={exportToExcel}
                    disabled={filteredData.length === 0}
                    className="flex items-center space-x-2 px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                >
                    <DownloadSimple size={18} weight="bold" />
                    <span>Ekspor</span>
                </button>
            </div>

            {/* Date Filters */}
            <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.25rem] border border-primary-100/30">
                {[
                    { id: 'week', label: '7 Hari' },
                    { id: 'month', label: 'Bulan Ini' },
                    { id: 'all', label: 'Semua' }
                ].map((range) => (
                    <button
                        key={range.id}
                        onClick={() => setDateRange(range.id)}
                        className={clsx(
                            "flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-[1rem] transition-all",
                            dateRange === range.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-primary-100/40">
                    <div className="flex items-center text-primary mb-2">
                        <ArrowUpRight size={18} weight="bold" className="mr-1.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pemasukan</span>
                    </div>
                    <p className="text-lg font-black text-gray-800 tracking-tighter">Rp {stats.income.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-primary-100/40">
                    <div className="flex items-center text-red-500 mb-2">
                        <ArrowDownLeft size={18} weight="bold" className="mr-1.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pengeluaran</span>
                    </div>
                    <p className="text-lg font-black text-gray-800 tracking-tighter">Rp {stats.expense.toLocaleString('id-ID')}</p>
                </div>
                <div className="col-span-2 relative overflow-hidden bg-primary p-6 rounded-[2rem] text-white shadow-xl shadow-primary/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-100 mb-1">Saldo Bersih</p>
                    <p className="text-3xl font-extrabold tracking-tighter">Rp {stats.balance.toLocaleString('id-ID')}</p>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                </div>
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-[2rem] border border-primary-100/40 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Perbandingan Arus Kas</h3>
                    <div className="flex items-center space-x-3 text-[10px] font-bold">
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary mr-1.5"></span>Masuk</div>
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-400 mr-1.5"></span>Keluar</div>
                    </div>
                </div>
                <div className="h-64 w-full">
                    {isLoading ? (
                        <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-2xl animate-pulse">
                            <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Memproses Grafik...</p>
                        </div>
                    ) : filteredData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F8FAFC', radius: 8 }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']}
                                />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center space-y-3 text-gray-300">
                            <ChartBar size={48} weight="duotone" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Data Tidak Ditemukan</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-primary-50/50 p-5 rounded-2xl border border-dashed border-primary-200/50 text-center">
                <p className="text-[10px] text-primary-900/40 italic font-medium leading-relaxed">
                    Data laporan akurat sesuai dengan pencatatan harian anggota dan pengurus Thangun Afa.
                </p>
            </div>
        </div>
    )
}

export default Reports
