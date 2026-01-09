import { useState } from 'react'
import { useMembers } from '../hooks/useMembers'
import { Users, UserGear, CircleNotch, ShieldCheck, CaretRight, X, Trash } from '@phosphor-icons/react'
import { toast } from 'react-hot-toast'
import { clsx } from 'clsx'
import { useAuth } from '../context/AuthContext'

const MemberCard = ({ member, onEdit }) => (
    <div className="bg-white p-3 rounded-xl border border-primary-100/40 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all group">
        <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary text-lg font-semibold border-2 border-white shadow-sm flex-shrink-0">
                {member.full_name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
                <p className="font-semibold text-gray-800 tracking-tight truncate text-sm">{member.full_name}</p>
                <div className="flex items-center mt-0.5 space-x-2">
                    <span className="text-[9px] font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-widest">
                        {member.role?.replace('_', ' ')}
                    </span>
                    {member.position && (
                        <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest truncate">{member.position}</span>
                    )}
                </div>
            </div>
        </div>
        <button
            onClick={() => onEdit(member)}
            className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-primary-50 hover:text-primary transition-all group-hover:translate-x-1"
        >
            <CaretRight size={18} weight="bold" />
        </button>
    </div>
)

const Members = () => {
    const { profile } = useAuth()
    const { data: members, isLoading, updateMember, createMember, deleteMember } = useMembers()
    const [editingMember, setEditingMember] = useState(null)
    const [isAddingMember, setIsAddingMember] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        identifier: '',
        password: '',
        role: 'member',
        position: ''
    })

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
            identifier: member.email || '',
            role: member.role || '',
            position: member.position || ''
        })
    }

    const handleAddClick = () => {
        setIsAddingMember(true)
        setFormData({
            full_name: '',
            identifier: '',
            password: '',
            role: 'member',
            position: ''
        })
    }

    const handleDelete = async () => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini? Akses login akan langsung dicabut.')) return
        try {
            await deleteMember.mutateAsync(editingMember.id)
            toast.success('Anggota berhasil dihapus')
            setEditingMember(null)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            if (isAddingMember) {
                await createMember.mutateAsync(formData)
                toast.success('Anggota baru berhasil ditambahkan')
                setIsAddingMember(false)
            } else {
                await updateMember.mutateAsync({
                    id: editingMember.id,
                    full_name: formData.full_name,
                    role: formData.role,
                    position: formData.position
                })
                toast.success('Data anggota berhasil diperbarui')
                setEditingMember(null)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="p-5 space-y-8 font-sans pb-28">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Manajemen Anggota</h1>
                    <p className="text-xs text-gray-400 font-medium">Kelola hak akses dan informasi pengurus.</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-primary text-white rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs font-semibold uppercase tracking-wider"
                >
                    <Users size={18} weight="bold" />
                    <span>Tambah</span>
                </button>
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

            {/* Info Card - Simplified */}
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 flex flex-col items-center text-center space-y-3">
                <ShieldCheck size={32} weight="duotone" className="text-primary/40" />
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed px-4">
                    Data login anggota dikelola sepenuhnya oleh Super Admin untuk keamanan maksimal kelompok.
                </p>
            </div>

            {/* Modal (Add/Edit) */}
            {(editingMember || isAddingMember) && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all">
                    <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
                                    {isAddingMember ? 'Tambah Anggota Baru' : 'Edit Profil Anggota'}
                                </h2>
                                {!isAddingMember && (
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">{formData.identifier}</p>
                                )}
                            </div>
                            <button onClick={() => { setEditingMember(null); setIsAddingMember(false); }} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg bg-gray-50 transition-colors">
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full p-3 bg-white border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    placeholder="Mis: Budi Santoso"
                                    required
                                />
                            </div>

                            {isAddingMember && (
                                <>
                                    <div className="space-y-1">
                                        <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Nomor HP / Nama Panggilan</label>
                                        <input
                                            type="text"
                                            value={formData.identifier}
                                            onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                                            className="w-full p-3 bg-white border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                            placeholder="Contoh: 0812... atau berto"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Password Sementara</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full p-3 bg-white border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                            placeholder="Minimal 6 karakter"
                                            minLength={6}
                                            required={isAddingMember}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Role/Hadirat</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full p-3 bg-white border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm appearance-none"
                                    >
                                        <option value="member">Anggota (Entry)</option>
                                        <option value="advisor">Advisor (View + Edit)</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Jabatan</label>
                                    <input
                                        type="text"
                                        placeholder="Mis: Sekretaris"
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full p-3 bg-white border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={updateMember.isPending || createMember.isPending}
                                className="w-full py-4 bg-primary text-white font-semibold uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 mt-2"
                            >
                                {updateMember.isPending || createMember.isPending ? (
                                    <CircleNotch className="animate-spin" size={20} weight="bold" />
                                ) : (
                                    <>
                                        <ShieldCheck size={20} weight="bold" />
                                        <span>{isAddingMember ? 'Daftarkan Anggota' : 'Simpan Perubahan'}</span>
                                    </>
                                )}
                            </button>

                            {!isAddingMember && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleteMember.isPending}
                                    className="w-full py-3 text-red-500 font-medium text-xs flex items-center justify-center space-x-2 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Trash size={16} weight="bold" />
                                    <span>Hapus Anggota Ini</span>
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Members
