import { Link, useNavigate } from 'react-router-dom'
import { Plant, Users, MapPin, WhatsappLogo, InstagramLogo, Leaf, ArrowRight, Heart, Drop, Sun, CircleNotch, Newspaper, Star, X, List } from '@phosphor-icons/react'
import { useContent } from '../hooks/useContent'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'

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
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
            <nav className={clsx(
                "fixed top-0 inset-x-0 z-[100] transition-all duration-500",
                scrolled
                    ? "bg-white/90 backdrop-blur-xl border-b border-primary-100/20 py-3 shadow-sm"
                    : "bg-transparent py-5"
            )}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <Link to="/" className="flex items-center">
                            <img
                                src="/images/logo-color.png"
                                alt="Thangun Afa"
                                className={clsx(
                                    "h-9 w-auto transition-all duration-500",
                                    !scrolled && "brightness-0 invert"
                                )}
                            />
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={clsx(
                                        "text-sm font-bold transition-colors duration-300",
                                        scrolled ? "text-gray-600 hover:text-primary" : "text-white/90 hover:text-accent"
                                    )}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/login"
                            className={clsx(
                                "hidden lg:block px-6 py-2 text-xs font-bold rounded-xl transition-all duration-500",
                                scrolled
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105"
                                    : "bg-white/20 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-primary"
                            )}
                        >
                            Masuk
                        </Link>

                        {/* Hamburger for mobile */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={clsx(
                                "lg:hidden p-2 transition-colors duration-500",
                                scrolled ? "text-primary" : "text-white"
                            )}
                        >
                            {menuOpen ? <X size={28} weight="bold" /> : <List size={28} weight="bold" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {menuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-primary-100 shadow-2xl lg:hidden">
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
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
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="px-4 py-4 bg-primary text-white text-sm font-bold rounded-xl text-center shadow-lg shadow-primary/20"
                                >
                                    Masuk Ke Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="/images/hero-2.jpg"
                        alt="Kelompok Tani Thangun Afa"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
                    <div className="max-w-3xl space-y-8">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/20 backdrop-blur-md rounded-full text-accent text-xs font-bold uppercase tracking-widest">
                            <Leaf size={14} weight="fill" />
                            <span>{settings?.address?.split(',')[0] || 'Desa Besmarak'}, NTT</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-[0.9] tracking-tighter">
                                {settings?.hero_title}
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 font-medium max-w-xl leading-relaxed">
                                {settings?.hero_description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-8 py-3.5 bg-accent text-primary text-base font-bold rounded-xl shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <WhatsappLogo size={22} weight="fill" />
                                <span>Hubungi kami sekarang</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="tentang" className="py-12 lg:py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Header - Center Aligned */}
                    <div className="text-center mb-8 lg:mb-16 space-y-3">
                        <div className="inline-flex items-center px-4 py-1.5 bg-gray-100 rounded-full text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>Tentang kami</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-tight">
                            Pertanian Cerdas untuk Masa Depan
                        </h2>
                    </div>

                    {/* Content Area - Side by Side on Desktop */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                        <div className="relative h-full">
                            <img
                                src="/images/hero-1.jpg"
                                alt="Tim Thangun Afa di ladang"
                                className="w-full aspect-[4/3] lg:aspect-[5/4] object-cover rounded-none shadow-xl"
                            />
                        </div>

                        <div className="space-y-6 lg:space-y-10">
                            <div className="text-base md:text-xl text-gray-600 leading-relaxed font-medium">
                                {settings?.about_text}
                            </div>

                            <div className="pt-2">
                                <Link
                                    to="/about"
                                    className="group flex items-center justify-between py-4 border-b border-gray-200 hover:border-primary transition-all"
                                >
                                    <span className="text-lg md:text-xl font-normal text-gray-900 group-hover:text-primary transition-colors">
                                        Selengkapnya tentang kami
                                    </span>
                                    <div className="p-2 bg-primary-50 rounded-full group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                                        <ArrowRight size={20} weight="bold" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Tim Kami Section */}
            {/* Tim Kami Section */}
            <section id="tim" className="py-12 lg:py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 lg:mb-20 space-y-3">
                        <div className="inline-flex items-center px-4 py-1.5 bg-gray-100 rounded-full text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>Tim kami</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-tight">
                            Yang Muda Yang Bertani
                        </h2>
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
                <section id="berita" className="py-12 lg:py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 lg:mb-20 space-y-3">
                            <div className="inline-flex items-center px-4 py-1.5 bg-gray-100 rounded-full text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span>Berita & kegiatan</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-tight">
                                Update terbaru dari kami
                            </h2>
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
                                    <h3 className="text-xl font-normal text-gray-900 tracking-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-5 leading-relaxed">
                                        {item.content}
                                    </p>
                                    <div className="flex items-center space-x-2 text-xs font-medium text-primary">
                                        <span>Selengkapnya</span>
                                        <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 lg:mt-12 w-full max-w-md mx-auto">
                            <Link to="/news" className="flex items-center justify-between w-full py-4 border-b border-gray-200 hover:border-primary transition-all group">
                                <span className="text-lg font-normal text-gray-900 group-hover:text-primary transition-colors">Lihat semua berita</span>
                                <div className="p-2 bg-gray-50 rounded-full group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                                    <ArrowRight size={20} weight="bold" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Momen Berharga - Gallery */}
            <section id="galeri" className="py-12 lg:py-24 px-6 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 lg:mb-20 space-y-3">
                        <div className="inline-flex items-center px-4 py-1.5 bg-white border border-gray-100 rounded-full text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>Momen berharga</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-tight">
                            Galeri kegiatan
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(gallery.length > 0 ? gallery.slice(0, 8) : [1, 2, 3, 4, 5, 6, 7, 8]).map((photo, i) => {
                            const isLandscape = photo.display_type === 'landscape'
                            return (
                                <div key={photo.id || i} className={clsx("space-y-3", isLandscape ? "col-span-2" : "col-span-1")}>
                                    <div className={clsx(
                                        "bg-white border border-primary-100/50 shadow-sm group",
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
                    <div className="mt-8 lg:mt-12 w-full max-w-md mx-auto">
                        <Link to="/gallery" className="flex items-center justify-between w-full py-4 border-b border-gray-200 hover:border-primary transition-all group">
                            <span className="text-lg font-normal text-gray-900 group-hover:text-primary transition-colors">Lihat semua foto</span>
                            <div className="p-2 bg-gray-50 rounded-full group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                                <ArrowRight size={20} weight="bold" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 px-6 bg-primary">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-normal text-white tracking-tighter mb-4">
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
