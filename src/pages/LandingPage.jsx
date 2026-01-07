import { Link, useNavigate } from 'react-router-dom'
import {
    Plant, Users, MapPin, WhatsappLogo, InstagramLogo, Leaf, ArrowRight, Heart, Drop, Sun, CircleNotch, Newspaper, Star, List, X, Quotes, CaretLeft, CaretRight, CalendarBlank
} from '@phosphor-icons/react'
import { useContent } from '../hooks/useContent'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import PublicFooter from '../components/layout/PublicFooter'
import PublicNavbar from '../components/layout/PublicNavbar'
import MomentSlider from '../components/gallery/MomentSlider'

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

    const [currentSlide, setCurrentSlide] = useState(0)

    // Group gallery by caption into "Moments"
    const moments = gallery.reduce((acc, photo) => {
        const caption = photo.caption || 'Lainnya'
        if (!acc[caption]) {
            acc[caption] = { caption, photos: [], latest: photo.created_at }
        }
        acc[caption].photos.push(photo)
        if (new Date(photo.created_at) > new Date(acc[caption].latest)) {
            acc[caption].latest = photo.created_at
        }
        return acc
    }, {})

    const sortedMoments = Object.values(moments).sort((a, b) =>
        new Date(b.latest) - new Date(a.latest)
    )

    useEffect(() => {
        if (team.length === 0) return
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % team.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [team.length])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <CircleNotch className="animate-spin text-primary" size={40} weight="bold" />
            </div>
        )
    }

    const whatsappLink = `https://wa.me/${settings?.whatsapp_number || '6281234567890'}`

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + team.length) % team.length)
    }

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % team.length)
    }

    return (
        <div className="min-h-screen bg-cream font-sans overflow-x-hidden">
            {/* Navigation */}
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={settings?.hero_image_url || "/images/hero-2.jpg"}
                        alt="Kelompok Tani Thangun Afa"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
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
                                className="flex items-center space-x-2 px-5 py-2.5 text-primary text-sm font-bold rounded-xl shadow-xl shadow-[#cbae11]/20 hover:scale-105 active:scale-95 transition-all"
                                style={{ backgroundColor: '#cbae11' }}
                            >
                                <WhatsappLogo size={18} weight="fill" />
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
                            <span>{settings?.about_subtitle || 'Tentang Kami'}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal text-gray-900 tracking-tight leading-tight">
                            {settings?.about_title || 'Pertanian Cerdas untuk Masa Depan'}
                        </h2>
                    </div>

                    {/* Content Area - Side by Side on Desktop */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                        <div className="relative h-full">
                            <img
                                src={settings?.about_image_url || "/images/hero-1.jpg"}
                                alt="Tim Thangun Afa di ladang"
                                className="w-full aspect-[4/3] lg:aspect-[5/4] object-cover rounded-none shadow-xl"
                            />
                        </div>

                        <div className="space-y-6 lg:space-y-10">
                            <div className="text-lg md:text-[22px] text-gray-600 leading-relaxed font-normal">
                                {settings?.about_text}
                            </div>

                            <div className="pt-2">
                                <Link
                                    to="/about"
                                    className="group flex items-center justify-between py-4 border-b border-gray-200 hover:border-primary transition-all"
                                >
                                    <span className="text-lg md:text-xl font-normal text-gray-900 group-hover:text-primary transition-colors">
                                        Selengkapnya Tentang Kami
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
            <section id="tim" className="py-12 lg:py-24 px-6 bg-primary">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 lg:mb-20 space-y-3">
                        <div className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>{settings?.team_subtitle || 'Tim Kami'}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-tight">
                            {settings?.team_title || 'Yang Muda, Yang Bertani'}
                        </h2>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="overflow-hidden rounded-2xl bg-white border border-primary-100/20">
                            <div
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {(team.length > 0 ? team : [{ id: 1, name: 'Anggota Tim', position: 'Petani', quote: 'Kami bangga bertani untuk masa depan.' }]).map((m, i) => (
                                    <div key={m.id || i} className="w-full shrink-0 p-8 md:p-14 min-h-[400px] md:min-h-[450px] flex flex-col justify-center">
                                        <div className="space-y-12 text-left">
                                            <div className="relative">
                                                <p className="text-lg md:text-2xl font-normal text-gray-800 leading-relaxed">
                                                    "{m.quote || 'Berani bertani, berani mandiri untuk ketahanan pangan masa depan.'}"
                                                </p>
                                            </div>

                                            <div className="flex items-center space-x-4 pt-10 border-t border-gray-50">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-primary-100/50 border-2 border-primary-50">
                                                    <img
                                                        src={m.photo_url || `/images/member-${(i % 2) + 1}.jpg`}
                                                        alt={m.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-md md:text-lg font-black text-gray-900 tracking-tight leading-none">
                                                        {m.name || 'Anggota Tim'}
                                                    </h3>
                                                    <p className="text-[10px] md:text-xs font-bold text-primary uppercase mt-1.5 tracking-widest">
                                                        {m.position || 'Petani Muda'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        {team.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevSlide}
                                    className="absolute top-1/2 -translate-y-1/2 left-4 p-3 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors z-20"
                                >
                                    <CaretLeft size={24} weight="bold" />
                                </button>
                                <button
                                    onClick={goToNextSlide}
                                    className="absolute top-1/2 -translate-y-1/2 right-4 p-3 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors z-20"
                                >
                                    <CaretRight size={24} weight="bold" />
                                </button>
                            </>
                        )}

                        {/* Navigation Dots */}
                        <div className="flex flex-row justify-center items-center mt-10 gap-3">
                            {team.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`block w-2.5 h-2.5 min-h-0 min-w-0 rounded-full transition-all duration-500 shrink-0 cursor-pointer ${currentSlide === i ? "bg-primary" : "bg-primary/20"
                                        }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* News/Activity Section */}
            {news.filter(a => a.is_published).length > 0 && (
                <section id="berita" className="py-12 lg:py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 lg:mb-20 space-y-3">
                            <div className="inline-flex items-center px-4 py-1.5 bg-gray-100 rounded-full text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span>{settings?.news_subtitle || 'Berita & Kegiatan'}</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal text-gray-900 tracking-tight leading-tight">
                                {settings?.news_title || 'Update Terbaru dari Kami'}
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
                                        <CalendarBlank size={16} weight="duotone" />
                                        <span>{item.published_at ? format(new Date(item.published_at), 'dd MMMM yyyy', { locale: id }) : 'Baru saja'}</span>
                                    </div>
                                    <h3 className="text-[26px] font-normal text-gray-900 tracking-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-base text-gray-500 font-medium line-clamp-3 mb-5 leading-relaxed">
                                        {item.content}
                                    </p>
                                    <div className="flex items-center space-x-2 text-sm font-medium text-primary">
                                        <span>Selengkapnya</span>
                                        <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 lg:mt-12 w-full max-w-md mx-auto">
                            <Link to="/news" className="flex items-center justify-between w-full py-4 border-b border-gray-200 hover:border-primary transition-all group">
                                <span className="text-lg font-normal text-gray-900 group-hover:text-primary transition-colors">Lihat Semua Berita</span>
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
                            <span>{settings?.gallery_subtitle || 'Momen Berharga'}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal text-gray-900 tracking-tight leading-tight">
                            {settings?.gallery_title || 'Galeri Kegiatan'}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {(sortedMoments.length > 0 ? sortedMoments.slice(0, 2) : []).map((moment, i) => (
                            <MomentSlider key={i} moment={moment} />
                        ))}
                    </div>
                    <div className="mt-8 lg:mt-12 w-full max-w-md mx-auto">
                        <Link to="/gallery" className="flex items-center justify-between w-full py-4 border-b border-gray-200 hover:border-primary transition-all group">
                            <span className="text-lg font-normal text-gray-900 group-hover:text-primary transition-colors">Lihat Semua Foto</span>
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
                        className="inline-flex items-center space-x-2 px-6 py-3 text-primary text-sm font-bold rounded-xl shadow-xl shadow-[#cbae11]/20 hover:scale-105 active:scale-95 transition-all"
                        style={{ backgroundColor: '#cbae11' }}
                    >
                        <WhatsappLogo size={20} weight="fill" />
                        <span>Hubungi via WhatsApp</span>
                        <ArrowRight size={18} weight="bold" />
                    </a>
                </div>
            </section>

            {/* Footer */}
            <PublicFooter />
        </div>
    )
}

export default LandingPage
