import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { ArrowLeft, CircleNotch, Plant, Target, Eye, Scroll, MapPin, WhatsappLogo, InstagramLogo } from '@phosphor-icons/react'

const AboutUs = () => {
    const { settings, isLoading } = useContent()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <CircleNotch className="animate-spin text-primary" size={40} weight="bold" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream font-sans pb-20">
            {/* Header / Nav */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary-100/30">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 text-primary group">
                        <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold">Kembali</span>
                    </Link>
                    <h1 className="text-sm font-bold text-gray-800">Tentang Thangun Afa</h1>
                    <img src="/images/logo-color.png" alt="Thangun Afa" className="h-8 w-auto hidden md:block" />
                </div>
            </nav>

            <main className="pt-28 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Hero Image / Intro */}
                    <div className="space-y-10">
                        <div className="min-h-[400px] w-full bg-gray-200 rounded-none overflow-hidden shadow-2xl relative">
                            <img
                                src="/images/hero-1.jpg"
                                alt="Kelompok Tani Thangun Afa"
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-bottom p-8 md:p-12">
                                <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-none mt-auto">
                                    Yang muda<br /><span className="text-accent">yang bertani</span>
                                </h1>
                            </div>
                        </div>

                        {/* Sejarah Section */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-accent-100 rounded-full text-primary text-xs font-bold shadow-sm">
                                <span>Sejarah kami</span>
                            </div>
                            <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                                {settings?.about_history || settings?.about_text}
                            </div>
                        </div>
                    </div>

                    {/* Visi, Misi & Filosofi Section */}
                    <div className="grid md:grid-cols-3 gap-8 pt-10 border-t border-primary-100/20">
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center text-primary">
                                <Target size={32} weight="duotone" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Visi</h2>
                            <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                {settings?.about_vision || "Menjadi kelompok tani mandiri yang mampu mengintegrasikan teknologi modern dengan kearifan lokal NTT."}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center text-primary">
                                <Eye size={32} weight="duotone" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Misi</h2>
                            <div className="text-gray-500 leading-relaxed font-medium text-sm whitespace-pre-line">
                                {settings?.about_mission || "• Menerapkan Smart Farming\n• Meningkatkan kualitas SDM\n• Membangun akses pasar"}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center text-primary">
                                <Scroll size={32} weight="duotone" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Filosofi</h2>
                            <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                {settings?.about_philosophy || "Tanah adalah amanah, dikelola dengan semangat gotong royong masyarakat Besmarak."}
                            </p>
                        </div>
                    </div>

                    <div className="text-center pt-6">
                        <Link to="/" className="inline-flex items-center space-x-2 px-8 py-4 bg-accent text-primary text-xs font-bold rounded-2xl shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                            <span>Kembali ke beranda</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer - Exactly like LandingPage */}
            <footer className="bg-gray-900 text-white py-16 px-6 mt-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <img src="/images/logo-icon.png" alt="Thangun Afa" className="h-12 w-auto brightness-0 invert" />
                            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                                Kelompok Tani Thangun Afa Desa Besmarak. Memberdayakan petani lokal melalui teknologi dan kolaborasi.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-white">Hubungi kami</h4>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <MapPin size={16} weight="fill" />
                                <span className="text-sm">{settings?.address || 'Desa Besmarak, Kec. Nekamese, Kab. Kupang, NTT'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                {settings?.instagram_url && (
                                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 rounded-xl hover:bg-primary transition-colors">
                                        <InstagramLogo size={20} weight="fill" />
                                    </a>
                                )}
                                <a href={`https://wa.me/${settings?.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 rounded-xl hover:bg-primary transition-colors">
                                    <WhatsappLogo size={20} weight="fill" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
                        <p>© 2026 Thangun Afa Besmarak. Hak Cipta Dilindungi.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default AboutUs
