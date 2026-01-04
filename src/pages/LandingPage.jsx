import { Link, useNavigate } from 'react-router-dom'
import { Plant, Users, MapPin, WhatsappLogo, InstagramLogo, Leaf, ArrowRight, Heart, Drop, Sun, CircleNotch, Newspaper, Star, X, List } from '@phosphor-icons/react'
import { useContent } from '../hooks/useContent'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { clsx } from 'clsx'
import { useState } from 'react'

const iconMap = {
    Drop: Drop,
    Users: Users,
    Sun: Sun,
    Star: Star,
    Plant: Plant
}

const LandingPage = () => {
    const { settings, gallery, team, news, isLoading } = useContent()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <CircleNotch className="animate-spin text-primary" size={40} weight="bold" />
            </div>
        )
    }

    const whatsappLink = `https://wa.me/${settings?.whatsapp_number || '6281234567890'}`

    const navLinks = [
        { name: 'Beranda', href: '#' },
        { name: 'Tentang', href: '/about' },
        { name: 'Tim', href: '#tim' },
        { name: 'Berita', href: '#berita' },
        { name: 'Galeri', href: '#galeri' },
    ]

    return (
        <div className="min-h-screen bg-cream font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-primary-100/20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src="/images/logo-color.png" alt="Thangun Afa" className="h-10 w-auto" />
                    </div>

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 text-primary hover:bg-primary-50 rounded-xl transition-all"
                    >
                        {menuOpen ? <X size={28} weight="bold" /> : <List size={28} weight="bold" />}
                    </button>
                </div>

                {/* Navigation Menu Overlay */}
                {menuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-primary-100 shadow-2xl animate-in slide-in-from-top duration-300">
                        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Navigasi</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary-50 hover:text-primary rounded-xl transition-all"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Personal</p>
                                <Link
                                    to="/login"
                                    className="flex items-center justify-between px-4 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <span>Masuk ke dashboard</span>
                                    <ArrowRight size={18} weight="bold" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-start pt-28 md:pt-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="/images/hero-2.jpg"
                        alt="Kelompok Tani Thangun Afa"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-cream"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-6 w-full">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold uppercase tracking-widest mb-4">
                        <Leaf size={14} weight="fill" />
                        <span>{settings?.address?.split(',')[0] || 'Desa Besmarak'}, Kupang, NTT</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-4">
                        {settings?.hero_title}
                    </h1>
                    <p className="text-base md:text-lg text-white/80 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
                        {settings?.hero_description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 px-10 py-5 bg-white text-primary text-base font-bold rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <WhatsappLogo size={24} weight="fill" />
                            <span>Hubungi kami</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="tentang" className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="relative">
                            <img
                                src="/images/hero-1.jpg"
                                alt="Tim Thangun Afa di ladang"
                                className="rounded-[2rem] shadow-2xl shadow-primary/10"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-accent p-5 rounded-2xl shadow-xl hidden md:block border-4 border-white">
                                <p className="text-3xl font-black text-primary">30+</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Petani muda</p>
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-accent-100 rounded-full text-primary text-xs font-bold shadow-sm">
                                <Plant size={14} weight="fill" className="text-accent" />
                                <span>Tentang kami</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter leading-tight">
                                Pertanian Cerdas<br />untuk Masa Depan
                            </h2>
                            <div className="space-y-4 text-gray-500 leading-relaxed whitespace-pre-line line-clamp-[8]">
                                {settings?.about_text}
                            </div>
                            <Link
                                to="/about"
                                className="inline-flex items-center space-x-2 text-xs font-bold text-primary hover:text-accent transition-colors group"
                            >
                                <span>Selengkapnya tentang kami</span>
                                <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Tim Kami Section */}
            <section id="tim" className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-accent-100 rounded-full text-primary text-xs font-bold mb-3 shadow-sm">
                            <span>Tim kami</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter">Orang di balik layar</h2>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-6">
                        {(team.length > 0 ? team : [1, 2, 3, 4]).map((m, i) => (
                            <div key={m.id || i} className="text-center group">
                                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 rounded-full overflow-hidden bg-primary-50 ring-2 ring-primary/10 group-hover:ring-primary transition-all duration-500 shadow-sm">
                                    <img
                                        src={m.photo_url || `/images/member-${(i % 2) + 1}.jpg`}
                                        alt={m.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <h3 className="text-[9px] md:text-xs font-black text-gray-800 tracking-tight leading-tight">
                                    {m.name || 'Anggota Tim'}
                                </h3>
                                <p className="text-[7px] md:text-[9px] font-bold text-primary/60 uppercase mt-0.5 tracking-widest leading-none">
                                    {m.position || 'Petani'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* News/Activity Section */}
            {news.filter(a => a.is_published).length > 0 && (
                <section id="berita" className="py-12 px-6 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <div className="text-left">
                                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-accent-100 rounded-full text-primary text-xs font-bold mb-3 shadow-sm">
                                    <span>Berita & kegiatan</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter">Update terbaru kami</h2>
                            </div>
                            <Link to="/news" className="hidden md:flex items-center space-x-2 px-6 py-3 bg-accent text-primary text-xs font-bold rounded-2xl shadow-lg shadow-accent/20 hover:scale-105 transition-all">
                                <span>Lihat semua berita</span>
                                <ArrowRight size={14} weight="bold" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-10">
                            {news.filter(a => a.is_published).slice(0, 3).map((item) => (
                                <Link
                                    to={`/news/${item.slug}`}
                                    key={item.id}
                                    className="group block"
                                >
                                    <div className="aspect-[16/10] bg-gray-100 overflow-hidden mb-5 border border-primary-50">
                                        <img
                                            src={item.thumbnail_url || '/images/hero-2.jpg'}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3 text-[10px] font-bold text-primary mb-3">
                                        <Newspaper size={16} weight="duotone" />
                                        <span>{item.published_at ? format(new Date(item.published_at), 'dd MMMM yyyy', { locale: id }) : 'Baru saja'}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 tracking-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-5 leading-relaxed">
                                        {item.content}
                                    </p>
                                    <div className="flex items-center space-x-2 text-xs font-bold text-primary">
                                        <span>Selengkapnya</span>
                                        <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-10 text-center md:hidden">
                            <Link to="/news" className="inline-flex items-center space-x-2 px-8 py-4 bg-accent text-primary text-xs font-bold rounded-2xl shadow-xl shadow-accent/20">
                                <span>Lihat semua berita</span>
                                <ArrowRight size={14} weight="bold" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Momen Berharga - Gallery */}
            <section id="galeri" className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div className="text-left">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-accent-100 rounded-full text-primary text-xs font-bold mb-3 shadow-sm">
                                <span>Momen berharga</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter">Galeri kegiatan</h2>
                        </div>
                        <Link to="/gallery" className="hidden md:flex items-center space-x-2 px-6 py-3 bg-accent text-primary text-xs font-bold rounded-2xl shadow-lg shadow-accent/20 hover:scale-105 transition-all">
                            <span>Lihat semua foto</span>
                            <ArrowRight size={14} weight="bold" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(gallery.length > 0 ? gallery.slice(0, 8) : [1, 2, 3, 4, 5, 6, 7, 8]).map((photo, i) => {
                            const isLandscape = photo.display_type === 'landscape'
                            return (
                                <div key={photo.id || i} className={clsx("space-y-3", isLandscape ? "col-span-2" : "col-span-1")}>
                                    <div className={clsx(
                                        "bg-white rounded-[2.5rem] overflow-hidden border border-primary-100/50 shadow-sm group",
                                        isLandscape ? "aspect-video" : "aspect-[4/5]"
                                    )}>
                                        <img
                                            src={photo.photo_url || `/images/activity-1.jpg`}
                                            alt={photo.caption}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500 text-center px-4 leading-relaxed">
                                        {photo.caption || 'Momen kegiatan kelompok tani Thangun Afa.'}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-10 text-center md:hidden">
                        <Link to="/gallery" className="inline-flex items-center space-x-2 px-8 py-4 bg-accent text-primary text-xs font-bold rounded-2xl shadow-xl shadow-accent/20">
                            <span>Lihat semua foto</span>
                            <ArrowRight size={14} weight="bold" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 px-6 bg-primary">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
                        Tertarik Bermitra?
                    </h2>
                    <p className="text-primary-100 text-base mb-8 max-w-xl mx-auto">
                        Hubungi kami untuk informasi lebih lanjut tentang komoditas pertanian segar atau peluang kerjasama.
                    </p>
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-3 px-10 py-5 bg-accent text-primary text-sm font-bold rounded-2xl shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <WhatsappLogo size={24} weight="fill" />
                        <span>Hubungi via WhatsApp</span>
                        <ArrowRight size={20} weight="bold" />
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-6 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <img src="/images/logo-white.png" alt="Thangun Afa White" className="h-10 w-auto opacity-80" />
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
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 rounded-xl hover:bg-primary transition-colors">
                                <WhatsappLogo size={20} weight="fill" />
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-xs">
                        <p>© 2026 Thangun Afa Besmarak. Hak Cipta Dilindungi.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
