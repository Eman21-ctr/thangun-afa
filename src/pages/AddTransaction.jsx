import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, FloppyDisk, CalendarBlank, Tag, Package, Scales, CurrencyDollar, Notepad, User } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { clsx } from 'clsx'

const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    date: z.string().min(1, 'Tanggal wajib diisi'),
    category: z.string().optional(),
    commodity: z.string().optional(),
    description: z.string().min(3, 'Deskripsi minimal 3 karakter'),
    quantity: z.number().positive('Jumlah harus positif'),
    unit: z.string().min(1, 'Satuan wajib diisi'),
    unit_price: z.number().positive('Harga satuan harus positif'),
    total_amount: z.number().positive(),
    buyer: z.string().optional(),
    notes: z.string().optional(),
})

const AddTransaction = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const initialType = searchParams.get('type') || 'income'

    const [categories, setCategories] = useState([])
    const [commodities, setCommodities] = useState([])
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: initialType,
            date: new Date().toISOString().split('T')[0],
            quantity: 1,
            unit_price: 0,
            total_amount: 0,
            unit: initialType === 'income' ? 'kg' : 'pcs'
        }
    })

    const type = watch('type')
    const quantity = watch('quantity')
    const unitPrice = watch('unit_price')

    useEffect(() => {
        setValue('total_amount', (quantity || 0) * (unitPrice || 0))
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
        if (!user) {
            toast.error('Anda harus login terlebih dahulu')
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.from('transactions').insert({
                ...data,
                user_id: user.id
            })
            if (error) throw error
            toast.success('Transaksi berhasil disimpan')
            navigate('/transactions')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-cream min-h-screen font-sans">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-lg border-b border-primary-100/50">
                <button type="button" onClick={() => navigate(-1)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-gray-600 transition-colors">
                    <ArrowLeft size={18} weight="bold" />
                </button>
                <h1 className="text-base font-medium text-gray-800">Catat Transaksi</h1>
                <div className="w-8"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 pb-28">
                {/* Type Toggle */}
                <div className="bg-white p-1 rounded-xl border border-primary-100/30 flex">
                    <button
                        type="button"
                        onClick={() => setValue('type', 'income')}
                        className={clsx(
                            "flex-1 py-2.5 text-xs font-medium uppercase tracking-wide rounded-lg transition-all",
                            type === 'income' ? "bg-primary text-white shadow" : "text-gray-400"
                        )}
                    >
                        Pemasukan
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('type', 'expense')}
                        className={clsx(
                            "flex-1 py-2.5 text-xs font-medium uppercase tracking-wide rounded-lg transition-all",
                            type === 'expense' ? "bg-red-500 text-white shadow" : "text-gray-400"
                        )}
                    >
                        Pengeluaran
                    </button>
                </div>

                {/* Compact Form */}
                <div className="bg-white p-4 rounded-xl border border-primary-100/30 space-y-3">
                    {/* Date */}
                    <div className="relative">
                        <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                        <input
                            type="date"
                            {...register('date')}
                            className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm"
                        />
                    </div>

                    {/* Commodity/Category */}
                    {type === 'income' ? (
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                            <select
                                {...register('commodity')}
                                className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm appearance-none"
                            >
                                <option value="">Pilih Komoditas</option>
                                {commodities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                            <select
                                {...register('category')}
                                className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm appearance-none"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Description */}
                    <div className="relative">
                        <Notepad className="absolute left-3 top-3 text-gray-400" size={18} weight="duotone" />
                        <input
                            type="text"
                            placeholder="Deskripsi transaksi"
                            {...register('description')}
                            className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300"
                        />
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
                                className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Satuan (kg, bok)"
                            {...register('unit')}
                            className="w-full px-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300"
                        />
                    </div>

                    {/* Unit Price */}
                    <div className="relative">
                        <CurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                        <input
                            type="number"
                            placeholder="Harga satuan (Rp)"
                            {...register('unit_price', { valueAsNumber: true })}
                            className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm"
                        />
                    </div>

                    {/* Total Display */}
                    <div className="p-4 bg-primary-50/50 rounded-xl border border-dashed border-primary-200 flex items-center justify-between">
                        <span className="text-xs text-primary/60 font-medium">Estimasi Total</span>
                        <span className="text-xl font-semibold text-primary">
                            Rp {((quantity || 0) * (unitPrice || 0)).toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Additional Info (Collapsible-like) */}
                <div className="bg-white p-4 rounded-xl border border-primary-100/30 space-y-3">
                    {type === 'income' && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} weight="duotone" />
                            <input
                                type="text"
                                placeholder="Nama pembeli (opsional)"
                                {...register('buyer')}
                                className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300"
                            />
                        </div>
                    )}
                    <textarea
                        rows="2"
                        placeholder="Catatan tambahan (opsional)"
                        {...register('notes')}
                        className="w-full px-3 py-3 bg-gray-50/50 border border-primary-100/30 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-normal text-gray-700 text-sm placeholder:text-gray-300 resize-none"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="fixed bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-xl border-t border-primary-100/50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <FloppyDisk size={18} weight="duotone" />
                                <span>Simpan</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddTransaction
