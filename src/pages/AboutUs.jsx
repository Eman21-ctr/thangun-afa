import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { ArrowLeft, CircleNotch, EnvelopeSimple, LockKey, MapPin, WhatsappLogo, InstagramLogo } from '@phosphor-icons/react'

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
        <div className="min-h-screen bg-cream font-sans">
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

            <main className="pt-28">
                <div className="max-w-4xl mx-auto px-6 mb-20">
                    {/* Perjalanan Kami Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-normal text-gray-900 tracking-tight">Perjalanan Kami</h2>
                    </div>

                    {/* Hero Image */}
                    <div className="w-full bg-gray-200 rounded-none overflow-hidden shadow-2xl mb-10">
                        <img
                            src="/images/hero-1.jpg"
                            alt="Kelompok Tani Thangun Afa"
                            className="w-full h-[400px] lg:h-[500px] object-cover"
                        />
                    </div>

                    {/* Content Text */}
                    <div className="prose prose-xl max-w-none text-gray-500 font-normal leading-relaxed whitespace-pre-line text-center lg:text-left">
                        {settings?.about_history || settings?.about_text}
                    </div>
                </div>

                {/* Visi & Misi Section - Dark Green Theme */}
                <div className="bg-primary px-6 py-20 text-white">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                        {/* Visi */}
                        <div className="space-y-6">
                            <div className="w-12 h-12 flex items-center justify-center text-accent">
                                <EnvelopeSimple size={32} weight="fill" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-normal tracking-tight">Visi</h2>
                            <p className="text-primary-100 leading-relaxed font-normal text-lg">
                                {settings?.about_vision || "Menjadi kelompok tani mandiri yang mampu mengintegrasikan teknologi modern dengan kearifan lokal NTT."}
                            </p>
                        </div>

                        {/* Misi */}
                        <div className="space-y-6">
                            <div className="w-12 h-12 flex items-center justify-center text-accent">
                                <LockKey size={32} weight="fill" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-normal tracking-tight">Misi</h2>
                            <div className="text-primary-100 leading-relaxed font-normal text-lg whitespace-pre-line">
                                {settings?.about_mission || "• Menerapkan Smart Farming\n• Meningkatkan kualitas SDM\n• Membangun akses pasar"}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer - Exactly like LandingPage, no margin top */}
            <footer className="bg-gray-900 text-white py-16 px-6">
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
