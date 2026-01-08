import { useState, useMemo, useEffect } from 'react'
import { Plus, MagnifyingGlass, Funnel, ArrowUpRight, ArrowDownLeft, CircleNotch, Receipt, X, CalendarBlank, CaretDown, PencilSimple, Trash, Tag, Package, Scales, Coins, Notepad, User, Check, FloppyDisk, DownloadSimple, WhatsappLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parse } from 'date-fns'
import { id } from 'date-fns/locale'
import { clsx } from 'clsx'
import { useTransactions, useTransactionMutations } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import * as XLSX from 'xlsx'

const TransactionCard = ({ transaction, onClick }) => (
    <div
        onClick={() => onClick(transaction)}
        className="bg-white p-3 rounded-xl shadow-sm border border-primary-100/30 flex items-center justify-between active:scale-[0.98] transition-all group cursor-pointer"
    >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={clsx(
                "flex items-center justify-center flex-shrink-0 transition-colors",
                transaction.type === 'income' ? "text-primary" : "text-red-500"
            )}>
                {transaction.type === 'income' ? <ArrowUpRight size={18} weight="bold" /> : <ArrowDownLeft size={18} weight="bold" />}
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

        <div className="flex items-center space-x-3 ml-4">
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
    </div>
)

const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    date: z.string().min(1, 'Tanggal wajib diisi'),
    category: z.string().optional().nullable(),
    commodity: z.string().optional().nullable(),
    description: z.string().min(3, 'Deskripsi minimal 3 karakter'),
    quantity: z.number({ invalid_type_error: 'Harus berupa angka' }).positive('Jumlah harus positif'),
    unit: z.string().min(1, 'Satuan wajib diisi'),
    unit_price: z.number({ invalid_type_error: 'Harus berupa angka' }).positive('Harga satuan harus positif'),
    total_amount: z.number().positive(),
    buyer: z.string().optional().nullable(),
    buyer_phone: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
})

