import { useParams, Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { Newspaper, ArrowLeft, Calendar, CircleNotch, MapPin, WhatsappLogo, InstagramLogo } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const NewsDetail = () => {
    const { slug } = useParams()
    const { useNewsArticle, settings } = useContent()
    const { data: article, isLoading } = useNewsArticle(slug)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <CircleNotch className="animate-spin text-primary" size={40} weight="bold" />
            </div>
        )
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-6 text-center">
                <h1 className="text-2xl font-black text-gray-800 mb-4">Berita tidak ditemukan</h1>
                <Link to="/" className="px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-lg">Kembali ke Beranda</Link>
            </div>
        )
    }

    const whatsappLink = `https://wa.me/${settings?.whatsapp_number || '6281234567890'}`

    return (
        <div className="min-h-screen bg-cream font-sans pb-20">
            {/* Header / Nav */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary-100/30">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 text-primary group">
                        <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Kembali</span>
                    </Link>
                    <img src="/images/logo-color.png" alt="Thangun Afa" className="h-8 w-auto" />
                </div>
            </nav>

            {/* Content */}
            <main className="pt-24 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Meta */}
                    <div className="flex items-center space-x-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                        <div className="px-3 py-1 bg-primary-50 rounded-full flex items-center space-x-2">
                            <Calendar size={14} weight="fill" />
                            <span>{article.published_at ? format(new Date(article.published_at), 'dd MMMM yyyy', { locale: id }) : 'Baru Saja'}</span>
                        </div>
                        <div className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full">
                            <span>Kegiatan</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-gray-800 leading-tight tracking-tighter mb-8">
                        {article.title}
                    </h1>

                    <div className="aspect-[16/9] w-full bg-gray-200 overflow-hidden mb-10 shadow-2xl shadow-primary/5">
                        <img
                            src={article.thumbnail_url || '/images/hero-2.jpg'}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                        {article.content}
                    </div>

                    {/* Footer / Share Placeholder */}
                    <div className="mt-16 pt-10 border-t border-primary-100/50 flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <MapPin size={24} weight="fill" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lokasi Kami</p>
                                <p className="text-sm font-bold text-gray-800">{settings?.address}</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                <WhatsappLogo size={24} weight="fill" />
                            </a>
                            <a href={(settings?.instagram_url)} target="_blank" rel="noopener noreferrer" className="p-4 bg-white text-primary border border-primary-100 rounded-2xl shadow-lg hover:scale-105 transition-all">
                                <InstagramLogo size={24} weight="fill" />
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default NewsDetail
