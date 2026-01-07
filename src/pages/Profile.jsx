import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Envelope, ShieldCheck, SignOut, CaretRight, Plant, Ruler, PencilSimple, Check, X, CircleNotch } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const Profile = () => {
    const { profile, logout } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [landArea, setLandArea] = useState('')
    const [cultivatedCommodities, setCultivatedCommodities] = useState([])
    const [availableCommodities, setAvailableCommodities] = useState([])

    // Load initial data
    useEffect(() => {
        if (profile) {
            setLandArea(profile.land_area || '')
            setCultivatedCommodities(profile.cultivated_commodities || [])
        }
    }, [profile])

    // Fetch available commodities
    useEffect(() => {
        const fetchCommodities = async () => {
            const { data, error } = await supabase
                .from('commodities')
                .select('name')
                .eq('is_active', true)
                .order('name')
            if (!error && data) {
                setAvailableCommodities(data.map(c => c.name))
            }
        }
        fetchCommodities()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    land_area: landArea,
                    cultivated_commodities: cultivatedCommodities
                })
                .eq('id', profile.id)

            if (error) throw error
            toast.success('Profil berhasil diperbarui')
            setIsEditing(false)
        } catch (error) {
            toast.error('Gagal menyimpan: ' + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    const toggleCommodity = (commodity) => {
        setCultivatedCommodities(prev =>
            prev.includes(commodity)
                ? prev.filter(c => c !== commodity)
                : [...prev, commodity]
        )
    }

    return (
        <div className="p-5 space-y-6 font-sans">
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight px-1">Profil Saya</h1>

            {/* Compact Profile Header Card */}
            <div className="bg-white p-5 rounded-2xl border border-primary-100/50 shadow-sm flex items-center space-x-4">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary text-xl font-semibold border-2 border-white shadow-lg flex-shrink-0">
                    {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-800 tracking-tight truncate">{profile?.full_name}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[9px] font-medium px-2.5 py-0.5 bg-primary text-white rounded-full uppercase tracking-wider">
                            {profile?.role?.replace('_', ' ')}
                        </span>
                        {profile?.position && (
                            <span className="text-[9px] font-medium px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full uppercase tracking-wider">
                                {profile?.position}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Account Info */}
            <div className="space-y-3">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest px-2">Informasi Akun</h3>
                <div className="bg-white rounded-2xl border border-primary-100/40 divide-y divide-gray-50 overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary-50 text-primary rounded-xl">
                                <Envelope size={16} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-gray-400 uppercase">Email</p>
                                <p className="text-sm font-normal text-gray-800">{profile?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary-50 text-primary rounded-xl">
                                <ShieldCheck size={16} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-gray-400 uppercase">Status Akun</p>
                                <p className="text-sm font-normal text-gray-800">Terverifikasi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Farm Info - CRUD */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest">Informasi Usaha Tani</h3>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center text-xs text-primary font-medium"
                        >
                            <PencilSimple size={14} weight="duotone" className="mr-1" />
                            Edit
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <X size={18} weight="duotone" />
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <CircleNotch size={14} className="animate-spin mr-1" />
                                ) : (
                                    <Check size={14} weight="duotone" className="mr-1" />
                                )}
                                Simpan
                            </button>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-2xl border border-primary-100/40 divide-y divide-gray-50 overflow-hidden">
                    {/* Land Area */}
                    <div className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-accent-50 text-primary rounded-xl">
                                <Ruler size={16} weight="duotone" />
                            </div>
                            <p className="text-[10px] font-medium text-gray-400 uppercase">Luas Lahan</p>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={landArea}
                                onChange={(e) => setLandArea(e.target.value)}
                                placeholder="Contoh: 500 m² atau 0.5 hektar"
                                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        ) : (
                            <p className="text-sm font-normal text-gray-800 pl-11">
                                {landArea || <span className="text-gray-400 italic">Belum diisi</span>}
                            </p>
                        )}
                    </div>

                    {/* Cultivated Commodities */}
                    <div className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-accent-50 text-primary rounded-xl">
                                <Plant size={16} weight="duotone" />
                            </div>
                            <p className="text-[10px] font-medium text-gray-400 uppercase">Komoditas yang Dibudidaya</p>
                        </div>
                        {isEditing ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {availableCommodities.map(commodity => (
                                    <button
                                        key={commodity}
                                        onClick={() => toggleCommodity(commodity)}
                                        className={`px-3 py-1.5 text-xs font-normal rounded-full transition-all ${cultivatedCommodities.includes(commodity)
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {commodity}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="pl-11">
                                {cultivatedCommodities.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {cultivatedCommodities.map(c => (
                                            <span key={c} className="px-2.5 py-1 bg-primary-50 text-primary text-xs font-normal rounded-full">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Belum diisi</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest px-2">Aksi</h3>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100/50 rounded-2xl border border-red-100 transition-all active:scale-[0.98] group"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20">
                            <SignOut size={16} weight="bold" />
                        </div>
                        <span className="font-medium text-red-600">Keluar dari Akun</span>
                    </div>
                    <CaretRight size={18} weight="bold" className="text-red-300 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="py-8 text-center">
                <p className="text-[10px] font-medium text-gray-300 uppercase tracking-[0.3em]">Thangun Afa • v1.1.0</p>
            </div>
        </div>
    )
}

export default Profile
