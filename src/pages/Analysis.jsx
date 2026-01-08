import { useMemo } from 'react'
import { Ranking, Scales, Coins, TrendUp, Info, Package } from '@phosphor-icons/react'
import { useTransactions } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'
import { clsx } from 'clsx'

const Analysis = () => {
    const { profile } = useAuth()
    const { data: transactions, isLoading } = useTransactions({
        userId: profile?.role === 'member' ? profile.id : null
    })

    const analysisData = useMemo(() => {
        if (!transactions) return []

        // 1. Group by Commodity
        const commodities = {}
        let totalRevenue = 0
        let totalSharedExpense = 0

        transactions.forEach(tx => {
            const amount = Number(tx.total_amount)
            if (tx.type === 'income') {
                const name = tx.commodity || 'Tanpa Nama'
                if (!commodities[name]) commodities[name] = { name, revenue: 0, specificExpense: 0, count: 0 }
                commodities[name].revenue += amount
                commodities[name].count++
                totalRevenue += amount
            } else {
                if (tx.commodity) {
                    const name = tx.commodity
                    if (!commodities[name]) commodities[name] = { name, revenue: 0, specificExpense: 0, count: 0 }
                    commodities[name].specificExpense += amount
                } else {
                    totalSharedExpense += amount
                }
            }
        })

        // 2. Allocate shared expenses based on revenue proportion
        const result = Object.values(commodities).map(c => {
            const revenueShare = totalRevenue > 0 ? c.revenue / totalRevenue : 0
            const allocatedSharedExpense = totalSharedExpense * revenueShare
            const totalExpense = c.specificExpense + allocatedSharedExpense
            const netProfit = c.revenue - totalExpense
            const margin = c.revenue > 0 ? (netProfit / c.revenue) * 100 : 0

            return {
                ...c,
                allocatedSharedExpense,
                totalExpense,
                netProfit,
                margin
            }
        })

        // 3. Sort by Net Profit
        return result.sort((a, b) => b.netProfit - a.netProfit)
    }, [transactions])

    if (isLoading) return (
        <div className="p-8 text-center text-gray-400">
            <p className="animate-pulse">Menganalisa performa...</p>
        </div>
    )

    return (
        <div className="p-5 space-y-6 font-sans">
            <header className="px-1">
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Analisa Komoditas</h1>
                <p className="text-xs text-gray-400 mt-1">Performa keuangan berdasarkan jenis tanaman</p>
            </header>

            {/* Note about shared cost */}
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 flex items-start space-x-3">
                <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" weight="duotone" />
                <p className="text-[10px] text-blue-800/70 leading-relaxed font-medium">
                    Biaya operasional umum (seperti pupuk/obat yang dipakai bersama) dialokasikan secara proporsional berdasarkan kontribusi pendapatan masing-masing komoditas.
                </p>
            </div>

            <div className="space-y-4">
                {analysisData.length > 0 ? (
                    analysisData.map((data, index) => (
                        <div key={data.name} className="bg-white rounded-[2rem] border border-primary-100/30 overflow-hidden shadow-sm">
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={clsx(
                                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm",
                                            index === 0 ? "bg-primary text-white" : "bg-gray-50 text-gray-400"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 tracking-tight">{data.name}</h3>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{data.count} Transaksi Jual</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={clsx(
                                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block",
                                            data.margin > 50 ? "bg-green-100 text-green-700" : "bg-primary-50 text-primary"
                                        )}>
                                            {data.margin.toFixed(1)}% Margin
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <TrendUp size={12} weight="bold" className="text-primary" /> Pendapatan
                                        </p>
                                        <p className="text-xs font-bold text-gray-800">Rp {data.revenue.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Scales size={12} weight="bold" className="text-red-400" /> Total Biaya
                                        </p>
                                        <p className="text-xs font-bold text-gray-800">Rp {data.totalExpense.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Coins size={20} weight="duotone" className="text-primary" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Laba Bersih</span>
                                    </div>
                                    <p className="text-lg font-black text-primary tracking-tight">
                                        Rp {data.netProfit.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-24 text-center space-y-4">
                        <Package size={48} weight="duotone" className="mx-auto text-gray-200" />
                        <p className="text-xs text-gray-400 font-medium">Belum ada data pendapatan komoditas untuk dianalisa.</p>
                    </div>
                )}
            </div>

            <div className="h-20"></div>
        </div>
    )
}

export default Analysis
