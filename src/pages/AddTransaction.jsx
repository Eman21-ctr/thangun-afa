import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, FloppyDisk, Sparkle } from '@phosphor-icons/react'
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
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 bg-white/80 backdrop-blur-lg border-b border-primary-100/50">
                <button type="button" onClick={() => navigate(-1)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-600 transition-colors">
                    <ArrowLeft size={20} weight="bold" />
                </button>
                <h1 className="text-lg font-black text-gray-800 tracking-tight">Catat Transaksi</h1>
                <div className="w-10"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-8 pb-32">
                {/* Type Toggle Container */}
                <div className="bg-white p-1.5 rounded-2xl border border-primary-100/30 flex shadow-sm">
                    <button
                        type="button"
                        onClick={() => setValue('type', 'income')}
                        className={clsx(
                            "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                            type === 'income' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400"
                        )}
                    >
                        Pemasukan
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('type', 'expense')}
                        className={clsx(
                            "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                            type === 'expense' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-gray-400"
                        )}
                    >
                        Pengeluaran
                    </button>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-primary-100/30 shadow-sm space-y-5">
                        <div className="flex items-center space-x-2 px-1 mb-2">
                            <Sparkle size={16} weight="fill" className="text-primary/60" />
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Detail Utama</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Tanggal</label>
                                <input
                                    type="date"
                                    {...register('date')}
                                    className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all"
                                />
                                {errors.date && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase">{errors.date.message}</p>}
                            </div>

                            {type === 'income' ? (
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Komoditas</label>
                                    <select
                                        {...register('commodity')}
                                        className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all appearance-none"
                                    >
                                        <option value="">Pilih Komoditas</option>
                                        {commodities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                    {errors.commodity && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase">{errors.commodity.message}</p>}
                                </div>
                            ) : (
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Kategori Biaya</label>
                                    <select
                                        {...register('category')}
                                        className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all appearance-none"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                    {errors.category && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase">{errors.category.message}</p>}
                                </div>
                            )}

                            <div className="col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Deskripsi/Keterangan</label>
                                <input
                                    type="text"
                                    placeholder="Misal: Hasil panen petak B"
                                    {...register('description')}
                                    className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-300"
                                />
                                {errors.description && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase">{errors.description.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-primary-100/30 shadow-sm space-y-5">
                        <div className="flex items-center space-x-2 px-1 mb-2">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kuantitas & Harga</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Jumlah</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    {...register('quantity', { valueAsNumber: true })}
                                    className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-extrabold text-gray-700 transition-all"
                                />
                                {errors.quantity && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase">{errors.quantity.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Satuan</label>
                                <input
                                    type="text"
                                    placeholder="kg, bok, dll"
                                    {...register('unit')}
                                    className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-300"
                                />
                                {errors.unit && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase">{errors.unit.message}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Harga Satuan (Rp)</label>
                                <input
                                    type="number"
                                    {...register('unit_price', { valueAsNumber: true })}
                                    className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-extrabold text-gray-700 transition-all"
                                />
                                {errors.unit_price && <p className="text-[10px] text-red-500 font-bold mt-1 px-1 uppercase">{errors.unit_price.message}</p>}
                            </div>
                        </div>

                        <div className="p-6 bg-primary-50/50 rounded-2xl border border-dashed border-primary-200 flex flex-col items-center">
                            <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mb-1">Estimasi Total</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">
                                Rp {((quantity || 0) * (unitPrice || 0)).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-primary-100/30 shadow-sm space-y-5">
                        <div className="flex items-center space-x-2 px-1 mb-2">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Informasi Tambahan</h2>
                        </div>

                        <div className="space-y-4">
                            {type === 'income' && (
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Pembeli (Opsional)</label>
                                    <input
                                        type="text"
                                        placeholder="Nama pembeli/tengkulak"
                                        {...register('buyer')}
                                        className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Catatan</label>
                                <textarea
                                    rows="3"
                                    placeholder="Tambahkan catatan jika perlu..."
                                    {...register('notes')}
                                    className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-300"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 inset-x-0 p-5 bg-white/80 backdrop-blur-xl border-t border-primary-100/50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <FloppyDisk size={20} weight="bold" />
                                <span>Simpan Catatan</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddTransaction
