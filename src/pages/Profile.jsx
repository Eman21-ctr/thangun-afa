import { useAuth } from '../context/AuthContext'
import { User, Envelope, ShieldCheck, SignOut, CaretRight } from '@phosphor-icons/react'

const Profile = () => {
    const { profile, logout } = useAuth()

    return (
        <div className="p-5 space-y-8 font-sans">
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight px-1">Profil Saya</h1>

            {/* Profile Header Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-primary-100/50 shadow-sm flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary text-3xl font-black border-4 border-white shadow-xl">
                        {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                </div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight">{profile?.full_name}</h2>
                <div className="mt-2 flex items-center space-x-2">
                    <span className="text-[10px] font-black px-3 py-1 bg-primary text-white rounded-full uppercase tracking-widest">
                        {profile?.role?.replace('_', ' ')}
                    </span>
                    {profile?.position && (
                        <span className="text-[10px] font-bold px-3 py-1 bg-gray-100 text-gray-500 rounded-full uppercase tracking-widest">
                            {profile?.position}
                        </span>
                    )}
                </div>
            </div>

            {/* Account Info */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Informasi Akun</h3>
                <div className="bg-white rounded-[2rem] border border-primary-100/40 divide-y divide-gray-50 overflow-hidden">
                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-primary-50 text-primary rounded-xl">
                                <Envelope size={18} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                                <p className="text-sm font-bold text-gray-800">{profile?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-primary-50 text-primary rounded-xl">
                                <ShieldCheck size={18} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Status Akun</p>
                                <p className="text-sm font-bold text-gray-800">Terverifikasi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Aksi</h3>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-between p-5 bg-red-50 hover:bg-red-100/50 rounded-[2rem] border border-red-100 transition-all active:scale-[0.98] group"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20">
                            <SignOut size={18} weight="bold" />
                        </div>
                        <span className="font-extrabold text-red-600">Keluar dari Akun</span>
                    </div>
                    <CaretRight size={20} weight="bold" className="text-red-300 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="py-10 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Thangun Afa • v1.1.0</p>
            </div>
        </div>
    )
}

export default Profile
