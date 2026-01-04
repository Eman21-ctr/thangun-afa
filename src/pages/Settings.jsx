import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { Plus, Tag, Plant, CircleNotch, ToggleLeft, ToggleRight, Sparkle } from '@phosphor-icons/react'
import { toast } from 'react-hot-toast'
import { clsx } from 'clsx'

const SettingItem = ({ item, table, onToggle }) => (
    <div className="flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-primary-100/40 shadow-sm active:scale-[0.98] transition-all">
        <div className="flex items-center space-x-4">
            <div className={clsx(
                "p-3 rounded-xl transition-all border-2",
                item.is_active
                    ? "bg-primary-50 text-primary border-white shadow-sm"
                    : "bg-gray-50 text-gray-300 border-transparent"
            )}>
                {table === 'commodities' ? <Plant size={20} weight="duotone" /> : <Tag size={20} weight="duotone" />}
            </div>
            <div>
                <p className={clsx(
                    "font-extrabold tracking-tight transition-all",
                    item.is_active ? "text-gray-800" : "text-gray-300 line-through"
                )}>
                    {item.name}
                </p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        item.is_active ? "bg-primary" : "bg-gray-300"
                    )}></div>
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400">
                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                    </p>
                </div>
            </div>
        </div>
        <button
            onClick={() => onToggle(table, item.id, !item.is_active)}
            className={clsx(
                "transition-all active:scale-125 p-1",
                item.is_active ? "text-primary" : "text-gray-200"
            )}
        >
            {item.is_active ? <ToggleRight size={32} weight="fill" /> : <ToggleLeft size={32} weight="regular" />}
        </button>
    </div>
)

const Settings = () => {
    const { categories, commodities, isLoading, addCategory, addCommodity, toggleActive } = useSettings()
    const [activeTab, setActiveTab] = useState('commodities')
    const [newName, setNewName] = useState('')

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!newName.trim()) return

        console.log('Adding:', activeTab, newName.trim())

        try {
            if (activeTab === 'commodities') {
                console.log('Calling addCommodity...')
                await addCommodity.mutateAsync({ name: newName.trim() })
            } else {
                console.log('Calling addCategory...')
                await addCategory.mutateAsync({ name: newName.trim() })
            }
            setNewName('')
            toast.success('Berhasil ditambahkan')
        } catch (error) {
            console.error('Error adding:', error)
            toast.error(error.message || 'Gagal menambahkan data')
        }
    }

    const handleToggle = async (table, id, is_active) => {
        try {
            await toggleActive.mutateAsync({ table, id, is_active })
            toast.success('Status berhasil diubah')
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="p-5 space-y-8 font-sans pb-28">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Pengaturan Grup</h1>
                    <p className="text-xs text-gray-400 font-medium">Manajemen kategori dan komoditas.</p>
                </div>
                <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                    <Tag size={24} weight="duotone" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-[1.25rem] border border-primary-100/30">
                <button
                    onClick={() => setActiveTab('commodities')}
                    className={clsx(
                        "flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-[1rem] transition-all",
                        activeTab === 'commodities' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400"
                    )}
                >
                    Komoditas
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={clsx(
                        "flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-[1rem] transition-all",
                        activeTab === 'categories' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400"
                    )}
                >
                    Kategori Biaya
                </button>
            </div>

            {/* Add Form */}
            <div className="flex space-x-3 group px-1">
                <input
                    type="text"
                    placeholder={`Tambah ${activeTab === 'commodities' ? 'komoditas' : 'biaya'} baru...`}
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd(e)}
                    className="flex-1 p-4 bg-white border border-primary-100/30 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 text-sm font-bold shadow-sm transition-all placeholder:text-gray-300"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={addCategory.isPending || addCommodity.isPending || !newName.trim()}
                    className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                >
                    <Plus size={20} weight="bold" />
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-primary/30">
                        <CircleNotch className="animate-spin mb-4" size={40} weight="bold" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Sinkronisasi...</p>
                    </div>
                ) : (
                    (activeTab === 'commodities' ? commodities : categories)?.map(item => (
                        <SettingItem
                            key={item.id}
                            item={item}
                            table={activeTab === 'commodities' ? 'commodities' : 'expense_categories'}
                            onToggle={handleToggle}
                        />
                    ))
                )}
            </div>

            {/* Footer Tip */}
            <div className="bg-primary-50/50 p-6 rounded-[2rem] border border-dashed border-primary-200/50 flex flex-col items-center text-center space-y-3">
                <Sparkle size={32} weight="duotone" className="text-primary/40" />
                <p className="text-[11px] text-primary-900/60 font-bold leading-relaxed px-4">
                    Item yang dinonaktifkan tidak akan muncul pada pilihan transaksi baru, namun data lama tetap terjaga.
                </p>
            </div>
        </div>
    )
}

export default Settings
