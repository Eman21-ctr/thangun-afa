import { useParams, Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { Calendar } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import PublicFooter from '../components/layout/PublicFooter'
import PublicNavbar from '../components/layout/PublicNavbar'

const NewsDetail = () => {
    const { slug } = useParams()
    const { useNewsArticle, settings } = useContent()
    const { data: article, isLoading } = useNewsArticle(slug)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
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

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Navigation */}
            <PublicNavbar />

            {/* Content */}
            <main className="pt-24 px-6 flex-grow">
                <div className="max-w-3xl mx-auto mb-20">
                    {/* Meta */}
                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-6">
                        <div className="flex items-center space-x-2 text-primary">
                            <Calendar size={18} weight="duotone" />
                            <span>{article.published_at ? format(new Date(article.published_at), 'dd MMMM yyyy', { locale: id }) : 'Baru Saja'}</span>
                        </div>
                        <div className="px-4 py-1.5 bg-gray-100 rounded-full text-gray-600">
                            <span>Kegiatan</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-normal text-gray-800 leading-tight tracking-tighter mb-8">
                        {article.title}
                    </h1>

                    <div className="aspect-[16/9] w-full bg-gray-200 overflow-hidden mb-10 shadow-2xl shadow-primary/5">
                        <img
                            src={article.thumbnail_url || '/images/hero-2.jpg'}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-600 font-normal leading-relaxed whitespace-pre-line">
                        {article.content}
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    )
}

export default NewsDetail
