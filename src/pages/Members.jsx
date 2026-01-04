import { useState } from 'react'
import { useMembers } from '../hooks/useMembers'
import { Users, UserGear, CircleNotch, ShieldCheck, CaretRight, X } from '@phosphor-icons/react'
import { toast } from 'react-hot-toast'
import { clsx } from 'clsx'
import { useAuth } from '../context/AuthContext'

const MemberCard = ({ member, onEdit }) => (
    <div className="bg-white p-5 rounded-3xl border border-primary-100/40 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all group">
        <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary text-xl font-black border-2 border-white shadow-sm">
                {member.full_name?.charAt(0) || 'U'}
            </div>
            <div>
                <p className="font-extrabold text-gray-800 tracking-tight">{member.full_name}</p>
                <div className="flex items-center mt-1 space-x-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 bg-primary-50 text-primary rounded-full uppercase tracking-widest border border-primary-100/50">
                        {member.role?.replace('_', ' ')}
                    </span>
                    {member.position && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{member.position}</span>
                    )}
                </div>
            </div>
        </div>
        <button
            onClick={() => onEdit(member)}
            className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-primary-50 hover:text-primary transition-all group-hover:translate-x-1"
        >
            <CaretRight size={20} weight="bold" />
        </button>
    </div>
)

const Members = () => {
    const { profile } = useAuth()
    const { members, isLoading, updateMember } = useMembers()
    const [editingMember, setEditingMember] = useState(null)
    const [formData, setFormData] = useState({ full_name: '', role: '', position: '' })

    if (profile?.role !== 'super_admin') {
        return (
            <div className="p-8 text-center py-32 bg-cream min-h-screen font-sans">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                    <Users size={40} weight="duotone" />
                </div>
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Akses Dibatasi</h1>
                <p className="text-gray-400 text-sm mt-3 px-8 leading-relaxed">
                    Halaman manajemen anggota hanya dapat diakses oleh Super Admin Thangun Afa.
                </p>
            </div>
        )
    }

    const handleEdit = (member) => {
        setEditingMember(member)
        setFormData({
            full_name: member.full_name || '',
            role: member.role || '',
            position: member.position || ''
        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await updateMember.mutateAsync({
                id: editingMember.id,
                ...formData
            })
            toast.success('Data anggota berhasil diperbarui')
            setEditingMember(null)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="p-5 space-y-8 font-sans pb-28">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Manajemen Anggota</h1>
                    <p className="text-xs text-gray-400 font-medium">Kelola hak akses dan informasi pengurus.</p>
                </div>
                <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                    <Users size={24} weight="duotone" />
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-primary/30">
                        <CircleNotch className="animate-spin mb-4" size={40} weight="bold" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Sinkronisasi Data...</p>
                    </div>
                ) : (
                    members?.map(member => (
                        <MemberCard key={member.id} member={member} onEdit={handleEdit} />
                    ))
                )}
            </div>

            {/* Info Card */}
            <div className="bg-primary-50/50 p-6 rounded-[2rem] border border-dashed border-primary-200/50 flex flex-col items-center text-center space-y-3">
                <ShieldCheck size={32} weight="duotone" className="text-primary/40" />
                <p className="text-[11px] text-primary-900/60 font-bold leading-relaxed px-4">
                    Penambahan anggota baru dilakukan melalui Dashboard Supabase secara manual untuk keamanan maksimal.
                </p>
            </div>

            {/* Edit Modal */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all">
                    <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Edit Profil Anggota</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{editingMember.email}</p>
                            </div>
                            <button onClick={() => setEditingMember(null)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-600 transition-colors">
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Role/Hadirat</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all appearance-none"
                                    >
                                        <option value="member">Anggota (Entry)</option>
                                        <option value="advisor">Advisor (View + Edit)</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Jabatan</label>
                                    <input
                                        type="text"
                                        placeholder="Mis: Sekretaris"
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full p-4 bg-gray-50/50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-gray-700 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={updateMember.isPending}
                                className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 mt-4"
                            >
                                {updateMember.isPending ? (
                                    <CircleNotch className="animate-spin" size={20} weight="bold" />
                                ) : (
                                    <>
                                        <UserGear size={20} weight="bold" />
                                        <span>Simpan Perubahan</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Members
