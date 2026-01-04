import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { Newspaper, ArrowLeft, Calendar, CircleNotch, ArrowRight } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const AllNews = () => {
    const { news, isLoading } = useContent()
    const publishedNews = news.filter(a => a.is_published)

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
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 text-primary group">
                        <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold">Kembali</span>
                    </Link>
                    <h1 className="text-sm font-bold text-gray-800">Arsip berita</h1>
                    <img src="/images/logo-color.png" alt="Thangun Afa" className="h-8 w-auto hidden md:block" />
                </div>
            </nav>

            <main className="pt-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-10">
                        {publishedNews.map((item) => (
                            <Link
                                to={`/news/${item.slug}`}
                                key={item.id}
                                className="group block bg-white p-5 rounded-[2.5rem] border border-primary-100/10 hover:shadow-2xl hover:shadow-primary/5 transition-all"
                            >
                                <div className="aspect-[16/10] bg-gray-100 overflow-hidden mb-5 border border-primary-50">
                                    <img
                                        src={item.thumbnail_url || '/images/hero-2.jpg'}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="flex items-center space-x-3 text-[10px] font-black text-primary uppercase tracking-widest mb-3">
                                    <Newspaper size={16} weight="duotone" />
                                    <span>{item.published_at ? format(new Date(item.published_at), 'dd MMMM yyyy', { locale: id }) : 'Baru Saja'}</span>
                                </div>
                                <h3 className="text-lg font-black text-gray-800 tracking-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-5 leading-relaxed">
                                    {item.content}
                                </p>
                                <div className="flex items-center space-x-2 text-xs font-bold text-primary">
                                    <span>Baca lengkap</span>
                                    <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AllNews
