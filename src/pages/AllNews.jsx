import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { Newspaper, Calendar, ArrowRight } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import PublicFooter from '../components/layout/PublicFooter'
import PublicNavbar from '../components/layout/PublicNavbar'

const AllNews = () => {
    const { news, isLoading } = useContent()
    const publishedNews = news.filter(a => a.is_published)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Navigation */}
            <PublicNavbar />

            <main className="pt-28 px-6 flex-grow">
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="grid md:grid-cols-3 gap-10">
                        {publishedNews.map((item) => (
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
                                <div className="flex items-center space-x-3 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                                    <Newspaper size={16} weight="duotone" />
                                    <span>{item.published_at ? format(new Date(item.published_at), 'dd MMMM yyyy', { locale: id }) : 'Baru Saja'}</span>
                                </div>
                                <h3 className="text-lg font-normal text-gray-800 tracking-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-5 leading-relaxed">
                                    {item.content}
                                </p>
                                <div className="flex items-center space-x-2 text-xs font-normal text-primary">
                                    <span>Baca lengkap</span>
                                    <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    )
}

export default AllNews