const TransactionDetailModal = ({ transaction, onClose, onEdit, onDelete }) => {
    const handleWhatsAppShare = () => {
        const phone = transaction.buyer_phone?.replace(/\D/g, '') || ''
        if (!phone) {
            toast.error('Nomor WA pembeli tidak tersedia')
            return
        }

        const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
        const message = `*NOTA PENJUALAN THANGUN AFA* 🚜%0A------------------------------%0ATanggal: ${format(new Date(transaction.date), 'dd MMM yyyy', { locale: id })}%0AProduk: *${transaction.description}*%0AJumlah: ${transaction.quantity} ${transaction.unit}%0ATotal: *Rp ${transaction.total_amount.toLocaleString('id-ID')}*%0A------------------------------%0ATerima kasih sudah mendukung petani lokal NTT! 🌾`

        window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Detail Transaksi</h2>
                    <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-600 transition-colors">
                        <X size={20} weight="bold" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{transaction.description}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <CalendarBlank size={16} weight="bold" />
                                <span>{format(new Date(transaction.date), 'PPPP', { locale: id })}</span>
                            </div>
                        </div>
                        <div className={clsx(
                            "px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-sm",
                            transaction.type === 'income' ? "bg-primary-50 text-primary" : "bg-red-50 text-red-500"
                        )}>
                            {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <Package size={14} weight="duotone" />
                                {transaction.type === 'income' ? 'Komoditas' : 'Kategori'}
                            </p>
                            <p className="text-sm font-semibold text-gray-800">{transaction.commodity || transaction.category || 'Umum'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <Scales size={14} weight="duotone" />
                                Kuantitas
                            </p>
                            <p className="text-sm font-semibold text-gray-800">{transaction.quantity} {transaction.unit}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <Coins size={14} weight="duotone" />
                                Harga Satuan
                            </p>
                            <p className="text-sm font-semibold text-gray-800">Rp {transaction.unit_price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="p-4 bg-primary-50 rounded-[1.5rem] border border-primary-100/50">
                            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <Receipt size={14} weight="duotone" />
                                Total
                            </p>
                            <p className="text-lg font-bold text-primary">Rp {transaction.total_amount.toLocaleString('id-ID')}</p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {(transaction.buyer || transaction.notes) && (
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                            {(transaction.buyer || transaction.buyer_phone) && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                            <User size={20} weight="duotone" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pembeli</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {transaction.buyer || 'N/A'} {transaction.buyer_phone && <span className="text-xs text-gray-400 font-normal ml-1">({transaction.buyer_phone})</span>}
                                            </p>
                                        </div>
                                    </div>
                                    {transaction.type === 'income' && transaction.buyer_phone && (
                                        <button
                                            onClick={handleWhatsAppShare}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all active:scale-95 shadow-sm"
                                        >
                                            <WhatsappLogo size={16} weight="bold" />
                                            <span>Kirim Nota</span>
                                        </button>
                                    )}
                                </div>
                            )}
                            {transaction.notes && (
                                <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mt-1">
                                        <Notepad size={20} weight="duotone" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catatan Tambahan</p>
                                        <p className="text-sm font-medium text-gray-600 leading-relaxed italic">"{transaction.notes}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            onClick={() => {
                                onDelete(transaction.id)
                                onClose()
                            }}
                            className="flex-1 py-4 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center space-x-2"
                        >
                            <Trash size={20} weight="bold" />
                            <span>Hapus</span>
                        </button>
                        <button
                            onClick={() => {
                                onEdit(transaction)
                                onClose()
                            }}
                            className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
                        >
                            <PencilSimple size={20} weight="bold" />
                            <span>Edit Transaksi</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const EditTransactionModal = ({ transaction, onClose, onSave }) => {
    const [categories, setCategories] = useState([])
    const [commodities, setCommodities] = useState([])
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            ...transaction,
            date: format(new Date(transaction.date), 'yyyy-MM-dd')
        }
    })

    const type = watch('type')
    const quantity = watch('quantity')
    const unitPrice = watch('unit_price')

    useEffect(() => {
        const calculatedTotal = (quantity || 0) * (unitPrice || 0)
        setValue('total_amount', calculatedTotal, { shouldValidate: true })
    }, [quantity, unitPrice, setValue])

    useEffect(() => {
        fetchMetadata()
    }, [])

    const fetchMetadata = async () => {
        const { data: catData } = await supabase.from('expense_categories').select('*').eq('is_active', true)
        const { data: comData } = await supabase.from('commodities').select('*').eq('is_active', true)
        setCategories(catData || [])
        setCommodities(comData || [])
    }

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const cleanData = {
                type: data.type,
                date: data.date,
                category: data.category || null,
                commodity: data.commodity || null,
                description: data.description,
                quantity: Number(data.quantity),
                unit: data.unit,
                unit_price: Number(data.unit_price),
                total_amount: Number(data.total_amount),
                buyer: data.buyer || null,
                buyer_phone: data.buyer_phone || null,
                notes: data.notes || null,
            }

            await onSave(transaction.id, cleanData)
            onClose()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Edit Transaksi</h2>
                    <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-600 transition-colors">
                        <X size={20} weight="bold" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Type Toggle */}
                    <div className="bg-gray-50 p-1 rounded-xl border border-primary-100/30 flex">
                        <button
                            type="button"
                            onClick={() => setValue('type', 'income')}
                            className={clsx(
                                "flex-1 py-2 text-xs font-medium uppercase tracking-wide rounded-lg transition-all",
                                type === 'income' ? "bg-primary text-white shadow" : "text-gray-400"
                            )}
                        >
                            Pemasukan
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('type', 'expense')}
                            className={clsx(
                                "flex-1 py-2 text-xs font-medium uppercase tracking-wide rounded-lg transition-all",
                                type === 'expense' ? "bg-red-500 text-white shadow" : "text-gray-400"
                            )}
                        >
                            Pengeluaran
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Date */}
                        <div className="relative">
                            <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                            <input
                                type="date"
                                {...register('date')}
                                className={clsx(
                                    "w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm",
                                    errors.date ? "border-red-500" : "border-primary-100/30"
                                )}
                            />
                            {errors.date && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.date.message}</p>}
                        </div>

                        {/* Commodity Select (Always show, optional for expense) */}
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                            <select
                                {...register('commodity')}
                                className={clsx(
                                    "w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm appearance-none",
                                    errors.commodity ? "border-red-500" : "border-primary-100/30"
                                )}
                            >
                                <option value="">{type === 'income' ? 'Pilih Komoditas' : 'Pilih Komoditas (Opsional/Umum)'}</option>
                                {commodities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            {errors.commodity && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.commodity.message}</p>}
                        </div>

                        {/* Category only for Expense */}
                        {type === 'expense' && (
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                                <select
                                    {...register('category')}
                                    className={clsx(
                                        "w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm appearance-none",
                                        errors.category ? "border-red-500" : "border-primary-100/30"
                                    )}
                                >
                                    <option value="">Pilih Kategori Pengeluaran</option>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                                {errors.category && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.category.message}</p>}
                            </div>
                        )}

                        {/* Description */}
                        <div className="relative">
                            <Notepad className="absolute left-3 top-3 text-gray-400" size={18} weight="duotone" />
                            <input
                                type="text"
                                placeholder="Deskripsi transaksi"
                                {...register('description')}
                                className={clsx(
                                    "w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300",
                                    errors.description ? "border-red-500" : "border-primary-100/30"
                                )}
                            />
                            {errors.description && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.description.message}</p>}
                        </div>

                        {/* Quantity & Unit */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <Scales className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Jumlah"
                                    {...register('quantity', { valueAsNumber: true })}
                                    className={clsx(
                                        "w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm",
                                        errors.quantity ? "border-red-500" : "border-primary-100/30"
                                    )}
                                />
                                {errors.quantity && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.quantity.message}</p>}
                            </div>
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    placeholder="Satuan (kg, bok)"
                                    {...register('unit')}
                                    className={clsx(
                                        "w-full px-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300",
                                        errors.unit ? "border-red-500" : "border-primary-100/30"
                                    )}
                                />
                                {errors.unit && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.unit.message}</p>}
                            </div>
                        </div>

                        {/* Unit Price */}
                        <div className="relative">
                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                            <input
                                type="number"
                                placeholder="Harga satuan (Rp)"
                                {...register('unit_price', { valueAsNumber: true })}
                                className={clsx(
                                    "w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm",
                                    errors.unit_price ? "border-red-500" : "border-primary-100/30"
                                )}
                            />
                            {errors.unit_price && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.unit_price.message}</p>}
                        </div>

                        {/* Total Display */}
                        <div className="p-4 bg-primary-50 rounded-xl border border-dashed border-primary-200 flex items-center justify-between">
                            <span className="text-xs text-primary/60 font-medium">Total</span>
                            <span className="text-xl font-semibold text-primary">
                                Rp {((quantity || 0) * (unitPrice || 0)).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-white p-4 rounded-xl border border-primary-100/30 space-y-3">
                        {type === 'income' && (
                            <div className="space-y-3">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                                    <input
                                        type="text"
                                        placeholder="Nama pembeli (opsional)"
                                        {...register('buyer')}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs uppercase">WA</div>
                                    <input
                                        type="tel"
                                        placeholder="Nomor WA (Contoh: 0812...)"
                                        {...register('buyer_phone')}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        )}
                        <textarea
                            placeholder="Catatan tambahan..."
                            {...register('notes')}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300 min-h-[80px]"
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-50 text-gray-500 font-medium rounded-2xl hover:bg-gray-100 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-primary text-white font-medium rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {loading ? <CircleNotch className="animate-spin" size={20} /> : <FloppyDisk size={20} weight="duotone" />}
                            <span>Simpan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

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

    const [editingTransaction, setEditingTransaction] = useState(null)
    const [selectedDetailTransaction, setSelectedDetailTransaction] = useState(null)
    const { updateTransaction, deleteTransaction } = useTransactionMutations()

    const { data: transactions, isLoading } = useTransactions({
        type: filterType,
        userId: profile?.role === 'member' ? profile.id : null
    })

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            try {
                await deleteTransaction.mutateAsync(id)
                toast.success('Transaksi berhasil dihapus')
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const handleSaveEdit = async (id, updates) => {
        try {
            await updateTransaction.mutateAsync({ id, ...updates })
            toast.success('Transaksi berhasil diperbarui')
            setEditingTransaction(null)
        } catch (error) {
            toast.error(error.message)
        }
    }

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

    const exportToExcel = () => {
        const dataToExport = filteredTransactions.map(t => ({
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
        XLSX.utils.book_append_sheet(wb, ws, "Daftar Transaksi")
        XLSX.writeFile(wb, `Transaksi_ThangunAfa_${format(new Date(), 'yyyyMMdd')}.xlsx`)
    }

    return (
        <div className="p-5 space-y-6 font-sans">
            <div className="flex items-center justify-between px-1">
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Riwayat Transaksi</h1>
                <button
                    onClick={exportToExcel}
                    disabled={!filteredTransactions || filteredTransactions.length === 0}
                    className="p-2 text-primary hover:text-primary-600 transition-all active:scale-90 disabled:opacity-30"
                >
                    <DownloadSimple size={24} weight="bold" />
                </button>
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
                    filteredTransactions.map((tx) => (
                        <TransactionCard
                            key={tx.id}
                            transaction={tx}
                            onClick={(transaction) => setSelectedDetailTransaction(transaction)}
                        />
                    ))
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

            {/* Detail Modal */}
            {selectedDetailTransaction && (
                <TransactionDetailModal
                    transaction={selectedDetailTransaction}
                    onClose={() => setSelectedDetailTransaction(null)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Edit Modal */}
            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    )
}

export default Transactions
